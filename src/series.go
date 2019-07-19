package main

import (
	"log"
	"regexp"
	"strings"
)

type Series struct {
	Id     string
	Title  string
	Status string
}

func (s *Series) valid() bool {
	statusReg, _ := regexp.Compile("^(S[0-9]{2}E[0-9]{2}|E[0-9]{5}|(SxxE|Exxx)xx)$")
	if !statusReg.MatchString(s.Status) {
		return false
	}

	s.Id = strings.Replace(s.Title, " ", "_", -1)
	idReg, err := regexp.Compile("[^a-zA-Z0-9]+")
	if err != nil {
		log.Fatal(err)
		return false
	}
	s.Id = strings.ToLower(idReg.ReplaceAllString(s.Id, ""))
	return true
}
