package main

import (
	"html/template"
	"net/http"
)

func indexHTTPHandler(writer http.ResponseWriter, reader *http.Request) {
	templates := template.Must(
		template.New("index.html").Funcs(template.FuncMap{
			"getEntrypointAssets": getEntrypointAssets,
		}).ParseFiles("public/index.html"),
	)

	templates.ExecuteTemplate(writer, "index.html", nil)
}
