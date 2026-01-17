package utils

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io" // Import io untuk membaca body
	"net/http"
	"time"
)

type XenditQRResponse struct {
	ID         string `json:"id"`
	ExternalID string `json:"external_id"`
	QRString   string `json:"qr_string"`
	Status     string `json:"status"`
}

func CreateXenditQRIS(apiKey string, externalID string, amount float64) (*XenditQRResponse, error) {
	// Debug: Pastikan API Key terkirim (hanya tampilkan 5 karakter pertama demi keamanan)
	if len(apiKey) > 5 {
		fmt.Printf("[Debug] Menggunakan API Key: %s...\n", apiKey[:5])
	} else {
		return nil, fmt.Errorf("API Key kosong atau terlalu pendek")
	}

	payload := map[string]interface{}{
		"external_id":  externalID,
		"type":         "DYNAMIC",
		"callback_url": "https://webhook.site/a6ebd57a-126a-42bf-81c4-64c93ff56af3",
		"amount":       amount,
	}

	jsonPayload, _ := json.Marshal(payload)

	req, err := http.NewRequest("POST", "https://api.xendit.co/qr_codes", bytes.NewBuffer(jsonPayload))
	if err != nil {
		return nil, err
	}

	auth := base64.StdEncoding.EncodeToString([]byte(apiKey + ":"))
	req.Header.Set("Authorization", "Basic "+auth)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// MODIFIKASI DISINI: Membaca detail error jika status bukan 200/201
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		bodyBytes, _ := io.ReadAll(resp.Body)

		// Kita coba parse errornya agar rapi di log
		var xenditError struct {
			ErrorCode string `json:"error_code"`
			Message   string `json:"message"`
		}
		json.Unmarshal(bodyBytes, &xenditError)

		// Print ke terminal agar kamu bisa lihat detailnya
		fmt.Printf("[Xendit Error Log]\nStatus: %d\nCode: %s\nMessage: %s\nFull Body: %s\n",
			resp.StatusCode, xenditError.ErrorCode, xenditError.Message, string(bodyBytes))

		return nil, fmt.Errorf("Xendit 401: %s - %s", xenditError.ErrorCode, xenditError.Message)
	}

	var xenditRes XenditQRResponse
	if err := json.NewDecoder(resp.Body).Decode(&xenditRes); err != nil {
		return nil, err
	}

	return &xenditRes, nil
}
