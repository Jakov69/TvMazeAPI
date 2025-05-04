import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const res = await fetch('/api/favorites');
      const ids = await res.json();
      setFavorites(ids);
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      const all = await Promise.all(
        favorites.map(id =>
          fetch(`https://api.tvmaze.com/shows/${id}`).then(res => res.json())
        )
      );
      setShows(all);
    };
    if (favorites.length) fetchAll();
  }, [favorites]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Your Favorite Shows</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shows.map((show: any) => (
          <div key={show.id} className="border p-4 rounded text-center">
            <img
              src={show.image?.medium || '/default-image.jpg'}
              alt={show.name}
              className="w-full h-[200px] object-cover rounded"
            />
            <h2 className="mt-2 font-semibold">{show.name}</h2>
            <Link href={`/shows/${show.id}`}>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
