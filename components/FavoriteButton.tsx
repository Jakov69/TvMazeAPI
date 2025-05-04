import { useState, useEffect } from 'react';

export default function FavoriteButton({ showId }: { showId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      setIsFavorite(data.includes(showId));
    };
    checkFavorite();
  }, [showId]);

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showId }),
      });
    } else {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showId }),
      });
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`px-4 py-2 ${isFavorite ? 'bg-red-500' : 'bg-blue-500'} text-white rounded`}
    >
      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
    </button>
  );
}
