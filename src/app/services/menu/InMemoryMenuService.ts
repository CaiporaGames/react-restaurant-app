import type { IMenuService, CategoryWithItems } from "@/app/domain/menu";


export class InMemoryMenuService implements IMenuService {
    async fetchMenu(): Promise<CategoryWithItems[]> {
        return [
            {
                category: { id: "c1", name_en: "Starters", name_pt: "Entradas", sort: 1 },
                items: [
                    { id: "i1", category_id: "c1", name_en: "Bruschetta", name_pt: "Bruschetta", price: { priceCents: 550, currency: "EUR" }, is_active: true, photo_url: "https://picsum.photos/seed/br/400/300", allergens: ["GLUTEN"] },
                ],
            },
            {
                category: { id: "c2", name_en: "Mains", name_pt: "Pratos", sort: 2 },
                items: [
                    { id: "i2", category_id: "c2", name_en: "Grilled Salmon", name_pt: "Salmão grelhado", description_en: "With lemon butter.", description_pt: "Com manteiga de limão.", price: { priceCents: 1450, currency: "EUR" }, is_active: true, photo_url: "https://picsum.photos/seed/salmon/400/300", allergens: ["FISH"] },
                ],
            },
        ];
    }
}