package utils

import (
	"io"
	"log"
	"net/http"
)

func ProxyRequest(writer http.ResponseWriter, request *http.Request, targetUrl string) {
	url := targetUrl + request.URL.Path
	log.Println("Proxying request to inventory API: ", url)
	if request.URL.RawQuery != "" {
		url += "?" + request.URL.RawQuery
	}

	req, err := http.NewRequest(request.Method, url, request.Body)
	if err != nil {
		http.Error(writer, "Error creating proxy request", http.StatusInternalServerError)
		return
	}

	for name, values := range request.Header {
		for _, value := range values {
			req.Header.Add(name, value)
		}
	}

	client := &http.Client{}
	resp, erreur := client.Do(req)
	if erreur != nil {
		http.Error(writer, "Error forwarding request to inventory API", http.StatusInternalServerError)
		return
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(resp.Body)

	for name, values := range resp.Header {
		for _, value := range values {
			writer.Header().Add(name, value)
		}
	}

	writer.WriteHeader(resp.StatusCode)
	body, erre := io.ReadAll(resp.Body)
	if erre != nil {
		http.Error(writer, "Error reading response from inventory API", http.StatusInternalServerError)
		return
	}
	_, err = writer.Write(body)
	if err != nil {
		return
	}
}
