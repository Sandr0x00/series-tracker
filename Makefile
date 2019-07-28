build:
	npm install
	sassc sass/series.scss static/css/series.css
	sassc sass/color.scss static/css/color.css
	go build -o series -v ./src
	./scripts/copy.py

test:
	go list -f ./src golang.org/x/lint/golint
	go test -v ./src
	eslint .

rebuild: build run

run:
	./series