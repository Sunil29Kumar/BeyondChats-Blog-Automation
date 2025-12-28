import ArticleList from "../components/ArticleList";
import ScrapeBlogs from "../components/ScrapeBlogs ";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 flex flex-col gap-10">
      <ScrapeBlogs />

      <div className="max-w-7xl mx-auto  ">
        <h2 className="text-2xl font-semibold  text-gray-800 mb-6">
          Stored Articles
        </h2>

        <ArticleList />
      </div>
    </div>
  );
};

export default Home;
