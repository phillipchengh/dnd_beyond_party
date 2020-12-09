package main

import (
	"encoding/json"
	"fmt"
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

func assetManifestHTTPHandler(writer http.ResponseWriter, r *http.Request) {
	assetManifestJSON := requestAssetManifest()
	assetManifest, err := json.Marshal(assetManifestJSON)
	if err != nil {
		log.Printf("%s", err)
	}
	writer.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(writer, string(assetManifest))
}
