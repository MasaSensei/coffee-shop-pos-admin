package recipes

type Service interface {
	GetByVariant(variantID int) ([]Recipe, error)
	SyncRecipe(variantID int, recipes []Recipe) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service { return &service{repo} }

func (s *service) GetByVariant(variantID int) ([]Recipe, error) {
	return s.repo.FetchByVariant(variantID)
}

func (s *service) SyncRecipe(variantID int, recipes []Recipe) error {
	// 1. Hapus semua resep lama untuk varian ini
	if err := s.repo.DeleteByVariant(variantID); err != nil {
		return err
	}

	// 2. Insert resep-resep baru
	for _, r := range recipes {
		r.MenuVariantID = variantID // Pastikan ID Varian konsisten
		if err := s.repo.Create(r); err != nil {
			return err
		}
	}
	return nil
}
