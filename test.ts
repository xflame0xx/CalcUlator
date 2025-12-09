type Art = {
    id: string;
    title: string;
    body: string;
    tags: string[];
    createdAt: Date;
};

// 🧩 Тип превью — только нужные поля
type ArtPrev = Pick<Art, 'id' | 'title' | 'tags'>;

// 🧠 Функция, создающая превью из полной статьи
function createPreview(T: Art): ArtPrev {
    return {
        id: T.id,
        title: T.title,
        tags: T.tags,
    };
}

// 🧪 Пример использования
const fullArticle: Art = {
    id: "123",
    title: "Generics in TypeScript",
    body: "Generics allow you to write reusable, type-safe components...",
    tags: ["typescript", "generics", "development"],
    createdAt: new Date("2024-06-15"),
};

const preview = createPreview(fullArticle)

console.log(preview.id);
console.log(preview.title);
console.log(preview.tags);