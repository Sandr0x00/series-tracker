package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"github.com/gorilla/sessions"
	"os"
	"io"
	"encoding/json"
	// "fmt"
	"strings"
)

func TestGetOMDB(t *testing.T) {
	os.Chdir("..")
	db, _ := initStorage()
	s := server{db, sessions.NewCookieStore([]byte("super-secret-key"))}

	handler := http.HandlerFunc(s.getOMDB)
	{
		req := httptest.NewRequest("GET", "/api/omdb?imdbID=tt3322314", nil)
		// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
		rr := httptest.NewRecorder()
		handler(rr, req)

		body, _ := io.ReadAll(rr.Result().Body)

		var resp map[string]interface{}
		json.Unmarshal(body, &resp)

		if resp["Response"] != "True" {
			t.Errorf("OMDB call errors: %v", resp["Error"])
		}
	}

	{
		req := httptest.NewRequest("GET", "/api/omdb?imdbID=tt3322314a", nil)
		rr := httptest.NewRecorder()
		handler(rr, req)
		body, _ := io.ReadAll(rr.Result().Body)
		var resp map[string]interface{}
		json.Unmarshal([]byte(strings.Replace(string(body), "\"3322314a\"", "'3322314a'", -1)), &resp)
		//fmt.Println(resp)

		if resp["Response"] != "False" || resp["Error"] != "Conversion from string '3322314a' to type 'Double' is not valid." {
			t.Errorf("Wrong Response: %v", resp)
		}
	}

	{
		req := httptest.NewRequest("GET", "/api/omdb?imdbID=tt33223145", nil)
		rr := httptest.NewRecorder()
		handler(rr, req)
		body, _ := io.ReadAll(rr.Result().Body)
		var resp map[string]interface{}
		json.Unmarshal(body, &resp)
		//fmt.Println(resp)

		if resp["Response"] != "False" || resp["Error"] != "Incorrect IMDb ID." {
			t.Errorf("Wrong Response: %v", resp)
		}
	}
}
