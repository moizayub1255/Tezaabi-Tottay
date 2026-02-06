import { useState, useEffect } from "react";
import { ArrowLeft, Loader, Play, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { useAuthStore } from "../store/authUser";
import { useWatchlistStore } from "../store/watchlist";

const MyListPage = () => {
  const { user } = useAuthStore();
  const { watchlist, loadWatchlist, removeFromWatchlist } = useWatchlistStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true);
      try {
        await loadWatchlist();
      } catch (error) {
        console.log("Error loading watchlist", error);
        toast.error("Failed to load watchlist");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWatchlist();
    }
  }, [user, loadWatchlist]);

  const handleRemoveFromWatchlist = async (contentId) => {
    await removeFromWatchlist(contentId);
    toast.success("Removed from watchlist");
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
        <div className="flex items-center gap-4 mb-12">
          <Link to="/">
            <ArrowLeft className="size-6 text-gray-400 hover:text-white transition-colors" />
          </Link>
          <h1 className="text-4xl font-bold">My List</h1>
          <span className="text-gray-400 text-lg">
            ({watchlist.length} items)
          </span>
        </div>

        {/* Watchlist Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader className="animate-spin text-red-600 size-10" />
          </div>
        ) : watchlist.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-lg mb-4">
              Your watchlist is empty
            </p>
            <Link
              to="/movies"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Explore Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {watchlist.map((item) => (
              <div
                key={item.contentId}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
                onMouseEnter={() => setHoveredItem(item.contentId)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Poster */}
                <img
                  src={ORIGINAL_IMG_BASE_URL + item.posterPath}
                  alt={item.title}
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Overlay */}
                {hoveredItem === item.contentId && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col justify-end p-4 gap-3">
                    <h3 className="font-bold text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {item.contentType === "movie" ? "Movie" : "TV Show"}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        to={`/watch/${item.contentId}`}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                      >
                        <Play className="size-4 fill-white" />
                        Play
                      </Link>
                      <button
                        onClick={() =>
                          handleRemoveFromWatchlist(item.contentId)
                        }
                        className="flex-1 bg-red-900/50 hover:bg-red-900 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                      >
                        <Trash2 className="size-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
