package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	bolt "go.etcd.io/bbolt"
)

type server struct {
	db       *bolt.DB
	sessions *sessions.CookieStore
}

func (s *server) auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// We can obtain the session token from the requests cookies, which come with every request
		session, _ := s.sessions.Get(r, "session")
		if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		// c, err := r.Cookie("session_token")
		// if err != nil {
		// 	if err == http.ErrNoCookie {
		// 		// If the cookie is not set, return an unauthorized status
		// 		w.WriteHeader(http.StatusUnauthorized)
		// 		return
		// 	}
		// 	// For any other type of error, return a bad request status
		// 	w.WriteHeader(http.StatusBadRequest)
		// 	return
		// }
		// sessionToken := c.Value

		// // We then get the name of the user from our cache, where we set the session token
		// response, err := false, nil
		// if sessionToken == "token" {
		// 	response = true
		// } else {
		// 	// fmt.Println("li")
		// 	w.WriteHeader(http.StatusUnauthorized)
		// 	return
		// }
		// if err != nil {
		// 	// If there is an error fetching from cache, return an internal server error status
		// 	w.WriteHeader(http.StatusInternalServerError)
		// 	return
		// }
		// if !response {
		// 	// If the session token is not present in cache, return an unauthorized error
		// 	w.WriteHeader(http.StatusUnauthorized)
		// 	return
		// }
		// // var header = r.Header.Get("x-access-token")
		// // header = strings.TrimSpace(header)

		// // if header == "" {
		// // 	w.WriteHeader(http.StatusForbidden)
		// // 	return
		// // }

		// fmt.Println(header)
		next.ServeHTTP(w, r)
	})
}

func (s *server) login(w http.ResponseWriter, r *http.Request) {
	type Credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	var creds Credentials
	// Get the JSON body and decode into credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		// If the structure of the body is wrong, return an HTTP error
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if creds.Password != "lala" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	session, _ := s.sessions.Get(r, "session")
	session.Values["authenticated"] = true
	session.Save(r, w)
	w.WriteHeader(http.StatusOK)

	// // Get the expected password from our in memory map
	// expectedPassword, ok := "Blub", true

	// // If a password exists for the given user
	// // AND, if it is the same as the password we received, the we can move ahead
	// // if NOT, then we return an "Unauthorized" status
	// if !ok || expectedPassword != creds.Password {
	// 	w.WriteHeader(http.StatusUnauthorized)
	// 	return
	// }

	// // Create a new random session token
	// // sessionToken := uuid.NewV4().String()
	// // Set the token in the cache, along with the user whom it represents
	// // The token has an expiry time of 120 seconds
	// // _, err = cache.Do("SETEX", sessionToken, "120", creds.Username)
	// if err != nil {
	// 	// If there is an error in setting the cache, return an internal server error
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	return
	// }

	// Finally, we set the client cookie for "session_token" as the session token we just generated
	// we also set an expiry time of 120 seconds, the same as the cache
	// http.SetCookie(w, &http.Cookie{
	// 	Name:    "session_token",
	// 	Value:   sessionToken,
	// 	Expires: time.Now().Add(120 * time.Second),
	// })
}

func main() {
	db, _ := initStorage()
	s := server{db, sessions.NewCookieStore([]byte("super-secret-key"))}

	r := mux.NewRouter()

	api := r.PathPrefix("/api").Subrouter()
	api.Use(s.auth)
	api.HandleFunc("/series", s.getSeries).Methods("GET")
	api.HandleFunc("/series", s.postSeries).Methods("POST")
	api.HandleFunc("/image", s.postImage).Methods("POST")
	api.HandleFunc("/upload", s.postSeriesJSON).Methods("POST")

	r.HandleFunc("/login", s.login).Methods("POST")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("static")))
	http.Handle("/", r)

	fmt.Printf("Starting server for testing HTTP POST...\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
