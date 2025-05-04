export const fetchPopularShows = async (page = 0, limit = 20) => {
    const res = await fetch(`https://api.tvmaze.com/shows?page=${page}`);
    const data = await res.json();
    return data.slice(0, limit); // vrati samo 'limit' broj serija
  };  
  
  export const fetchShowDetails = async (showId: string) => {
    try {
      const res = await fetch(`https://api.tvmaze.com/shows/${showId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch show details');
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  