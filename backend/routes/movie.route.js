import express from "express";
import {
  getMoviesByCategory,
  getMovieTrailers,
  getTrendingMovie,
  getMovieDetails,
  getSimilarMovies,
  getAllMovies,
  getPopularMovies,
  getUpcomingMovies,
} from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/trending", getTrendingMovie);
router.get("/all", getAllMovies);
router.get("/popular", getPopularMovies);
router.get("/upcoming", getUpcomingMovies);
router.get("/:id/trailers", getMovieTrailers);
router.get("/:id/details", getMovieDetails);
router.get("/:id/similar", getSimilarMovies);
router.get("/:category", getMoviesByCategory);

export default router;
