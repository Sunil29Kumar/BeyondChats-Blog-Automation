const ArticleCard = ({ article }) => {
    return (
        <div className="bg-white rounded-xl shadow p-5 flex flex-col justify-between">
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {article.title}
                </h2>

                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {article.excerpt || "No description available"}
                </p>

                <p className="text-xs text-gray-500">
                    Author: {article.author || "Unknown"}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                    Version: <span className="font-medium">{article.version}</span>
                </p>
            </div>

            <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-indigo-600 font-medium hover:underline"
            >
                Read original →
            </a>
        </div>
    );
};

export default ArticleCard;
