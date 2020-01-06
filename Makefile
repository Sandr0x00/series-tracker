.PHONY: test build-js build-css

install:
	npm install
	./scripts/copy.py
	go get github.com/gorilla/mux
	go get github.com/gorilla/sessions
	go get go.etcd.io/bbolt
	go get golang.org/x/lint/golint

install-prod:
	go get github.com/gorilla/mux
	go get github.com/gorilla/sessions
	go get go.etcd.io/bbolt
	go get golang.org/x/lint/golint

build-js:
	rollup -c

build-css:
	sassc sass/series.scss static/css/series.css
	sassc sass/color.scss static/css/color.css

build-go:
	go build -o series -v ./src

build: build-css build-js build-go

test:
	eslint .
	go list -f ./src golang.org/x/lint/golint
	go test -v ./src

rebuild: build run

dist: install build
	./scripts/make_dist.py

run:
	env OMDB=??? ./series