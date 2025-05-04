let favorites: string[] = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(favorites);
  } else if (req.method === 'POST') {
    const { showId } = req.body;
    if (!favorites.includes(showId)) favorites.push(showId);
    res.status(200).json({ success: true });
  } else if (req.method === 'DELETE') {
    const { showId } = req.body;
    favorites = favorites.filter(id => id !== showId);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
