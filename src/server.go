package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/unrolled/secure"
	bolt "go.etcd.io/bbolt"
	"golang.org/x/crypto/bcrypt"
)

const (
	dev = true
)

type server struct {
	db       *bolt.DB
	sessions *sessions.CookieStore
}

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type EncryptedCredentials struct {
	Username string
	Password []byte
}

// Authentication middleware
func (s *server) auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// We can obtain the session token from the requests cookies, which come with every request
		session, _ := s.sessions.Get(r, "session")
		if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (s *server) login(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	// Get the JSON body and decode into credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		// If the structure of the body is wrong, return an HTTP error
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var user EncryptedCredentials
	err = s.db.View(func(tx *bolt.Tx) error {
		v := tx.Bucket([]byte("Users")).Get([]byte(creds.Username))
		json.Unmarshal(v, &user)
		return nil
	})
	// fmt.Printf("%+v\n", user)

	if err = bcrypt.CompareHashAndPassword(user.Password, []byte(creds.Password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	session, _ := s.sessions.Get(r, "session")
	session.Values["authenticated"] = true
	session.Values["username"] = creds.Username
	session.Save(r, w)
	w.WriteHeader(http.StatusOK)
}

func initStorage() (*bolt.DB, error) {
	db, err := bolt.Open("series.db", 0600, nil)
	if err != nil {
		return nil, fmt.Errorf("could not open db, %v", err)
	}
	err = db.Update(func(tx *bolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte("Series"))
		if err != nil {
			return fmt.Errorf("could not create root bucket: %v", err)
		}
		_, err = tx.CreateBucketIfNotExists([]byte("Users"))
		if err != nil {
			return fmt.Errorf("could not create users bucket: %v", err)
		}
		return nil
	})
	if err != nil {
		return nil, fmt.Errorf("could not set up buckets, %v", err)
	}
	return db, nil
}

func (s *server) register(w http.ResponseWriter, r *http.Request) {

	var creds Credentials
	// Get the JSON body and decode into credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	log.Printf("Registering %+v\n", creds)

	var user EncryptedCredentials
	err = s.db.View(func(tx *bolt.Tx) error {
		v := tx.Bucket([]byte("Users")).Get([]byte(creds.Username))
		json.Unmarshal(v, &user)
		return nil
	})

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}
	if user.Username != "" {
		returnError(w, fmt.Sprintf("User %s already exists", user))
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), 8)

	encrypted := EncryptedCredentials{creds.Username, hashedPassword}
	err = s.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		encoded, err := json.Marshal(encrypted)
		if err != nil {
			return err
		}
		return b.Put([]byte(encrypted.Username), []byte(encoded))
	})

	if err != nil {
		returnError(w, "Error while inserting User")
		return
	}

	err = s.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("Series"))
		_, err := b.CreateBucketIfNotExists([]byte(encrypted.Username))
		if err != nil {
			return fmt.Errorf("could not create %s bucket: %v", encrypted.Username, err)
		}
		return nil
	})

	if err != nil {
		returnError(w, "Error while creating the child bucket.")
		return
	}

	session, _ := s.sessions.Get(r, "session")
	session.Values["authenticated"] = true
	session.Values["username"] = creds.Username
	session.Save(r, w)
	w.WriteHeader(http.StatusOK)
}

func main() {
	secureMiddleware := secure.New(secure.Options{
		// AllowedHosts:         []string{"sandr0\\.tk"},
		AllowedHostsAreRegex: false,
		// HostsProxyHeaders:    []string{"X-Forwarded-Host"},
		SSLRedirect: false,
		SSLHost:     "sandro.tk",
		// SSLProxyHeaders:       map[string]string{"X-Forwarded-Proto": "https"},
		STSSeconds:           31536000,
		STSIncludeSubdomains: true,
		STSPreload:           true,
		ForceSTSHeader:       true,
		FrameDeny:            true,
		ContentTypeNosniff:   true,
		BrowserXssFilter:     true,
		ContentSecurityPolicy: `
		default-src 'self' use.fontawesome.com data:;
		font-src 'self' fonts.gstatic.com use.fontawesome.com;
		img-src 'self' data:;
		style-src 'unsafe-inline' 'self' use.fontawesome.com fonts.googleapis.com;
		script-src 'self' 'unsafe-inline' unpkg.com;
		base-uri 'none';
		form-action 'self';`,
		// PublicKey:             `pin-sha256="base64+primary=="; pin-sha256="base64+backup=="; max-age=5184000; includeSubdomains; report-uri="https://www.example.com/hpkp-report"`,
		ReferrerPolicy: "same-origin",
		FeaturePolicy:  "vibrate 'none'; geolocation 'none'; speaker 'none'; camera 'none'; microphone 'none'; notifications 'none';",
		IsDevelopment:  dev,
	})

	port := 8083
	db, _ := initStorage()
	s := server{db, sessions.NewCookieStore([]byte("super-secret-key"))}

	r := mux.NewRouter()

	r.Use(secureMiddleware.Handler)

	api := r.PathPrefix("/api").Subrouter()
	api.Use(s.auth)
	api.HandleFunc("/series", s.getSeries).Methods("GET")
	api.HandleFunc("/series", s.postSeries).Methods("POST")
	api.HandleFunc("/image", s.postImage).Methods("POST")
	api.HandleFunc("/upload", s.postSeriesJSON).Methods("POST")
	api.HandleFunc("/omdb", s.getOMDB).Methods("GET")

	r.HandleFunc("/login", s.login).Methods("POST")
	r.HandleFunc("/register", s.register).Methods("POST")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("static")))
	http.Handle("/", r)

	hostname, _ := os.Hostname()
	fmt.Printf("Starting server on http://%s:%d\n", hostname, port)
	if err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil); err != nil {
		log.Fatal(err)
	}
}
