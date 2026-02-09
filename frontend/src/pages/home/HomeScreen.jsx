import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Info, Play } from "lucide-react";
import useGetTrendingContent from "../../hooks/useGetTrendingContent";
import {
  MOVIE_CATEGORIES,
  ORIGINAL_IMG_BASE_URL,
  TV_CATEGORIES,
} from "../../utils/constants";
import { useContentStore } from "../../store/content";
import MovieSlider from "../../components/MovieSlider";
import { useState } from "react";

const HomeScreen = () => {
  const { trendingContent } = useGetTrendingContent();
  const { contentType } = useContentStore();
  const [imgLoading, setImgLoading] = useState(true);

  if (!trendingContent)
    return (
      <div className="h-screen text-white relative">
        <Navbar />
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
      </div>
    );

  return (
    <>
      <div className="relative h-screen text-white overflow-x-hidden">
        <Navbar />

        {/* COOL OPTIMIZATION HACK FOR IMAGES */}
        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10" />
        )}

        <img
          src={ORIGINAL_IMG_BASE_URL + trendingContent?.backdrop_path}
          alt="Hero img"
          className="absolute top-0 left-0 w-full h-full object-cover -z-50"
          onLoad={() => {
            setImgLoading(false);
          }}
        />

        <div
          className="absolute top-0 left-0 w-full h-full bg-black/50 -z-50"
          aria-hidden="true"
        />

        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32 overflow-x-hidden">
          <div
            className="bg-gradient-to-b from-black via-transparent to-transparent 
					absolute w-full h-full top-0 left-0 -z-10"
          />

          <div className="max-w-2xl">
            <h1 className="mt-4 text-5xl sm:text-6xl font-extrabold text-balance">
              {trendingContent?.title || trendingContent?.name}
            </h1>
            <p className="mt-2 text-base sm:text-lg">
              {trendingContent?.release_date?.split("-")[0] ||
                trendingContent?.first_air_date.split("-")[0]}{" "}
              | {trendingContent?.adult ? "18+" : "PG-13"}
            </p>

            <p className="mt-4 text-base sm:text-lg line-clamp-3">
              {trendingContent?.overview.length > 200
                ? trendingContent?.overview.slice(0, 200) + "..."
                : trendingContent?.overview}
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <Link
              to={`/watch/${trendingContent?.id}`}
              className="bg-white hover:bg-white/80 text-black font-bold py-3 px-6 rounded-lg flex
							 items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <Play className="size-5 fill-black" />
              Play
            </Link>

            <Link
              to={`/watch/${trendingContent?.id}`}
              className="bg-gray-500/50 hover:bg-gray-500 text-white py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-200"
            >
              <Info className="size-5" />
              More Info
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-black overflow-x-hidden">
        <div className="py-8 sm:py-12">
          {contentType === "movie"
            ? MOVIE_CATEGORIES.map((category) => (
                <MovieSlider key={category} category={category} />
              ))
            : TV_CATEGORIES.map((category) => (
                <MovieSlider key={category} category={category} />
              ))}
        </div>
      </div>
    </>
  );
};
export default HomeScreen;
