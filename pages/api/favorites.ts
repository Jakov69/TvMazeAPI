// API route koja omogućuje spremanje, dohvat i brisanje ID-eva omiljenih serija.
// Favorites se pohranjuju u memoriji (privremeno, nestaju nakon restarta servera).

// In-memory lista favorita (ovo nije perzistentno, koristi se samo za demonstraciju)
let favorites: string[] = [];

export default function handler(req, res) {
  // GET: vraća listu omiljenih show ID-eva
  if (req.method === 'GET') {
    res.status(200).json(favorites);

  // POST: dodaje showId u listu ako već nije dodan
  } else if (req.method === 'POST') {
    const { showId } = req.body;
    if (!favorites.includes(showId)) favorites.push(showId);
    res.status(200).json({ success: true });

  // DELETE: uklanja showId iz liste favorita
  } else if (req.method === 'DELETE') {
    const { showId } = req.body;
    favorites = favorites.filter(id => id !== showId);
    res.status(200).json({ success: true });

  // Ostale metode nisu dopuštene
  } else {
    res.status(405).end(); // 405 Method Not Allowed
  }
}