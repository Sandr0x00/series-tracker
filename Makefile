.PHONY: test build-js build-css

install:
	npm install
	./scripts/copy_node_modules.py

build-js:
	node_modules/.bin/rollup -c

build-css:
	sassc sass/series.scss static/css/series.css
	sassc sass/color.scss static/css/color.css

build-go:
	go build -o series -v ./src

build: build-css build-js build-go

test:
	node_modules/.bin/eslint .
	go list -f ./src golang.org/x/lint/golint
	go test -v ./src

rebuild: build run

dist: install build
	./scripts/make_dist.py

run:
	env OMDB=??? ./series

clean:
	rm -r dist
	rm -r node_modules