import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";

const MovieSlider = ({ category }) => {
  const { contentType } = useContentStore();
  const [content, setContent] = useState(null);

  const formattedCategoryName =
    category.replaceAll("_", " ")[0].toUpperCase() +
    category.replaceAll("_", " ").slice(1);
  const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

  useEffect(() => {
    const getContent = async () => {
      try {
        const res = await api.get(`/api/v1/${contentType}/${category}`);
        setContent(res.data.content || []);
      } catch (error) {
        console.error("Error fetching content:", error);
        setContent([]);
      }
    };

    getContent();
  }, [contentType, category]);

  return (
    <div className="bg-black text-white px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          {formattedCategoryName} {formattedContentType}
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-900 rounded mt-2"></div>
      </div>

      {content && content.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {content.slice(0, 8).map((item) => (
            <Link
              to={`/watch/${item.id}`}
              className="group relative overflow-hidden rounded-lg"
              key={item.id}
            >
              <div className="relative overflow-hidden rounded-lg h-64 sm:h-72 md:h-80 bg-gray-900">
                <img
                  src={SMALL_IMG_BASE_URL + item.backdrop_path}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                {/* Info displayed on hover */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2">
                    {item.title || item.name}
                  </h3>
                  {item.vote_average && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                        ★ {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title below card */}
              <p className="mt-3 text-sm sm:text-base font-semibold text-gray-100 line-clamp-2 group-hover:text-white transition-colors">
                {item.title || item.name}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-12">No content available</p>
      )}
    </div>
  );
};
export default MovieSlider
