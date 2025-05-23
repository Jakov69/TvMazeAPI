// Prikazuje detalje za pojedinačnu seriju na temelju ID-a iz URL-a.
// Dohvaća podatke s vlastite API funkcije i prikazuje sliku, žanrove, opis, ocjenu te linkove na epizode i glumačku postavu.

import { useEffect, useState } from 'react';
import { fetchShowDetails } from '../../../utils/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FavoriteButton from '../../../components/FavoriteButton';

export default function ShowDetails() {
  // Sprema podatke o seriji
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dohvaća parametar showId iz URL-a putem Next.js routera
  const { query } = useRouter();
  const showId = query.showId as string;

  useEffect(() => {
    // Onemogućava fetch prije nego što showId postane dostupan (korisno kod inicijalnog rendera na klijentu)
    if (!showId) return;

    // Dohvaća detalje serije pomoću API funkcije
    const getShowDetails = async () => {
      const data = await fetchShowDetails(showId);
      setShow(data);
      setLoading(false);
    };

    getShowDetails();
  }, [showId]);

  // Prikazuje poruku tijekom učitavanja
  if (loading) return <div className="text-center py-10">Loading...</div>;

  // Prikazuje poruku ako nije pronađena serija (npr. nevažeći ID)
  if (!show) return <div className="text-center py-10">Show not found!</div>;

  return (
    <div className="container mx-auto px-4 py-10 flex flex-col items-center">
      {/* Naslov serije */}
      <h1 className="text-3xl font-bold mb-6 text-center">{show.name}</h1>

      {/* Slika serije (originalna veličina ako postoji, inače zamjenska slika) */}
      <img
        src={show.image?.original || '/default-image.jpg'}
        alt={show.name}
        className="w-[400px] h-auto rounded-xl shadow-lg mb-6"
      />

      {/* Žanrovi */}
      <p className="mb-2 text-lg text-gray-700">
        <strong>Genres:</strong> {show.genres.join(', ')}
      </p>

      {/* Opis serije bez HTML oznaka koje dolaze iz API-ja (strip HTML) */}
      <p className="mb-4 text-md text-gray-600 max-w-2xl text-center">
        {show.summary?.replace(/<[^>]*>/g, '')}
      </p>

      {/* Prosječna ocjena */}
      <p className="text-lg text-gray-700">
        <strong>Rating:</strong> {show.rating?.average || 'N/A'}
      </p>

      {/* Linkovi na epizode i glumačku postavu */}
      <div className="flex gap-4 mt-4">
        <Link href={`/shows/${show.id}/episodes`}>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Episodes
          </button>
        </Link>
        <Link href={`/shows/${show.id}/cast`}>
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Cast
          </button>
        </Link>
      </div>

      {/* Gumb za dodavanje/uklanjanje iz favorita */}
      <FavoriteButton showId={show.id.toString()} />

      {/* Povratak na početnu stranicu */}
      <Link href="/">
        <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          ⬅ Back to Home
        </button>
      </Link>
    </div>
  );
}