import React, { useState, useEffect } from 'react'
import { useDebounce, useUpdateEffect } from 'react-use';
import Search from './components/search.jsx'
import axios from "axios"
import Spinner from './components/spinner.jsx';
import Card from './components/Card.jsx';
import { Client } from 'appwrite';
import updateSearchCount from './appwrite.js'
import {TredningMovies} from "./appwrite.js"

const API_BASE_URL = "https://www.omdbapi.com/?"
const API_KEY = import.meta.env.VITE_MOVIE_API_KEY;

const client=new Client();
client.setProject('68de4f61001e29f464ed');

const App = () => {
  let [searchTerm, setSearchTerm] = useState('');
  let [errorMessage, setErrorMessage] = useState('');
  let [movieslist, setMovieslist] = useState([]);
  let [isloading, setisloading] = useState(false)
  let [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  let [trendingmovies,setTrendingmovies]=useState([]);

  // Fixed debounce implementation
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const popularTitles = [
    "Inception",
    "The Dark Knight",
    "Interstellar",
    "Avengers: Endgame",
    "The Shawshank Redemption",
    "The Godfather",
    "Titanic",
    "Joker",
    "Fight Club",
    "Forrest Gump"
  ];

  let fetchmovies = async (query) => {
    setErrorMessage('');
    setisloading(true)
    try {
      let results = [];
      if (query) {
        const res = await fetch(`https://www.omdbapi.com/?t=${query}&apikey=796dd24c`);
        const data = await res.json();
        if (data && data.Response !== "False") {
          results.push(data);
            console.log("Calling updateSearchCount...");
        await updateSearchCount(query, data);
        }
        setMovieslist(results);
      }
      else {
        for (let tital of popularTitles) {
          const res = await fetch(`https://www.omdbapi.com/?t=${tital}&apikey=796dd24c`);
          const data = await res.json();
          if (data && data.Response !== "False") {
            results.push(data);
          }
        }
        setMovieslist(results);
      }
    }
    catch (error) {
      console.log(error);
      setErrorMessage("Error fetching movies please try again later");
    }
    finally {
      setisloading(false)
    }
  }
  const loadingTrendingMovie=async ()=>{
    try {
      const movies=await TredningMovies();
      setTrendingmovies(movies);

    } catch (error) {
      console.log(error);
    }
  }

  // Use debouncedSearchTerm instead of searchTerm
  useEffect(() => {
    fetchmovies(debouncedSearchTerm);
  }, [debouncedSearchTerm])

  useEffect(()=>{
    loadingTrendingMovie();
  },[])

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header >
          <img src="./hero.png" alt="" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingmovies.length>0 &&<section className='trending'>

            <h2>Trending Movies</h2>

            <ul>
              {trendingmovies.map((movie,index)=>(
                <li key={movie.$id} className=' gap-5 flex items-center'>
                    <p>{index+1}</p>
                    <img src={movie.poster_url} alt={movie.Title} />
                </li>
              ))}
            </ul>
          </section>}

        <section className='mt-5'>
          <h2 className='text-white mb-[40px]'>All Movies</h2>
          {isloading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-4xl gap-6'>
              {movieslist.map((movie, index) => (
                <li key={index}>
                  <Card imageurl={movie.Poster} movieTital={movie.Title} rating={movie.imdbRating} year={movie.Year} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App