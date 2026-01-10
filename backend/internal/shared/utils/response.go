package utils

import "math"

type Meta struct {
	TotalData   int `json:"total_data"`
	TotalPage   int `json:"total_page"`
	CurrentPage int `json:"current_page"`
	Limit       int `json:"limit"`
}

type PaginatedResponse struct {
	Data interface{} `json:"data"`
	Meta Meta        `json:"meta"`
}

// Helper untuk menghitung total page
func CreateMeta(total int, page int, limit int) Meta {
	totalPage := int(math.Ceil(float64(total) / float64(limit)))
	if totalPage == 0 {
		totalPage = 1
	}
	return Meta{
		TotalData:   total,
		TotalPage:   totalPage,
		CurrentPage: page,
		Limit:       limit,
	}
}
