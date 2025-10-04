import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, TrendingUp, Zap, Users, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import heroImage from '@/assets/hero-defi.jpg';
import defiNetwork from '@/assets/defi-network.jpg';
import creditScore from '@/assets/credit-score.jpg';

const Landing = () => {
  const navigate = useNavigate();

  const growthData = [
    { month: 'Jan', tvl: 35, users: 1200 },
    { month: 'Feb', tvl: 38, users: 1350 },
    { month: 'Mar', tvl: 40, users: 1500 },
    { month: 'Apr', tvl: 42, users: 1680 },
    { month: 'May', tvl: 45, users: 1850 }
  ];

  const volumeData = [
    { month: 'Jan', volume: 650 },
    { month: 'Feb', volume: 720 },
    { month: 'Mar', volume: 780 },
    { month: 'Apr', volume: 820 },
    { month: 'May', volume: 850 }
  ];

  const platformStats = [
    { label: 'Total Value Locked', value: '$45M', icon: DollarSign, trend: '+12.5%' },
    { label: 'Active Users', value: '1,850', icon: Users, trend: '+18%' },
    { label: 'Daily Volume', value: '$850K', icon: Activity, trend: '+5.2%' },
    { label: 'Active Loans', value: '1,247', icon: TrendingUp, trend: '+8.1%' }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "DeFi Investor",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      text: "MoonCreditFi revolutionized how I access credit in DeFi. The platform is intuitive and secure."
    },
    {
      name: "Marcus Rodriguez",
      role: "Crypto Trader",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      text: "Best credit scoring system in crypto. Fast, transparent, and backed by real data."
    },
    {
      name: "Aisha Patel",
      role: "Blockchain Developer",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop",
      text: "The DePIN integration is genius. Finally, real-world assets meeting blockchain finance."
    },
    {
      name: "James Wilson",
      role: "Fintech Entrepreneur",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      text: "MoonCreditFi's lending rates are competitive and the credit profiles are game-changing."
    },
    {
      name: "Elena Kowalski",
      role: "Web3 Enthusiast",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      text: "Seamless user experience with powerful DeFi tools. This is the future of credit."
    }
  ];

  const trustedCompanies = [
    { name: "Binance", symbol: "BNB" },
    { name: "Ethereum", symbol: "ETH" },
    { name: "Chainlink", symbol: "LINK" },
    { name: "Polygon", symbol: "MATIC" },
    { name: "Avalanche", symbol: "AVAX" },
    { name: "Solana", symbol: "SOL" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed w-full z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/moonfi-logo.svg" alt="MoonCreditFi logo" className="w-8 h-8 rounded-md object-cover" />
            <span className="text-xl font-bold mooncreditfi-glow">MoonCreditFi</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="DeFi Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"></div>
        </div>
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 leading-tight">
            <span className="mooncreditfi-glow block">MoonCreditFi — Decentralized Credit, Simplified</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            Transparent on-chain credit, competitive DeFi lending, and real-world financing powered by privacy-first
            blockchain integrations. Start building your on-chain credit profile and unlock better rates today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="btn-mooncreditfi text-base sm:text-lg px-6 sm:px-8" onClick={() => navigate('/dashboard')}
              aria-label="Get started with MoonCreditFi">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8" onClick={() => navigate('/defi')}
              aria-label="Explore DeFi insights">
              Explore DeFi
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-12 sm:mt-16">
            <div className="card-glow p-4 sm:p-6 rounded-xl">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-3 mx-auto" />
              <h3 className="font-bold text-base sm:text-lg mb-1">Secure & Transparent</h3>
              <p className="text-sm text-muted-foreground">
                Blockchain-verified credit history with full transparency and security.
              </p>
            </div>
            <div className="card-glow p-4 sm:p-6 rounded-xl">
              <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-3 mx-auto" />
              <h3 className="font-bold text-base sm:text-lg mb-1">Competitive Rates</h3>
              <p className="text-sm text-muted-foreground">
                Access the best lending and borrowing rates across DeFi protocols.
              </p>
            </div>
            <div className="card-glow p-4 sm:p-6 rounded-xl">
              <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-3 mx-auto" />
              <h3 className="font-bold text-base sm:text-lg mb-1">DePIN Integration</h3>
              <p className="text-sm text-muted-foreground">
                Finance real-world assets like solar panels, WiFi nodes, and mobility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
            Platform <span className="mooncreditfi-glow">Performance</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {platformStats.map((stat, index) => (
              <Card key={index} className="card-glow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="h-8 w-8 text-primary" />
                    <span className="text-sm text-green-500 font-semibold">{stat.trend}</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Total Value Locked Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${value}M`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`$${value}M`, 'TVL']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tvl" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fill="url(#tvlGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Monthly Trading Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${value}K`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`$${value}K`, 'Volume']}
                    />
                    <Bar 
                      dataKey="volume" 
                      fill="hsl(var(--chart-1))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Visual Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Build Your <span className="mooncreditfi-glow">On-Chain Credit</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Create a transparent, verifiable credit profile on the blockchain. Access better rates, higher limits, and exclusive DeFi opportunities based on your proven track record.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Blockchain Verified</h4>
                    <p className="text-sm text-muted-foreground">Every transaction immutably recorded and verified</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Dynamic Credit Scoring</h4>
                    <p className="text-sm text-muted-foreground">Real-time credit score updates based on your activity</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Instant Access</h4>
                    <p className="text-sm text-muted-foreground">No waiting periods, access credit immediately</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img 
                src={creditScore} 
                alt="Credit Score Visualization" 
                className="rounded-2xl shadow-2xl card-glow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <img 
                src={defiNetwork} 
                alt="DeFi Network" 
                className="rounded-2xl shadow-2xl card-glow"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Connect to the <span className="mooncreditfi-glow">DeFi Ecosystem</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Access the best rates across multiple DeFi protocols. Our platform aggregates lending and borrowing opportunities to give you the most competitive terms in the market.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-lg border border-border">
                  <div className="text-2xl font-bold text-primary mb-1">5.2%</div>
                  <p className="text-sm text-muted-foreground">Avg. Lending APY</p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-border">
                  <div className="text-2xl font-bold text-primary mb-1">7.8%</div>
                  <p className="text-sm text-muted-foreground">Avg. Borrow APR</p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-border">
                  <div className="text-2xl font-bold text-primary mb-1">$45M</div>
                  <p className="text-sm text-muted-foreground">Total Locked</p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-border">
                  <div className="text-2xl font-bold text-primary mb-1">6+</div>
                  <p className="text-sm text-muted-foreground">Chain Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 overflow-hidden bg-muted/30">
        <div className="container mx-auto px-6 mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            Trusted by <span className="mooncreditfi-glow">Thousands</span>
          </h2>
          <p className="text-center text-muted-foreground text-sm sm:text-base">
            See what our users are saying about the platform
          </p>
        </div>
        
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 md:px-8 snap-x snap-mandatory">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-72 sm:w-80 md:w-96 mx-0 sm:mx-2 p-4 sm:p-6 bg-card rounded-xl border border-border/50 card-glow snap-start"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic text-sm sm:text-base">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Companies Section */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-6 mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            Trusted <span className="mooncreditfi-glow">Partners</span>
          </h2>
          <p className="text-center text-muted-foreground text-sm sm:text-base">
            Integrated with leading blockchain platforms
          </p>
        </div>
        
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 md:px-8 snap-x snap-mandatory items-center">
            {[...trustedCompanies, ...trustedCompanies].map((company, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-24 mx-0 sm:mx-2 md:mx-4 flex flex-col items-center justify-center bg-card rounded-xl border border-border/50 card-glow gap-1 sm:gap-2 snap-start"
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                  {company.symbol}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{company.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <img src="/moonfi-logo.svg" alt="MoonCreditFi logo" className="w-6 h-6 rounded-sm object-cover" />
              <span className="font-semibold">MoonCreditFi Moonshot Universe</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#terms" className="hover:text-primary transition-colors">Terms</a>
              <a href="#privacy" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 MoonCreditFi Moonshot Universe
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
