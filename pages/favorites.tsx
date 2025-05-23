// Stranica prikazuje korisnikove omiljene TV emisije dohvaćene s lokalne API rute i vanjske TVMaze API-je.
// Povezuje lokalno spremljene ID-jeve s detaljima serija putem asinhronih fetch poziva.

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FavoritesPage() {
  // State za čuvanje ID-jeva omiljenih serija (dohvaćeno iz /api/favorites)
  const [favorites, setFavorites] = useState([]);

  // State za detalje serija (dohvaćeno iz TVMaze API-ja na temelju ID-jeva)
  const [shows, setShows] = useState([]);

  useEffect(() => {
    // Dohvaća ID-jeve omiljenih serija s lokalne API rute (/api/favorites)
    const loadFavorites = async () => {
      const res = await fetch('/api/favorites');
      const ids = await res.json();
      setFavorites(ids);
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    // Kada su poznati svi ID-jevi omiljenih serija, dohvaćaju se detalji za svaku
    const fetchAll = async () => {
      const all = await Promise.all(
        favorites.map(id =>
          // Poziva se javni TVMaze API za svaki ID i parsira odgovor kao JSON
          fetch(`https://api.tvmaze.com/shows/${id}`).then(res => res.json())
        )
      );
      setShows(all);
    };
    // Poziva se samo ako postoji barem jedan ID
    if (favorites.length) fetchAll();
  }, [favorites]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Your Favorite Shows</h1>
      
      {/* Grid prikaz svih omiljenih serija */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shows.map((show: any) => (
          <div key={show.id} className="border p-4 rounded text-center">
            {/* Slika serije (ili zamjenska slika ako nedostaje) */}
            <img
              src={show.image?.medium || '/default-image.jpg'}
              alt={show.name}
              className="w-full h-[200px] object-cover rounded"
            />
            <h2 className="mt-2 font-semibold">{show.name}</h2>
            
            {/* Gumb koji vodi na detalje serije */}
            <Link href={`/shows/${show.id}`}>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
