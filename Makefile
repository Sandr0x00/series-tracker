install:
	npm install
	./scripts/copy.py
	go get github.com/gorilla/mux
	go get github.com/gorilla/sessions
	go get go.etcd.io/bbolt

build:
	sassc sass/series.scss static/css/series.css
	sassc sass/color.scss static/css/color.css
	rollup -c
	go build -o series -v ./src

test:
	go list -f ./src golang.org/x/lint/golint
	go test -v ./src
	eslint .

rebuild: build run

run:
	./series