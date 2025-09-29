import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Search, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from "sonner";

const fetchCryptos = async () => {
  const response = await axios.get('https://api.coincap.io/v2/assets');
  return response.data.data;
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [terminalText, setTerminalText] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('cryptoFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const { data: cryptos, isLoading, isError } = useQuery({
    queryKey: ['cryptos'],
    queryFn: fetchCryptos,
  });

  useEffect(() => {
    localStorage.setItem('cryptoFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (cryptoId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(cryptoId)) {
        toast.success("Removed from favorites");
        return prevFavorites.filter(id => id !== cryptoId);
      } else {
        toast.success("Added to favorites");
        return [...prevFavorites, cryptoId];
      }
    });
  };

  const filteredCryptos = cryptos?.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const text = "Initializing Crypto Tracker...";
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setTerminalText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, 50);

    return () => clearInterval(typingEffect);
  }, []);

  if (isLoading) return <div className="text-center mt-8 terminal-glow">Loading...</div>;
  if (isError) return <div className="text-center mt-8 terminal-glow text-destructive">Error: Unable to fetch crypto data</div>;

  return (
    <div className="bg-background text-foreground">
      <div className="mb-4 font-mono">{terminalText}</div>
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 terminal-input"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
      </div>
      <table className="terminal-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price (USD)</th>
            <th>Market Cap (USD)</th>
            <th>24h Change</th>
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptos?.map((crypto) => (
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
                  <Star
                    size={16}
                    className={favorites.includes(crypto.id) ? "fill-yellow-500 text-yellow-500" : "text-gray-400"}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Index;
