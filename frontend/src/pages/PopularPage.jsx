import { useState, useEffect } from "react";
import { ArrowLeft, Loader, Play, Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { useAuthStore } from "../store/authUser";
import { useWatchlistStore } from "../store/watchlist";

const PopularPage = () => {
  const { user } = useAuthStore();
  const { watchlist, addToWatchlist, removeFromWatchlist } =
    useWatchlistStore();
  const [contentType, setContentType] = useState("movie");
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        if (contentType === "movie") {
          const response = await axios.get(
            `/api/v1/movie/popular?page=${currentPage}`,
          );
          if (response.data.success) {
            setContent(response.data.movies);
            setTotalPages(response.data.totalPages);
          }
        } else {
          const response = await axios.get(
            `/api/v1/tv/popular?page=${currentPage}`,
          );
          if (response.data.success) {
            setContent(response.data.tvShows);
            setTotalPages(response.data.totalPages);
          }
        }
        window.scrollTo(0, 0);
      } catch (error) {
        console.log("Error fetching popular content", error);
        toast.error("Failed to load popular content");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchContent();
    }
  }, [contentType, currentPage, user]);

  const handleAddToWatchlist = async (item) => {
    const isInWatchlist = watchlist.some(
      (watchItem) => watchItem.contentId === item.id,
    );

    if (isInWatchlist) {
      await removeFromWatchlist(item.id);
      toast.success("Removed from watchlist");
    } else {
      await addToWatchlist({
        contentId: item.id,
        title: contentType === "movie" ? item.title : item.name,
        posterPath: item.poster_path,
        contentType: contentType,
      });
      toast.success("Added to watchlist");
    }
  };

  if (!user) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <p>Please log in to access this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link to="/">
              <ArrowLeft className="size-6 text-gray-400 hover:text-white transition-colors" />
            </Link>
            <h1 className="text-4xl font-bold">New & Popular</h1>
          </div>

          {/* Content Type Toggle */}
          <div className="flex gap-2 bg-gray-900/50 rounded-lg p-1 border border-gray-800">
            <button
              onClick={() => {
                setContentType("movie");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded font-semibold transition ${
                contentType === "movie"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => {
                setContentType("tv");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded font-semibold transition ${
                contentType === "tv"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              TV Shows
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader className="animate-spin text-red-600 size-10" />
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No content found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {content.map((item) => {
                const isInWatchlist = watchlist.some(
                  (watchItem) => watchItem.contentId === item.id,
                );
                const title = contentType === "movie" ? item.title : item.name;
                const releaseDate =
                  contentType === "movie"
                    ? item.release_date?.split("-")[0]
                    : item.first_air_date?.split("-")[0];

                return (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-lg cursor-pointer"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Poster */}
                    <img
                      src={ORIGINAL_IMG_BASE_URL + item.poster_path}
                      alt={title}
                      className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Overlay */}
                    {hoveredItem === item.id && (
                      <div className="absolute inset-0 bg-black/80 flex flex-col justify-end p-4 gap-3">
                        <h3 className="font-bold text-white line-clamp-2">
                          {title}
                        </h3>
                        <p className="text-sm text-gray-400">{releaseDate}</p>
                        <div className="flex gap-2">
                          <Link
                            to={`/watch/${item.id}`}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                          >
                            <Play className="size-4 fill-white" />
                            Play
                          </Link>
                          <button
                            onClick={() => handleAddToWatchlist(item)}
                            className={`flex-1 font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition ${
                              isInWatchlist
                                ? "bg-white text-black hover:bg-gray-200"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                            }`}
                          >
                            {isInWatchlist ? (
                              <>
                                <Check className="size-4" />
                                In List
                              </>
                            ) : (
                              <>
                                <Plus className="size-4" />
                                Add
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PopularPage;
