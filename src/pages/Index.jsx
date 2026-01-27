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
  const { isConnected, account } = useWalletContext();
  const address = account;
  
  const { data: blockNumber } = useBlockNumber({ watch: true });
  
  // On-chain user data - lender info
  const { data: lenderInfo, refetch: refetchLenderInfo, isError: lenderError } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'lenders',
    args: [address],
    query: { enabled: isConnected && !!address }
  });

  // Yield earned
  const { data: yieldData, refetch: refetchYield, isError: yieldError } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'calculateYieldEarned',
    args: [address],
    query: { enabled: isConnected && !!address }
  });

  // Credit profile
  const { data: creditProfile, refetch: refetchCredit, isError: creditError } = useReadContract({
    address: CREDIT_PROFILE_ADDRESS,
    abi: CREDIT_PROFILE_ABI,
    functionName: 'getProfile',
    args: [address],
    query: { enabled: isConnected && !!address }
  });

  // Pool stats for TVL
  const { data: poolStats, refetch: refetchPool } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'getPoolStats',
  });

  // Borrower info
  const { data: borrowerInfo, refetch: refetchBorrower, isError: borrowerError } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'borrowers',
    args: [address],
    query: { enabled: isConnected && !!address }
  });

  // Debug logging for contract reads
  useEffect(() => {
    if (isConnected && address) {
      console.log('Dashboard contract data:', {
        address,
        lenderInfo,
        yieldData,
        creditProfile,
        poolStats,
        borrowerInfo,
        errors: { lenderError, yieldError, creditError, borrowerError }
      });
    }
  }, [lenderInfo, yieldData, creditProfile, poolStats, borrowerInfo, address, isConnected, lenderError, yieldError, creditError, borrowerError]);

  // Refetch on new blocks
  useEffect(() => {
    if (blockNumber && isConnected) {
      refetchLenderInfo?.();
      refetchYield?.();
      refetchCredit?.();
      refetchPool?.();
      refetchBorrower?.();
    }
  }, [blockNumber, isConnected, refetchBorrower, refetchCredit, refetchLenderInfo, refetchPool, refetchYield]);

  // Parse values with safe defaults
  const depositedBalance = lenderInfo?.[0] ? formatEther(lenderInfo[0]) : '0';
  const yieldEarned = yieldData ? formatEther(yieldData) : '0';
  const creditScore = creditProfile?.[0] ? Number(creditProfile[0]) : 0;
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
        // determine coin id from fetched cryptos list to avoid hard-coded missing ids
        const coinEntry = cryptos?.find(c => c.symbol === 'CTC' || c.id === 'creditcoin');
        if (!coinEntry) {
          console.warn('Creditcoin not found in CoinGecko markets list; using mock data');
          setCreditcoinHistory(fallbackPriceHistory);
          return;
        }
        const coinId = coinEntry.id;
        const baseUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`;
        const maxRetries = 3;
        let attempt = 0;
      const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

      while (attempt < maxRetries) {
        try {
          const res = await axios.get(baseUrl, { params: { vs_currency: 'usd', days: 30 } });
          if (!mounted) return;
          const prices = res.data.prices.map(([ts, price]) => ({ date: new Date(ts).toISOString().slice(0,10), price }));
          setCreditcoinHistory(prices.slice(-30));
          return;
        } catch (err) {
          const status = err?.response?.status;
          // If coin id is invalid (404), no point retrying
          if (status === 404) {
            console.warn(`CoinGecko returned 404 for ${coinEntry?.id || 'creditcoin'}; using mock data.`);
            setCreditcoinHistory(fallbackPriceHistory);
            return;
          }
          // If rate limited (429) or network/CORS issues, retry with backoff
          attempt += 1;
          console.warn(`Creditcoin price fetch attempt ${attempt} failed (status: ${status}).`);

          if (attempt >= maxRetries) {
            console.warn('Failed to fetch Creditcoin price history after retries, using mock data', err);
            setCreditcoinHistory(fallbackPriceHistory);
            return;
          }

          // exponential backoff: 500ms * 2^(attempt-1)
          const backoff = 500 * Math.pow(2, attempt - 1);
          await sleep(backoff);
        }
      }
    };
    
    fetchPrices();
    fetchCreditcoinPrices();
    return () => { mounted = false; };
  }, [cryptos]);

  if (isLoading) return <div className="text-center mt-8 mooncreditfi-glow">Loading...</div>;
  if (isError) return <div className="text-center mt-8 mooncreditfi-glow text-destructive">Error: Unable to fetch crypto data</div>;

  // Get Creditcoin data
  const creditcoin = cryptos?.find(crypto => crypto.id === 'creditcoin' || crypto.symbol === 'CTC');
  // eslint-disable-next-line no-unused-vars
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
      className="space-y-4 sm:space-y-6 md:space-y-8 px-1 sm:px-0"
    >
      {/* Welcome Terminal Effect */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-lg p-3 sm:p-4 md:p-6 font-mono text-xs sm:text-sm">
        <div className="text-primary mb-1 sm:mb-2">$ mooncreditfi.init()</div>
        <div className="text-muted-foreground break-words">{terminalText}</div>
      </motion.div>

      {/* Dashboard Overview Cards */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <StatsCard
            title="Deposited Balance"
            value={isConnected ? `${parseFloat(depositedBalance).toFixed(2)} CTC` : 'Not Connected'}
            description="Your lending position"
            icon={Wallet}
            className="card-glow"
          />
          <StatsCard
            title="Active Loan"
            value={`${parseFloat(activeLoanAmount).toFixed(2)} CTC`}
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
            value={`${parseFloat(yieldEarned).toFixed(4)} CTC`}
            description="Total earnings from lending"
            icon={TrendingUp}
            trend={parseFloat(yieldEarned) > 0 ? 8.5 : 0}
            className="card-glow"
          />
        </div>
      </motion.div>

      {/* Market Stats Cards */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Market Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <StatsCard
            title="Total Market Cap"
            value={marketCapOverride ? marketCapOverride : formatMarketCap(globalMarketCap)}
            description={marketCapOverride ? 'Global (override)' : 'Global crypto market'}
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
            value={`${parseFloat(totalDeposited).toFixed(2)} CTC`}
            description="Total Value Locked"
            icon={Users}
            trend={23.1}
          />
        </div>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-3 sm:space-y-4">
        <TabsList className="w-full flex overflow-x-auto no-scrollbar">
          <TabsTrigger value="overview" className="flex-1 text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="creditcoin" className="flex-1 text-xs sm:text-sm">CTC Trends</TabsTrigger>
          <TabsTrigger value="search" className="flex-1 text-xs sm:text-sm">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <Card className="card-glow">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="text-base sm:text-lg">Price Trends (7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-4 md:p-6 pt-0">
                <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px] md:!h-[300px]">
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} width={50} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="text-base sm:text-lg">Top Cryptocurrencies</CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-4 md:p-6 pt-0">
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  {cryptos?.slice(0, 5).map((crypto) => (
                    <div key={crypto.id} className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                        <span className="text-xs sm:text-sm font-mono text-muted-foreground">#{crypto.rank}</span>
                        <div className="min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{crypto.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{crypto.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-semibold text-sm sm:text-base">${parseFloat(crypto.priceUsd).toFixed(2)}</p>
                        <p className={`text-xs sm:text-sm ${parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
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

        <TabsContent value="creditcoin" className="space-y-3 sm:space-y-4">
          <Card className="card-glow">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="text-base sm:text-lg">Creditcoin (CTC) Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 md:p-6 pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 sm:gap-3 md:gap-4">
                  <div className="p-2 sm:p-3 md:p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">Current Price</p>
                    <p className="text-base sm:text-xl md:text-2xl font-bold">
                      {creditcoin ? `$${parseFloat(creditcoin.priceUsd).toFixed(4)}` : '$0.5847'}
                    </p>
                    <p className={`text-xs sm:text-sm ${(creditcoin ? parseFloat(creditcoin.changePercent24Hr) : 8.4) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {creditcoin ? `${parseFloat(creditcoin.changePercent24Hr).toFixed(2)}%` : '+8.4%'} (24h)
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 md:p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">Market Cap</p>
                    <p className="text-sm sm:text-lg md:text-xl font-bold">
                      {creditcoin ? `$${(parseFloat(creditcoin.marketCapUsd) / 1e6).toFixed(1)}M` : '$45.2M'}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 md:p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">24h Volume</p>
                    <p className="text-sm sm:text-lg md:text-xl font-bold">
                      {creditcoin ? `$${(parseFloat(creditcoin.marketCapUsd) * 0.15 / 1e6).toFixed(2)}M` : '$6.8M'}
                    </p>
                  </div>
                </div>
                <div>
                  <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px] md:!h-[300px]">
                    <LineChart data={creditcoinHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => `$${value.toFixed(3)}`}
                        width={45}
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
                  <p className="text-xs sm:text-sm text-center text-muted-foreground mt-1 sm:mt-2">30-Day Price History</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-3 sm:space-y-4">
          <Card className="card-glow">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="text-base sm:text-lg">Cryptocurrency Search</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 md:p-6 pt-0">
              <div className="relative mb-3 sm:mb-4 md:mb-6">
                <Input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:pl-10 text-sm sm:text-base"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </div>
              
              <div className="space-y-1.5 sm:space-y-2 max-h-72 sm:max-h-80 md:max-h-96 overflow-y-auto">
                {filteredCryptos?.map((crypto) => (
                  <div key={crypto.id} className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                      <span className="text-xs sm:text-sm font-mono text-muted-foreground">#{crypto.rank}</span>
                      <div className="min-w-0">
                        <Link to={`/asset/${crypto.id}`} className="font-medium text-sm sm:text-base text-primary hover:underline truncate block">
                          {crypto.name}
                        </Link>
                        <p className="text-xs sm:text-sm text-muted-foreground">{crypto.symbol}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 ml-2">
                      <div className="text-right">
                        <p className="font-semibold text-sm sm:text-base">${parseFloat(crypto.priceUsd).toFixed(2)}</p>
                        <p className={`text-xs sm:text-sm ${parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                        </p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(crypto.id)}
                        className="focus:outline-none hover:scale-110 transition-transform p-1"
                      >
                        <Star
                          size={14}
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
