package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	bolt "go.etcd.io/bbolt"
)

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
		return nil
	})
	if err != nil {
		return nil, fmt.Errorf("could not set up buckets, %v", err)
	}
	fmt.Println("DB initialized")
	return db, nil
}

func (s *server) getSeries(w http.ResponseWriter, r *http.Request) {
	// series := make(map[string]Series)
	var series []Series

	s.db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("Series"))
		b.ForEach(func(k, v []byte) error {
			// fmt.Printf("key=%s, value=%s\n", k, v)
			var single Series
			json.Unmarshal(v, &single)
			series = append(series, single)
			// series[string(k)] = single
			return nil
		})
		return nil
	})

	seriesJson, _ := json.Marshal(series)

	fmt.Println(series[0].Title)
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, string(seriesJson))

}

func (s *server) postSeries(w http.ResponseWriter, r *http.Request) {
	var series Series
	json.NewDecoder(r.Body).Decode(&series)
	if !series.valid() {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err := s.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("Series"))

		encoded, err := json.Marshal(series)
		if err != nil {
			return err
		}

		return b.Put([]byte(series.Id), []byte(encoded))
	})
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	fmt.Printf("%+v\n", series)
	w.WriteHeader(http.StatusOK)
}
