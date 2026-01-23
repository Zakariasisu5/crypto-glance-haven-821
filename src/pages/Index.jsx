import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Star, TrendingUp, DollarSign, Users, Activity, Wallet, CreditCard, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from "sonner";
import StatsCard from '@/components/StatsCard';
// Inline fallback price history (7 days) in case external API fails
const fallbackPriceHistory = [
  { date: '2024-01-01', price: 0.45 },
  { date: '2024-01-02', price: 0.48 },
  { date: '2024-01-03', price: 0.52 },
  { date: '2024-01-04', price: 0.49 },
  { date: '2024-01-05', price: 0.55 },
  { date: '2024-01-06', price: 0.58 },
  { date: '2024-01-07', price: 0.62 }
];
// axios already imported above; useEffect imported with useState at top
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI, CREDIT_PROFILE_ADDRESS, CREDIT_PROFILE_ABI } from '@/hooks/useContract';
import { useReadContract, useBlockNumber } from 'wagmi';
import { formatEther } from 'viem';
import { useWalletContext } from '@/contexts/WalletContext';
import { motion } from 'framer-motion';

const fetchCryptos = async () => {
  try {
    console.log('Fetching crypto data...');
    // Using CoinGecko API which has better CORS support
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1', {
      timeout: 5000
    });
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
    // Return mock data if API fails
    return [
      {
        id: 'creditcoin',
        rank: 1,
        name: 'Creditcoin',
        symbol: 'CTC',
        priceUsd: '0.62',
        marketCapUsd: '45000000',
        changePercent24Hr: '5.2'
      },
      {
        id: 'bitcoin',
        rank: 2,
        name: 'Bitcoin',
        symbol: 'BTC',
        priceUsd: '65000',
        marketCapUsd: '1280000000000',
        changePercent24Hr: '2.5'
      },
      {
        id: 'ethereum',
        rank: 3,
        name: 'Ethereum',
        symbol: 'ETH',
        priceUsd: '3200',
        marketCapUsd: '385000000000',
        changePercent24Hr: '1.8'
      }
    ];
  }
};

const fetchGlobalMarket = async () => {
  try {
    const res = await axios.get('https://api.coingecko.com/api/v3/global');
    const marketCap = res.data?.data?.total_market_cap?.usd;
    return marketCap ?? null;
  } catch (e) {
    console.warn('Failed to fetch global market cap', e);
    return null;
  }
};

const formatMarketCap = (value) => {
  if (value == null) return '—';
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(0)}`;
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [terminalText, setTerminalText] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('cryptoFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const { balance, isConnected, address } = useWalletContext();
  
  const { data: blockNumber } = useBlockNumber({ watch: true });
  
  // On-chain user data - lender info
  const { data: lenderInfo, refetch: refetchLenderInfo } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'lenders',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Yield earned
  const { data: yieldData, refetch: refetchYield } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'calculateYieldEarned',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Credit profile
  const { data: creditProfile, refetch: refetchCredit } = useReadContract({
    address: CREDIT_PROFILE_ADDRESS,
    abi: CREDIT_PROFILE_ABI,
    functionName: 'getProfile',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Pool stats for TVL
  const { data: poolStats, refetch: refetchPool } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'getPoolStats',
    query: { enabled: true },
  });

  // Borrower info
  const { data: borrowerInfo, refetch: refetchBorrower } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'borrowers',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Refetch on new blocks
  useEffect(() => {
    if (blockNumber) {
      refetchLenderInfo?.();
      refetchYield?.();
      refetchCredit?.();
      refetchPool?.();
      refetchBorrower?.();
    }
  }, [blockNumber]);

  // Parse values with safe defaults
  const depositedBalance = lenderInfo?.[0] ? formatEther(lenderInfo[0]) : '0';
  const yieldEarned = yieldData ? formatEther(yieldData) : '0';
  const creditScore = creditProfile ? Number(creditProfile[0] ?? 0) : 0;
  const activeLoanAmount = borrowerInfo?.[0] ? formatEther(borrowerInfo[0]) : '0';
  const totalDeposited = poolStats?.[0] ? formatEther(poolStats[0]) : '0';
  const { data: cryptos, isLoading, isError } = useQuery({
    queryKey: ['cryptos'],
    queryFn: fetchCryptos,
  });

  const { data: globalMarketCap } = useQuery({
    queryKey: ['globalMarketCap'],
    queryFn: fetchGlobalMarket,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Optional manual override for global market cap (set in browser devtools/localStorage)
  const marketCapOverride = typeof window !== 'undefined' ? localStorage.getItem('globalMarketOverride') : null;

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
    const text = "Welcome to MoonCreditFi Moonshot Universe...";
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

  // Fetch Creditcoin price history for chart
  const [priceHistory, setPriceHistory] = useState(fallbackPriceHistory);
  const [creditcoinHistory, setCreditcoinHistory] = useState(fallbackPriceHistory);
  
  useEffect(() => {
    let mounted = true;
    const fetchPrices = async () => {
      try {
        // Fetch Bitcoin price history for general market trends
        const res = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart', { params: { vs_currency: 'usd', days: 7 } });
        if (!mounted) return;
        const prices = res.data.prices.map(([ts, price]) => ({ date: new Date(ts).toISOString().slice(0,10), price }));
        setPriceHistory(prices.slice(-7));
      } catch (e) {
        console.warn('Failed to fetch Bitcoin price history, using mock data', e);
      }
    };
    
    const fetchCreditcoinPrices = async () => {
      try {
        // Fetch Creditcoin price history
        const res = await axios.get('https://api.coingecko.com/api/v3/coins/creditcoin/market_chart', { params: { vs_currency: 'usd', days: 30 } });
        if (!mounted) return;
        const prices = res.data.prices.map(([ts, price]) => ({ date: new Date(ts).toISOString().slice(0,10), price }));
        setCreditcoinHistory(prices.slice(-30));
      } catch (e) {
        console.warn('Failed to fetch Creditcoin price history, using mock data', e);
      }
    };
    
    fetchPrices();
    fetchCreditcoinPrices();
    return () => { mounted = false; };
  }, []);

  if (isLoading) return <div className="text-center mt-8 mooncreditfi-glow">Loading...</div>;
  if (isError) return <div className="text-center mt-8 mooncreditfi-glow text-destructive">Error: Unable to fetch crypto data</div>;

  // Get Creditcoin data
  const creditcoin = cryptos?.find(crypto => crypto.id === 'creditcoin' || crypto.symbol === 'CTC');
  const bitcoin = cryptos?.find(crypto => crypto.id === 'bitcoin');
  const ethereum = cryptos?.find(crypto => crypto.id === 'ethereum');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Terminal Effect */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-lg p-6 font-mono text-sm">
        <div className="text-primary mb-2">$ mooncreditfi.init()</div>
        <div className="text-muted-foreground">{terminalText}</div>
      </motion.div>

      {/* Dashboard Overview Cards */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Deposited Balance"
            value={isConnected ? `${parseFloat(depositedBalance).toFixed(4)} CTC` : 'Not Connected'}
            description="Your lending position"
            icon={Wallet}
            className="card-glow"
          />
          <StatsCard
            title="Active Loan"
            value={`${parseFloat(activeLoanAmount).toFixed(4)} CTC`}
            description="Current borrowed amount"
            icon={TrendingDown}
            className="card-glow"
          />
          <StatsCard
            title="Credit Score"
            value={creditScore}
            description="Your on-chain credit rating"
            icon={CreditCard}
            className="card-glow"
          />
          <StatsCard
            title="Yield Earned"
            value={`${parseFloat(yieldEarned).toFixed(6)} CTC`}
            description="Total earnings from lending"
            icon={TrendingUp}
            trend={parseFloat(yieldEarned) > 0 ? 8.5 : 0}
            className="card-glow"
          />
        </div>
      </motion.div>

      {/* Market Stats Cards */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-4">Market Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Market Cap"
            value={marketCapOverride ? marketCapOverride : formatMarketCap(globalMarketCap)}
            description={marketCapOverride ? 'Global crypto market (override)' : 'Global crypto market'}
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
            title="TVL"
            value={`${parseFloat(totalDeposited).toFixed(4)} CTC`}
            description="Total Value Locked in pool"
            icon={Users}
            trend={23.1}
          />
        </div>
      </motion.div>

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
                  <LineChart data={priceHistory}>
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
              <CardTitle>Creditcoin (CTC) Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">24h Volume</p>
                    <p className="text-xl font-bold">
                      {creditcoin ? `$${(parseFloat(creditcoin.marketCapUsd) * 0.15 / 1e6).toFixed(2)}M` : '$6.8M'}
                    </p>
                  </div>
                </div>
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={creditcoinHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value.toFixed(4)}`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value.toFixed(6)}`, 'Price']}
                        labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-center text-muted-foreground mt-2">30-Day Price History</p>
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
    </motion.div>
  );
};

export default Index;
