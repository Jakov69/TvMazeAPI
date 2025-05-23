// Prikazuje glumačku postavu (cast) za određeni TV show koristeći TVmaze API i showId iz URL parametra.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CastPage() {
  const { query } = useRouter();
  const showId = query.showId as string;

  // Lokalan state za glumačku postavu
  const [cast, setCast] = useState([]);

  useEffect(() => {
    // Ako showId nije dostupan (npr. tijekom inicijalnog rendera), preskačemo dohvat
    if (!showId) return;

    // Dohvaćamo podatke o glumcima za seriju s danim showId
    fetch(`https://api.tvmaze.com/shows/${showId}/cast`)
      .then(res => res.json())
      .then(setCast); // Sprema rezultat u state
  }, [showId]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Cast</h1>

      {/* Prikaz glumačke postave u gridu */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cast.map(({ person, character }: any) => (
          <div key={person.id} className="border p-4 rounded text-center">
            {/* Slika glumca ili zamjenska ako nije dostupna */}
            <img
              src={person.image?.medium || '/default-image.jpg'}
              alt={person.name}
              className="w-full h-[200px] object-cover rounded"
            />

            {/* Ime glumca i uloga */}
            <h2 className="mt-2 font-semibold">{person.name}</h2>
            <p className="text-gray-600">as {character.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}