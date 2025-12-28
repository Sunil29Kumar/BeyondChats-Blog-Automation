import { useState } from "react";

const ScrapeBlogs = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(null);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    setCount(null);

    try {
      const res = await fetch(
        "http://localhost:5000/api/scrape/beyondchats",
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed");
      }

      setMessage("Blogs scraped successfully");
      setCount(data.scraped || data.count);
    } catch (err) {
      setError("Failed to scrape blogs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          BeyondChats Blog Scraper
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Fetch the oldest blogs from BeyondChats and store them in database
        </p>

        <button
          onClick={handleScrape}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium transition 
            ${loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
        >
          {loading ? "Scraping..." : "Fetch Oldest Articles"}
        </button>

        {message && (
          <p className="mt-5 text-green-600 font-medium">
            ✅ {message}
          </p>
        )}

        {count !== null && (
          <p className="mt-1 text-gray-700">
            Articles scraped: <span className="font-semibold">{count}</span>
          </p>
        )}

        {error && (
          <p className="mt-5 text-red-600 font-medium">
            ❌ {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ScrapeBlogs;
