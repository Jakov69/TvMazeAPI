import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CastPage() {
  const { query } = useRouter();
  const showId = query.showId as string;
  const [cast, setCast] = useState([]);

  useEffect(() => {
    if (!showId) return;
    fetch(`https://api.tvmaze.com/shows/${showId}/cast`)
      .then(res => res.json())
      .then(setCast);
  }, [showId]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Cast</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cast.map(({ person, character }: any) => (
          <div key={person.id} className="border p-4 rounded text-center">
            <img
              src={person.image?.medium || '/default-image.jpg'}
              alt={person.name}
              className="w-full h-[200px] object-cover rounded"
            />
            <h2 className="mt-2 font-semibold">{person.name}</h2>
            <p className="text-gray-600">as {character.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
