import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { toast } from "sonner";

const fetchFavoriteCryptos = async (favorites) => {
  const requests = favorites.map(id => axios.get(`https://api.coincap.io/v2/assets/${id}`));
  const responses = await Promise.all(requests);
  return responses.map(response => response.data.data);
};

const Favorites = () => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('cryptoFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  const { data: favoriteCryptos, isLoading, isError } = useQuery({
    queryKey: ['favoriteCryptos', favorites],
    queryFn: () => fetchFavoriteCryptos(favorites),
    enabled: favorites.length > 0,
  });

  useEffect(() => {
    localStorage.setItem('cryptoFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (cryptoId) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(id => id !== cryptoId);
      toast.success("Removed from favorites");
      return newFavorites;
    });
  };

  if (isLoading) return <div className="text-center mt-8 terminal-glow">Loading favorites...</div>;
  if (isError) return <div className="text-center mt-8 terminal-glow text-destructive">Error: Unable to fetch favorite cryptos</div>;

  if (favorites.length === 0) {
    return <div className="text-center mt-8 terminal-glow">You haven't added any favorites yet.</div>;
  }

  return (
    <div className="bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4 terminal-glow">Your Favorite Cryptocurrencies</h1>
      <table className="terminal-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price (USD)</th>
            <th>Market Cap (USD)</th>
            <th>24h Change</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {favoriteCryptos?.map((crypto) => (
            <tr key={crypto.id}>
              <td>{crypto.rank}</td>
              <td>
                <Link to={`/asset/${crypto.id}`} className="text-primary hover:underline">
                  {crypto.name}
                </Link>
              </td>
              <td>{crypto.symbol}</td>
              <td>${parseFloat(crypto.priceUsd).toFixed(2)}</td>
              <td>${parseFloat(crypto.marketCapUsd).toLocaleString()}</td>
              <td className={parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-primary' : 'text-destructive'}>
                {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
              </td>
              <td>
                <button
                  onClick={() => toggleFavorite(crypto.id)}
                  className="focus:outline-none"
                >
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Favorites;
