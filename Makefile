build:
	sassc sass/series.scss static/css/series.css
	sassc sass/color.scss static/css/color.css
	go build -o app -v ./src

test:
	go test -v

run: build
	./app