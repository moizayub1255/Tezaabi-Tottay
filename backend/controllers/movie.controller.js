import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingMovie(req, res) {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/movie/day?with_original_language=hi",
    );
    const randomMovie =
      data.results[Math.floor(Math.random() * data.results?.length)];

    res.json({ success: true, content: randomMovie });
  } catch (error) {
    res.status(500).json({ sucess: false, message: "Internal server error" });
  }
}

export async function getAllMovies(req, res) {
  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}&sort_by=popularity.desc`,
    );
    res
      .status(200)
      .json({
        success: true,
        movies: data.results,
        totalPages: data.total_pages,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getPopularMovies(req, res) {
  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
    );
    res
      .status(200)
      .json({
        success: true,
        movies: data.results,
        totalPages: data.total_pages,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getUpcomingMovies(req, res) {
  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`,
    );
    res
      .status(200)
      .json({
        success: true,
        movies: data.results,
        totalPages: data.total_pages,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMovieTrailers(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US&with_original_language=hi`,
    );
    res.json({ success: true, trailers: data.results });
  } catch (error) {
    if (error.message.includes("404")) {
      return res.status(404).send(null);
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMovieDetails(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US&with_original_language=hi`,
    );
    res.status(200).json({ success: true, content: data });
  } catch (error) {
    if (error.message.includes("404")) {
      return res.status(404).send(null);
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getSimilarMovies(req, res) {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1&with_original_language=hi`,
    );
    res.status(200).json({ success: true, similar: data.results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMoviesByCategory(req, res) {
  const { category } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1&with_original_language=hi`,
    );
    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
