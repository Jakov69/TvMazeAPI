import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function EpisodesPage() {
  const { query } = useRouter();
  const showId = query.showId as string;
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    if (!showId) return;
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then(res => res.json())
      .then(setEpisodes);
  }, [showId]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Episodes</h1>
      <ul className="space-y-4">
        {episodes.map((ep: any) => (
          <li key={ep.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{ep.name}</h2>
            <p>Season {ep.season}, Episode {ep.number}</p>
            <p>{ep.summary?.replace(/<[^>]*>/g, '')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
