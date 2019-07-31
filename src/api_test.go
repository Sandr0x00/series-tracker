package main

import (
	"fmt"
	"net/http"
	"net/url"
	"testing"
)

func TestUserLogin(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/omdb"+url.Values{"imdbID": {"tt3322314"}}.Encode(), nil)
	if err != nil {
		t.Fatal(err)
	}

	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	// rr := httptest.NewRecorder()
	// handler := http.HandlerFunc()

	fmt.Println(req)

	// TODO: create test

	// // Our handlers satisfy http.Handler, so we can call their ServeHTTP method
	// // directly and pass in our Request and ResponseRecorder.
	// handler.ServeHTTP(rr, req)

	// // Check the status code is what we expect.
	// if status := rr.Code; status != http.StatusOK {
	// 	t.Errorf("handler returned wrong status code: got %v want %v",
	// 		status, http.StatusOK)
	// }

	// // Check the response body is what we expect.
	// expected := `{"alive": true}`
	// if rr.Body.String() != expected {
	// 	t.Errorf("handler returned unexpected body: got %v want %v",
	// 		rr.Body.String(), expected)
	// }
}
