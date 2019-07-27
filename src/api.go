package main

import (
	"bytes"
	"encoding/base64"
	b64 "encoding/base64"
	"encoding/json"
	"fmt"
	"image/jpeg"
	"io/ioutil"
	"net/http"
	"os"
	"sort"
	"strings"

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
	return db, nil
}

func (s *server) getData() []byte {
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

	sort.Slice(series, func(i, j int) bool {
		return series[i].Modified > series[j].Modified
	})

	seriesJSON, _ := json.Marshal(series)
	return seriesJSON
}

func (s *server) getSeries(w http.ResponseWriter, r *http.Request) {
	// series := make(map[string]Series)
	var series = s.getData()

	_, md5 := r.URL.Query()["md5"]
	if md5 {
		fmt.Fprintf(w, b64.StdEncoding.EncodeToString([]byte(series)))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, string(series))
}

func (s *server) postSeries(w http.ResponseWriter, r *http.Request) {
	var series Series
	json.NewDecoder(r.Body).Decode(&series)
	if !series.valid() {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	series.updateTime()

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
	var seriesJSON = s.getData()
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, string(seriesJSON))
}

func (s *server) postImage(w http.ResponseWriter, r *http.Request) {
	// Parse our multipart form, 10 << 20 specifies a maximum
	// upload of 10 MB files.
	r.ParseMultipartForm(10 << 20)
	id := r.FormValue("id")
	f64 := r.FormValue("file")
	if !strings.HasPrefix(f64, "data") {
		return
	}
	f64 = f64[strings.Index(f64, ",")+1:]
	dec, err := base64.StdEncoding.DecodeString(f64)
	res := bytes.NewReader(dec)
	i, err := jpeg.Decode(res)
	if err != nil {
		fmt.Println(err)
		return
	}

	f, err := os.Create("static/img/" + id + ".jpg")
	if err != nil {
		fmt.Println(err)
		return
	}
	var opt jpeg.Options
	opt.Quality = 95
	jpeg.Encode(f, i, &opt)
}

func (s *server) postSeriesJSON(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	series := make([]Series, 0)
	json.Unmarshal(b, &series)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	fmt.Println(series)
	var keys []string

	s.db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("Series"))
		b.ForEach(func(k, v []byte) error {
			keys = append(keys, string(k))
			return nil
		})
		return nil
	})

	for _, ser := range keys {
		s.db.Batch(func(tx *bolt.Tx) error {
			// fmt.Println(ser)
			return tx.Bucket([]byte("Series")).Delete([]byte(ser))
			// return nil
		})
	}

	for _, ser := range series {
		ser.valid()
		fmt.Println(ser)
		err := s.db.Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte("Series"))

			encoded, err := json.Marshal(ser)
			if err != nil {
				return err
			}

			return b.Put([]byte(ser.Id), []byte(encoded))
		})
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	}
}
