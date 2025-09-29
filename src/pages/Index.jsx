import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Star, TrendingUp, DollarSign, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from "sonner";
import StatsCard from '@/components/StatsCard';
import { mockChartData } from '@/data/mockData';

const fetchCryptos = async () => {
  try {
    console.log('Fetching crypto data...');
    // Using CoinGecko API which has better CORS support
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1');
    console.log('Crypto data fetched successfully:', response.data);
    
    // Transform data to match previous structure
    return response.data.map(coin => ({
      id: coin.id,
      rank: coin.market_cap_rank,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      priceUsd: coin.current_price.toString(),
      marketCapUsd: coin.market_cap.toString(),
      changePercent24Hr: coin.price_change_percentage_24h?.toString() || '0'
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    console.error('Error details:', error.response || error.message);
    throw error;
  }
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
    const text = "Welcome to Creditcoin Moonshot Universe...";
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

  if (isLoading) return <div className="text-center mt-8 creditcoin-glow">Loading...</div>;
  if (isError) return <div className="text-center mt-8 creditcoin-glow text-destructive">Error: Unable to fetch crypto data</div>;

  // Get Creditcoin data if available
  const creditcoin = cryptos?.find(crypto => crypto.id === 'creditcoin' || crypto.symbol === 'CTC');
  const bitcoin = cryptos?.find(crypto => crypto.id === 'bitcoin');
  const ethereum = cryptos?.find(crypto => crypto.id === 'ethereum');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold creditcoin-glow">Creditcoin Dashboard</h1>
          <p className="text-muted-foreground font-mono">{terminalText}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Market Cap"
          value={cryptos ? `$${(cryptos.reduce((sum, crypto) => sum + parseFloat(crypto.marketCapUsd), 0) / 1e12).toFixed(2)}T` : 'Loading...'}
          description="Global crypto market"
          icon={DollarSign}
          trend={5.2}
        />
        <StatsCard
          title="Active Assets"
          value={cryptos?.length || 0}
          description="Tracked cryptocurrencies"
          icon={Activity}
        />
        <StatsCard
          title="Creditcoin Price"
          value={creditcoin ? `$${parseFloat(creditcoin.priceUsd).toFixed(4)}` : '$0.5847'}
          description="CTC current price"
          icon={TrendingUp}
          trend={creditcoin ? parseFloat(creditcoin.changePercent24Hr) : 8.4}
        />
        <StatsCard
          title="DeFi Users"
          value="12.4K"
          description="Active participants"
          icon={Users}
          trend={23.1}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="creditcoin">Creditcoin Trends</TabsTrigger>
          <TabsTrigger value="search">Asset Search</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Price Trends (7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockChartData.priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Top Cryptocurrencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cryptos?.slice(0, 5).map((crypto, index) => (
                    <div key={crypto.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-mono text-muted-foreground">#{crypto.rank}</span>
                        <div>
                          <p className="font-medium">{crypto.name}</p>
                          <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${parseFloat(crypto.priceUsd).toFixed(2)}</p>
                        <p className={`text-sm ${parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="creditcoin" className="space-y-4">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Creditcoin Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-2xl font-bold">
                      {creditcoin ? `$${parseFloat(creditcoin.priceUsd).toFixed(4)}` : '$0.5847'}
                    </p>
                    <p className={`text-sm ${(creditcoin ? parseFloat(creditcoin.changePercent24Hr) : 8.4) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {creditcoin ? `${parseFloat(creditcoin.changePercent24Hr).toFixed(2)}%` : '+8.4%'} (24h)
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Market Cap</p>
                    <p className="text-xl font-bold">
                      {creditcoin ? `$${(parseFloat(creditcoin.marketCapUsd) / 1e6).toFixed(1)}M` : '$45.2M'}
                    </p>
                  </div>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Creditcoin chart integration</p>
                  <p className="text-sm mt-2">Real-time price tracking coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Cryptocurrency Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCryptos?.map((crypto) => (
                  <div key={crypto.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-mono text-muted-foreground">#{crypto.rank}</span>
                      <div>
                        <Link to={`/asset/${crypto.id}`} className="font-medium text-primary hover:underline">
                          {crypto.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">${parseFloat(crypto.priceUsd).toFixed(2)}</p>
                        <p className={`text-sm ${parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                        </p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(crypto.id)}
                        className="focus:outline-none hover:scale-110 transition-transform"
                      >
                        <Star
                          size={16}
                          className={favorites.includes(crypto.id) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
