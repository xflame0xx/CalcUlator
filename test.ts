type Article = {
    id: string;
    title: string;
    body: string;
    tags: string[];
    createdAt: Date;
};

// 🧩 Тип превью — только нужные поля
type ArticlePreview = Pick<Article, 'id' | 'title' | 'tags'>;

// 🧠 Функция, создающая превью из полной статьи
function createPreview(article: Article): ArticlePreview {
    return {
        id: article.id,
        title: article.title,
        tags: article.tags,
    };
}

// 🧪 Пример использования
const fullArticle: Article = {
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