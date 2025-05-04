import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { fetchPopularShows } from '../utils/api';

export default function Home() {
  const [shows, setShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'top'>('popular');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundDetails, setBackgroundDetails] = useState<any | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const loadShows = async () => {
      setLoading(true);
      const data = await fetchPopularShows(page, 20);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setShows(prev => [...prev, ...data]);
        if (!backgroundImage && data.length > 0) {
          const randomShow = data[Math.floor(Math.random() * data.length)];
          const randomImage = randomShow?.image?.original;
          setBackgroundImage(randomImage);
          setBackgroundDetails(randomShow);
        }
      }
      setLoading(false);
    };
    loadShows();
  }, [page]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
    const data = await res.json();
    const mapped = data.map((item: any) => item.show);
    setSearchResults(mapped);
  };

  const getFilteredShows = () => {
    let sorted = [...shows];
    if (sortBy === 'latest') {
      sorted.sort((a, b) => new Date(b.premiered).getTime() - new Date(a.premiered).getTime());
    } else if (sortBy === 'top') {
      sorted.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    }
    return sorted;
  };

  const lastShowRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="min-h-screen text-white bg-black">
      {backgroundImage && backgroundDetails && (
  backgroundDetails.officialSite ? (
    <a
      href={backgroundDetails.officialSite}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full block relative"
      style={{ height: '50vh' }}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
      />
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute bottom-4 left-4 text-white p-4 bg-black bg-opacity-50 rounded-lg">
        <h2 className="text-2xl font-semibold">{backgroundDetails.name}</h2>
        {backgroundDetails.rating?.average && (
          <p className="mt-2 text-lg">⭐ {backgroundDetails.rating.average}</p>
        )}
        {backgroundDetails.runtime && (
          <p className="mt-2 text-lg">{backgroundDetails.runtime} min</p>
        )}
      </div>
    </a>
  ) : (
    <div
      className="w-full relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '50vh',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="absolute bottom-4 left-4 text-white p-4 bg-black bg-opacity-50 rounded-lg">
        <h2 className="text-2xl font-semibold">{backgroundDetails.name}</h2>
        {backgroundDetails.rating?.average && (
          <p className="mt-2 text-lg">⭐ {backgroundDetails.rating.average}</p>
        )}
        {backgroundDetails.runtime && (
          <p className="mt-2 text-lg">{backgroundDetails.runtime} min</p>
        )}
      </div>
    </div>
  )
)}


      {/* Header */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-80 backdrop-blur-md px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-bold text-center mb-4">🎬 TV Shows Explorer</h1>

          {/* Search */}
          <div className="flex justify-center mb-4 flex-nowrap overflow-x-auto gap-2 sm:gap-4">
            <input
              type="text"
              placeholder="Search for a show..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-56 bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white focus:outline-none w-full sm:w-64 text-sm sm:text-base flex-shrink-0"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base flex-shrink-0"
            >
              🔍 Search
            </button>
          </div>

          {/* Filters */}
          <div className="flex justify-center flex-wrap gap-2 mb-4">
            {['popular', 'latest', 'top'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSortBy(type as any);
                  setSearchResults([]);
                }}
                className={`px-3 py-1 text-sm rounded-full border transition ${
                  sortBy === type
                    ? 'bg-yellow-500 text-black border-yellow-400'
                    : 'bg-gray-700 border-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {type === 'popular' && '🔥 Popularno'}
                {type === 'latest' && '🕒 Najnovije'}
                {type === 'top' && '⭐ Najbolje'}
              </button>
            ))}
          </div>

          <div className="text-center">
            <Link href="/favorites">
              <button className="px-6 py-2 bg-green-500 text-black rounded-full hover:bg-green-400 transition">
                💖 Favorites
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(searchResults.length > 0 ? searchResults : getFilteredShows()).map((show: any, index: number) => {
          const isLast = index === getFilteredShows().length - 1;
          return (
            <div
              key={show.id}
              ref={searchResults.length === 0 && isLast ? lastShowRef : null}
              onClick={() => (window.location.href = `/shows/${show.id}`)}
              className="relative bg-white bg-opacity-10 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition cursor-pointer"
            >
              {/* Rating */}
              {show.rating?.average && (
                <div className="absolute top-2 right-2 bg-white bg-opacity-25 backdrop-blur-md px-2 py-1 rounded">
                  <p className="text-white text-sm font-semibold">⭐ {show.rating.average}</p>
                </div>
              )}

              {/* Image */}
              <img
                src={show.image?.medium || '/default-image.jpg'}
                alt={show.name}
                className="w-full h-[250px] object-cover"
              />

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-25 backdrop-blur-md p-2 m-2 rounded">
                <h2 className="text-sm font-bold text-white text-center">{show.name}</h2>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-6">Loading more shows...</div>
      )}
    </div>
  );
}
