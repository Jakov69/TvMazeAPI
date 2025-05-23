// Prikazuje popis svih epizoda za određenu seriju dohvaćenu preko TVmaze API-ja na temelju showId parametra iz URL-a.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function EpisodesPage() {
  const { query } = useRouter();
  const showId = query.showId as string;

  // Držimo sve epizode u lokalnom state-u
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    // Ako showId nije još dostupan (npr. na inicijalnom renderu), preskačemo fetch
    if (!showId) return;

    // Dohvaćamo sve epizode za određeni show putem TVmaze API-ja
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then(res => res.json())
      .then(setEpisodes); // Spremamo epizode u state
  }, [showId]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Episodes</h1>

      {/* Prikaz svih epizoda */}
      <ul className="space-y-4">
        {episodes.map((ep: any) => (
          <li key={ep.id} className="border p-4 rounded shadow">
            {/* Naziv epizode */}
            <h2 className="text-lg font-semibold">{ep.name}</h2>

            {/* Sezona i broj epizode */}
            <p>Season {ep.season}, Episode {ep.number}</p>

            {/* Opis epizode bez HTML oznaka */}
            <p>{ep.summary?.replace(/<[^>]*>/g, '')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}