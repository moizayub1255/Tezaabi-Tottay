import { useState, useEffect } from "react";
import { ArrowLeft, Loader, Play, Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { useAuthStore } from "../store/authUser";
import { useWatchlistStore } from "../store/watchlist";

const TVShowsPage = () => {
  const { user } = useAuthStore();
  const { watchlist, addToWatchlist, removeFromWatchlist } =
    useWatchlistStore();
  const [tvShows, setTvShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredShow, setHoveredShow] = useState(null);

  useEffect(() => {
    const fetchTvShows = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/v1/tv/all?page=${currentPage}`);
        if (response.data.success) {
          setTvShows(response.data.tvShows);
          setTotalPages(response.data.totalPages);
          window.scrollTo(0, 0);
        }
      } catch (error) {
        console.log("Error fetching TV shows", error);
        toast.error("Failed to load TV shows");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTvShows();
    }
  }, [currentPage, user]);

  const handleAddToWatchlist = async (tvShow) => {
    const isInWatchlist = watchlist.some(
      (item) => item.contentId === tvShow.id,
    );

    if (isInWatchlist) {
      await removeFromWatchlist(tvShow.id);
      toast.success("Removed from watchlist");
    } else {
      await addToWatchlist({
        contentId: tvShow.id,
        title: tvShow.name,
        posterPath: tvShow.poster_path,
        contentType: "tv",
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
        <div className="flex items-center gap-4 mb-12">
          <Link to="/">
            <ArrowLeft className="size-6 text-gray-400 hover:text-white transition-colors" />
          </Link>
          <h1 className="text-4xl font-bold">TV Shows</h1>
        </div>

        {/* TV Shows Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader className="animate-spin text-red-600 size-10" />
          </div>
        ) : tvShows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No TV shows found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {tvShows.map((tvShow) => {
                const isInWatchlist = watchlist.some(
                  (item) => item.contentId === tvShow.id,
                );

                return (
                  <div
                    key={tvShow.id}
                    className="group relative overflow-hidden rounded-lg cursor-pointer"
                    onMouseEnter={() => setHoveredShow(tvShow.id)}
                    onMouseLeave={() => setHoveredShow(null)}
                  >
                    {/* TV Show Poster */}
                    <img
                      src={ORIGINAL_IMG_BASE_URL + tvShow.poster_path}
                      alt={tvShow.name}
                      className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Overlay */}
                    {hoveredShow === tvShow.id && (
                      <div className="absolute inset-0 bg-black/80 flex flex-col justify-end p-4 gap-3">
                        <h3 className="font-bold text-white line-clamp-2">
                          {tvShow.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {tvShow.first_air_date?.split("-")[0]}
                        </p>
                        <div className="flex gap-2">
                          <Link
                            to={`/watch/${tvShow.id}`}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                          >
                            <Play className="size-4 fill-white" />
                            Play
                          </Link>
                          <button
                            onClick={() => handleAddToWatchlist(tvShow)}
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

export default TVShowsPage;
