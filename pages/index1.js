
import WelcomeAnimation from "@/components/WelcomeAnimation";
import useFectchData from "@/hooks/useFetchData";
import Head from "next/head";

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "swiper/swiper-bundle.css";
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import Loader from "@/components/Loader";
import Link from "next/link";
import { FaAngleDoubleUp, FaCheck, FaDownload, FaEye, FaFilm, FaHeart, FaPhotoVideo, FaPlus, FaStar } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaClapperboard } from "react-icons/fa6";
import genres from "./genre/[genre]";
import category from "./genre";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { IoClose } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { FaHome, FaSearch, FaTv, FaPlay, FaBars } from "react-icons/fa";




export default function Home() {

  // fetch data with usehook
  const { alldata, loading } = useFectchData("/api/getmovies");

  const [wloading, setWLoading] = useState(true);


  // filter for published movies required
  const publishedData = alldata.filter(ab => ab.status === "publish");
  const seriesData = publishedData.filter((ab) => ab.titlecategory === 'series');
  const animeData = publishedData.filter((ab) => ab.titlecategory === "anime");
  const hollywoodData = publishedData.filter((ab) => ab.category === 'telugu');
  // function for filter by genre 
  const [selectedGenre, setSelectGenre] = useState('all movies');

  const genres = ['all movies', 'action', 'adventure', 'animation', 'comedy', 'drama', 'crime', 'fantasy', 'horror', 'romance', 'thriller', 'science_fiction'];

  const categories = ["bollywood", "telugu", "south", "gujarati", "marvel_studio", "tv_Shows", "web_series"];

  const handleGenreClick = (genre) => {
    setSelectGenre(genre);
  }
  const filmsData = publishedData.filter((ab) => ab.titlecategory === "films");

  const filteredData = publishedData.filter(movie => {
    if (selectedGenre === 'all movies') return true;
    if (categories.includes(selectedGenre)) {
      return movie.category === selectedGenre;
    } else {
      return movie.genre.includes(selectedGenre);
    }

  })

  const [updatedData, setUpdatedData] = useState([]);

  useEffect(() => {
    if (!loading) {
      // Filter only published films (you can modify this filter if needed)
      const publishedData = (alldata || []).filter((ab) => ab.status === "publish");

      // Sort the data by updatedAt in descending order
      const sortedData = publishedData.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      // Set the sorted data
      setUpdatedData(sortedData);
    }
  }, [alldata, loading]);
  const recentlyAddedData = (alldata || [])
    .filter((film) => film.status === "publish") // Only show published films
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by `createdAt` date descending

  // Navbar header component scroll sticky
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("nav");
      header.classList.toggle("sticky", window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Functions for navlist item page routing active status
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [searchbar, setSearchbar] = useState(false);

  const [activeLink, setActiveLink] = useState("/");

  // Search function by title of the movie
  const [movieshortname, setMovieshortname] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);



  // Function to handle search
  useEffect(() => {
    if (!movieshortname.trim()) {
      setSearchResult([]);
      return;
    }

    const filteredMovies = publishedData.filter((movie) =>
      movie.title.toLowerCase().includes(movieshortname.toLowerCase())
    );

    setSearchResult(filteredMovies);
  }, [movieshortname]);

  const handleMovieClick = () => {
    setMovieshortname("");
  };

  const searchRef = useRef(null);

  // Function to close search bar when clicking outside
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setMovieshortname("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleClick = () => {
    setClicked(!clicked);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setClicked(false);
  };

  useEffect(() => {
    // Update active link state when the page is reloaded
    setActiveLink(router.pathname);
  }, [router.pathname]);

  // Navbar
  const handleNavbarOpen = () => {
    setNavbar(!navbar);
  };

  const handleNavbarClose = () => {
    setNavbar(false);
  };

  // Search bar
  const handleSearchbarClose = () => {
    setSearchbar(false);
  };

  const searchInputRef = useRef(null);

  const handleSearchbarOpen = () => setSearchbar(true);

  return (


    <>
      <Head>
        <title>Anime in Telugu</title>
        <meta name="description" content="Next Js Movie App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="header">
        <h1 className="logo1" data-text="&nbsp;Anime in Telugu&nbsp;">
          <a>Anime in Telugu&nbsp;</a>
        </h1>







        {/* Bottom Navigation Bar */}
        <div className="bottom-navigation">
          <ul>
            <li>
              <Link href="/" onClick={handleSearchbarClose}>
                <FaHome />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/search">
                <FaSearch />
                <span>Search</span>
              </Link>
            </li>

            <li>
              <Link href="/series" onClick={handleSearchbarClose}>
                <FaTv />
                <span>Series</span>
              </Link>
            </li>
            <li>
              <Link href="/Anime" onClick={handleSearchbarClose}>
                <FaPlay />
                <span>Anime</span>
              </Link>
            </li>
            <li>
              <Link href="/films" onClick={handleSearchbarClose}>
                <FaFilm />
                <span>Movies</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div>
        <div className="swiper_top_main1">
          <Swiper
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            loop={true}
            speed={1200}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay, Navigation]}
            onSwiper={(swiper) => {
              // Ensure autoplay starts immediately
              if (!swiper.autoplay.running) {
                swiper.autoplay.start();
              }
            }}
          >
            {publishedData.slice(0, 3).map((movie) => (
              <SwiperSlide key={movie._id}>
                <div className="slideimagebx1">
                  <img
                    src={movie.bgposter}
                    alt="movie"
                    loading="lazy"
                    className="bgposter"
                  />
                  <div className="content1">
                    <div className="contentflex1">
                      <div className="smposter1">
                        <img
                          src={movie.smposter}
                          alt="movie poster"
                          loading="lazy"
                        />
                      </div>
                      <div className="details1">
                        <h1>{movie.title}</h1>
                        <Link href={`/movies/${movie.slug}`}>
                          <button className="btn_download1">
                            <FaDownload className="faDownload" /> DOWNLOAD
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>











        <h1 className="logo3">Recently Updated</h1>

        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default number of visible slides
              spaceBetween={50} // Space between the slides
              modules={[Pagination, Navigation]} // Required Swiper modules without autoplay
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {updatedData.length === 0 ? (
                <div className="nodatafound">No Movie Found</div>
              ) : (
                updatedData
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .map((film, index) => (
                    <SwiperSlide key={`${film.slug}-${index}`}
                    >
                      <div className="card">
                        <Link href={`/movies/${film.slug}`}>
                          <div className="cardimg">
                            <img
                              src={film.smposter}
                              alt={film.title}
                              loading="lazy"
                            />
                          </div>
                          <div className="contents">
                            <h5>{film.title}</h5>
                            <h6 className="yellow-text">
                              <h6>{film.language}</h6>
                              <span>{film.year}</span>
                            </h6>
                          </div>
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))
              )}
            </Swiper>
          )}
        </div>







        <h1 className="logo3">Recently Added</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between the slides
              loop={false} // Enable looping
              autoplay={{ delay: 3000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {alldata
                .filter((movie) => movie.status === "publish") // Only show published movies
                .map((movie) => (
                  <SwiperSlide key={movie.slug}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img src={movie.smposter} alt={movie.title} loading="lazy" />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <h6>{movie.language}</h6>
                            <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>


        <h1 className="logo3">Telugu Dubbed</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between slides
              loop={true} // Enable looping
              autoplay={{ delay: 3500, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              // Enable swipe controls
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {hollywoodData.map((movie) => (
                <SwiperSlide key={movie.slug}>
                  <div className="card">
                    <Link href={`/movies/${movie.slug}`}>
                      <div className="cardimg">
                        <img
                          src={movie.smposter}
                          alt="movie"
                          loading="lazy"
                        />
                      </div>
                      <div className="contents">
                        <h5>{movie.title}</h5>
                        <h6 className="yellow-text">
                          <h6>{movie.language}</h6>
                          <span>{movie.year}</span>
                        </h6>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>










        <h1 className="logo3">Series</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between slides
              loop={true} // Enable looping
              autoplay={{ delay: 4000, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {seriesData.map((movie) => (
                <SwiperSlide key={movie.slug}>
                  <div className="card">
                    <Link href={`/movies/${movie.slug}`}>
                      <div className="cardimg">
                        <img
                          src={movie.smposter}
                          alt="series"
                          loading="lazy"
                        />
                      </div>
                      <div className="contents">
                        <h5>{movie.title}</h5>
                        <h6 className="yellow-text">
                          <h6>{movie.language}</h6>
                          <span>{movie.year}</span>
                        </h6>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>







        <h1 className="logo3">Animes</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default visible slides
              spaceBetween={50} // Space between slides
              loop={true} // Enable looping
              autoplay={{ delay: 4500, disableOnInteraction: true }} // Autoplay every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required SwiperJS modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {animeData.map((anime) => (
                <SwiperSlide key={anime.slug}>
                  <div className="card">
                    <Link href={`/movies/${anime.slug}`}>
                      <div className="cardimg">
                        <img
                          src={anime.smposter}
                          alt="anime"
                          loading="lazy"
                        />
                      </div>
                      <div className="contents">
                        <h5>{anime.title}</h5>
                        <h6 className="yellow-text">
                          <h6>{anime.language}</h6>
                          <span>{anime.year}</span>
                        </h6>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>







        <h1 className="logo3">Movies</h1>
        <div className="scrollcardssec">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default number of visible slides
              spaceBetween={50} // Space between the slides
              loop={true} // Enable infinite looping
              autoplay={{ delay: 5000, disableOnInteraction: true }} // Auto sliding every 3 seconds
              modules={[Pagination, Navigation, Autoplay]} // Required Swiper modules
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {filmsData.map((film) => (
                <SwiperSlide key={film.slug}>
                  <div className="card">
                    <Link href={`/movies/${film.slug}`}>
                      <div className="cardimg">
                        <img
                          src={film.smposter}
                          alt={film.title}
                          loading="lazy"
                        />
                      </div>
                      <div className="contents">
                        <h5>{film.title}</h5>
                        <h6 className="yellow-text">
                          <h6>{film.language}</h6>
                          <span>{film.year}</span>
                        </h6>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>






        <div className="line" ></div>
        <h1 className="logo3">All Content</h1>
        <div className="moviescontainer">
          {loading ? (
            <div className="scrollcardssec flex flex-center h-15vh">
              <Loader />
            </div>
          ) : (
            <Swiper
              slidesPerView={3} // Default number of visible slides
              spaceBetween={50} // Space between the slides
              loop={true} // Enable infinite looping
              modules={[Pagination, Navigation]} // Required Swiper modules without autoplay
              breakpoints={{
                1587: {
                  slidesPerView: 8,
                },
                1500: {
                  slidesPerView: 7,
                },
                1200: {
                  slidesPerView: 6,
                },
                1040: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                650: {
                  slidesPerView: 3,
                },
                480: {
                  slidesPerView: 2,
                },
              }}
            >
              {filteredData.length === 0 ? (
                <div className="nodatafound">No Movie Found</div>
              ) : (
                filteredData.map((movie) => (
                  <SwiperSlide key={movie._id}>
                    <div className="card">
                      <Link href={`/movies/${movie.slug}`}>
                        <div className="cardimg">
                          <img
                            src={movie.smposter}
                            alt="movie"
                            loading="lazy"
                          />
                        </div>
                        <div className="contents">
                          <h5>{movie.title}</h5>
                          <h6 className="yellow-text">
                            <h6>{movie.language}</h6>
                            <span>{movie.year}</span>
                          </h6>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          )}
        </div>



        <div className="nextpagelink">
          <Link href='/all'>
            <button className="cssbuttons_io_button">All
              <div className="icon">
                <FaArrowRight />
              </div>
            </button>
          </Link>
        </div>

      </div>

    </>
  );
}
