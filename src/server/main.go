package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", indexHTTPHandler)

	http.HandleFunc("/asset-manifest.json", assetManifestHTTPHandler)

	http.HandleFunc("/character", characterHTTPHandler)

	http.ListenAndServe(":1337", nil)

	log.Println("Listening on port 1337.")
}
