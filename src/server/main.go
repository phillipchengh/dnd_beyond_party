package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
)

func requestJSON(url string) interface{} {
	response, err := http.Get(url)
	if err != nil {
		log.Printf("%s", err)
	}
	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Printf("%s", err)
	}
	var jsonData interface{}
	jsonErr := json.Unmarshal(body, &jsonData)
	if jsonErr != nil {
		log.Printf("%s", jsonErr)
	}
	return jsonData
}

func requestAssetManifest() interface{} {
	return requestJSON("http://nginx/asset/asset-manifest.json")
}

func getEntrypointAssets(entrypoint string) interface{} {
	manifest := requestAssetManifest()
	entrypoints := manifest.(map[string]interface{})["entrypoints"].(map[string]interface{})[entrypoint]
	return entrypoints
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		templates := template.Must(
			template.New("index.html").Funcs(template.FuncMap{
				"getEntrypointAssets": getEntrypointAssets,
			}).ParseFiles("public/index.html"),
		)

		templates.ExecuteTemplate(w, "index.html", nil)
	})

	http.HandleFunc("/asset-manifest.json", func(w http.ResponseWriter, r *http.Request) {
		// fmt.Fprintf(w, "hello world")
		assetManifestJSON := requestAssetManifest()
		assetManifest, err := json.Marshal(assetManifestJSON)
		if err != nil {
			log.Printf("%s", err)
		}
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, string(assetManifest))
	})

	http.ListenAndServe(":1337", nil)

	log.Println("Listening on port 1337.")
}
