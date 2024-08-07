import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchMoviesByGenre } from "../store/movieSlice";
import { Helmet } from "react-helmet";
import { telegramRequestGroup } from "../constant";
import Pagination from "./Pagination";
import Shimmer from "./Shimmer"; // Import the Shimmer component

const GenreMovies = () => {
  const { genre } = useParams();
  const dispatch = useDispatch();
  const genreMovies = useSelector((state) => state.movies.genreMovies); // Use genreMovies from state
  const movieStatus = useSelector((state) => state.movies.genreStatus); // Use genreStatus from state
  const error = useSelector((state) => state.movies.genreError); // Use genreError from state
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;

  useEffect(() => {
    dispatch(fetchMoviesByGenre(genre));
  }, [dispatch, genre]);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = genreMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  let content;

  // Determine what to display based on the movie status and data
  if (movieStatus === 'loading') {
    content = <Shimmer cardsCount={moviesPerPage} />;
  } else if (movieStatus === 'failed') {
    content = <p className="text-white">{error}</p>;
  } else if (genreMovies.length === 0) {
    content = (
      <div className="h-[100vh] flex-col items-center justify-center">
        <p className="text-white">No movies available in this genre 😔</p>
        <p className="text-white mt-5">
          📌 If movies are not available, request them in our Telegram Group{" "}
          <a className="text-blue-500 font-bold" href={telegramRequestGroup} target="_blank" rel="noopener noreferrer">
            HERE
          </a>
        </p>
      </div>
    );
  } else {
    content = currentMovies.map((movie) => (
      <Link key={movie._id} to={`/movie/${movie._id}`} className="no-underline">
        <div className="flex lg:w-56 lg:p-4 rounded-lg lg:items-center lg:justify-center lg:flex-col">
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="w-[120px] lg:w-[200px] rounded-lg mb-4"
          />
          <h3 className="text-[17px] ml-5 text-white text-base font-medium">
            {movie.title}
          </h3>
        </div>
      </Link>
    ));
  }

  return (
    <div className="p-8 lg:py-20 w-full min-h-screen bg-background">
      <Helmet>
        <title>{genre} Movies - Ocean Of Movies</title>
        <meta name="description" content={`Watch and download ${genre} movies`} />
      </Helmet>

      <h1 className="text-2xl flex lg:ml-[138px] sm:text-3xl md:text-4xl tracking-tighter text-white font-bold mb-6">
        {genre} Movies
      </h1>

      <div className="flex flex-wrap lg:justify-center h-[100%] gap-6">
        {content}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={genreMovies.length} // Update to use genreMovies.length
        itemsPerPage={moviesPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default GenreMovies;
