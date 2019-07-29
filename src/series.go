package main

import (
	"log"
	"regexp"
	"time"
)

type Series struct {
	ImdbID   string
	Title    string
	Status   string
	Modified string
}

func (s *Series) valid() bool {
	statusReg, _ := regexp.Compile("^(S[0-9]{2}E[0-9]{2}|E[0-9]{5}|(SxxE|Exxx)xx)$")
	if !statusReg.MatchString(s.Status) {
		return false
	}

	// s.ImdbID = strings.Replace(s.Title, " ", "_", -1)
	// s.ImdbID = strings.Replace(s.ImdbID, "-", "_", -1)
	idReg, err := regexp.Compile("tt[0-9]{7}")
	if err != nil {
		log.Fatal(err)
		return false
	}
	return idReg.MatchString(s.ImdbID)

	// s.ImdbID = strings.ToLower(idReg.ReplaceAllString(s.ImdbID, ""))
	// return true
}

func (s *Series) updateTime() {
	s.Modified = time.Now().Format(time.RFC3339)
}
