package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func requestCharacter(id string) (int, string) {
	response, err := http.Get(fmt.Sprintf("https://character-service.dndbeyond.com/character/v4/character/%s", id))
	if err != nil {
		log.Printf("%s", err)
	}
	defer response.Body.Close()
	bodyJSON, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Printf("%s", err)
	}
	return response.StatusCode, string(bodyJSON)
}

func characterHTTPHandler(writer http.ResponseWriter, request *http.Request) {
	id := request.FormValue("id")
	if id == "" {
		fmt.Fprintf(writer, "Missing id")
		return
	}
	statusCode, bodyJSON := requestCharacter(id)
	writer.WriteHeader(statusCode)
	writer.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(writer, bodyJSON)
}
