build:
	sassc sass/series.scss static/css/series.css
	sassc sass/color.scss static/css/color.css
	go build -o app -v ./src
	python scripts/copy.py

test:
	go list -f ./src golang.org/x/lint/golint
	go test -v ./src

run: build
	./app