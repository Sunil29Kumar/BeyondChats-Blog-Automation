import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/articles`);
                if (!res.ok) throw new Error("Failed to fetch articles");
                const data = await res.json();
                setArticles(data);
            } catch (err) {
                setError("Failed to load articles");
            } finally {
                setLoading(false);
            }
        };

        loadArticles();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading articles...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    if (articles.length === 0) {
        return <p className="text-center mt-10">No articles found</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
                <ArticleCard key={article._id} article={article} />
            ))}
        </div>
    );
};

export default ArticleList;
