package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", indexHTTPHandler)

	fs := http.StripPrefix("/static/", http.FileServer(http.Dir("./public")));
	http.Handle("/static/", fs)

	http.HandleFunc("/asset-manifest.json", assetManifestHTTPHandler)

	http.HandleFunc("/character", characterHTTPHandler)

	http.ListenAndServe(":1337", nil)

	log.Println("Listening on port 1337.")
}
