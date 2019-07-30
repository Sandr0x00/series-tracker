package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

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

}

func main() {
	port := 8080
	db, _ := initStorage()
	s := server{db, sessions.NewCookieStore([]byte("super-secret-key"))}

	r := mux.NewRouter()

	api := r.PathPrefix("/api").Subrouter()
	api.Use(s.auth)
	api.HandleFunc("/series", s.getSeries).Methods("GET")
	api.HandleFunc("/series", s.postSeries).Methods("POST")
	api.HandleFunc("/image", s.postImage).Methods("POST")
	api.HandleFunc("/upload", s.postSeriesJSON).Methods("POST")
	api.HandleFunc("/omdb", s.getOMDB).Methods("GET")

	r.HandleFunc("/login", s.login).Methods("POST")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("static")))
	http.Handle("/", r)

	hostname, _ := os.Hostname()
	fmt.Printf("Starting server on http://%s:%d\n", hostname, port)
	if err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil); err != nil {
		log.Fatal(err)
	}
}
