package main

import (
	"context"
	// Hubungkan ke database backend utama
	"github.com/MasaSensei/pos-admin/database"
)

// Definisi struct App (Ini yang tadi hilang sehingga error undefined)
type App struct {
	ctx context.Context
}

// Fungsi untuk membuat instance App baru
func NewApp() *App {
	return &App{}
}

// Fungsi startup bawaan wails
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Fungsi test koneksi
func (a *App) CheckConnection() string {
	// Kita tes panggil variabel DB dari backend utama
	if database.DB != nil {
		return "Koneksi ke Backend Utama Aman!"
	}
	return "Backend Terhubung, tapi DB belum inisialisasi"
}
