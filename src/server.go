package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	bolt "go.etcd.io/bbolt"
)

type server struct {
	db *bolt.DB
}

func main() {
	db, _ := initStorage()
	s := server{db}

	r := mux.NewRouter()

	r.HandleFunc("/api/series", s.getSeries).Methods("GET")
	r.HandleFunc("/api/series", s.postSeries).Methods("POST")
	// http.HandleFunc("/about/", handleAbout())
	// r.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	// r.PathPrefix("/node_modules/").Handler(http.FileServer(http.Dir("node_modules")))
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("static")))
	http.Handle("/", r)

	fmt.Printf("Starting server for testing HTTP POST...\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
