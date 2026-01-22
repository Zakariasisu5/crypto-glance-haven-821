import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, TrendingUp, Zap, Users, DollarSign, Activity, ChevronRight, Sparkles, Lock, Globe, Coins } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
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

  const features = [
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'Blockchain-verified credit history with full transparency and security.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Competitive Rates',
      description: 'Access the best lending and borrowing rates across DeFi protocols.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'DePIN Integration',
      description: 'Finance real-world assets like solar panels, WiFi nodes, and mobility.',
      gradient: 'from-orange-500 to-yellow-500'
    }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-xl fixed w-full z-50 bg-background/80">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/moonfi-logo.svg" alt="MoonCreditFi logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-md object-cover" />
            <span className="text-lg sm:text-xl font-bold mooncreditfi-glow">MoonCreditFi</span>
          </div>
          <Button 
            size="sm" 
            className="btn-mooncreditfi text-sm px-4"
            onClick={() => navigate('/dashboard')}
          >
            Launch App
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="DeFi Background" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
          {/* Animated orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto text-center max-w-5xl relative z-10"
        >
          <motion.div variants={itemVariants}>
            <Badge className="mb-4 sm:mb-6 bg-primary/10 text-primary border-primary/30 px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              Built on Creditcoin Testnet
            </Badge>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight"
          >
            <span className="mooncreditfi-glow">Decentralized Credit</span>
            <br />
            <span className="text-muted-foreground">Made Simple</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
          >
            Transparent on-chain credit, competitive DeFi lending, and real-world infrastructure financing. 
            Build your credit profile and unlock better rates today.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
          >
            <Button 
              size="lg" 
              className="btn-mooncreditfi text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto" 
              onClick={() => navigate('/dashboard')}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto border-primary/50 hover:bg-primary/10" 
              onClick={() => navigate('/defi')}
            >
              Explore DeFi
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Live Stats Row */}
          <motion.div 
            variants={itemVariants}
            className="mt-10 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto px-4"
          >
            {[
              { label: 'TVL', value: '$45M+' },
              { label: 'Users', value: '1.8K+' },
              { label: 'APY', value: '8.5%' },
              { label: 'Chains', value: '6+' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 sm:p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="card-glow h-full group hover:scale-[1.02] transition-transform duration-300">
                  <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 text-center">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 sm:p-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Stats Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Platform <span className="mooncreditfi-glow">Performance</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
              Real-time metrics showcasing our growing DeFi ecosystem
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12"
          >
            {platformStats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="card-glow">
                  <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                      <span className="text-xs sm:text-sm text-green-500 font-semibold">{stat.trend}</span>
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="card-glow">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  TVL Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickMargin={8}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickFormatter={(value) => `$${value}M`}
                      width={45}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
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
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                  Monthly Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickMargin={8}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickFormatter={(value) => `$${value}K`}
                      width={45}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [`$${value}K`, 'Volume']}
                    />
                    <Bar 
                      dataKey="volume" 
                      fill="hsl(var(--primary))"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Visual Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 sm:mb-24"
          >
            <div className="order-2 lg:order-1">
              <Badge className="mb-3 sm:mb-4 bg-blue-500/10 text-blue-400 border-blue-500/30">
                <Lock className="w-3 h-3 mr-1" />
                On-Chain Credit
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Build Your <span className="mooncreditfi-glow">Credit Profile</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                Create a transparent, verifiable credit profile on the blockchain. Access better rates, higher limits, and exclusive DeFi opportunities.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  { icon: Shield, title: 'Blockchain Verified', desc: 'Immutable transaction history' },
                  { icon: TrendingUp, title: 'Dynamic Scoring', desc: 'Real-time credit updates' },
                  { icon: Zap, title: 'Instant Access', desc: 'No waiting periods' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <img 
                src={creditScore} 
                alt="Credit Score Visualization" 
                className="rounded-2xl shadow-2xl card-glow w-full"
              />
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            <div>
              <img 
                src={defiNetwork} 
                alt="DeFi Network" 
                className="rounded-2xl shadow-2xl card-glow w-full"
              />
            </div>
            <div>
              <Badge className="mb-3 sm:mb-4 bg-purple-500/10 text-purple-400 border-purple-500/30">
                <Globe className="w-3 h-3 mr-1" />
                Multi-Chain
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Access the <span className="mooncreditfi-glow">DeFi Ecosystem</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                Connect to multiple DeFi protocols for the most competitive lending and borrowing terms in the market.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { value: '5.2%', label: 'Avg. Lending APY' },
                  { value: '7.8%', label: 'Avg. Borrow APR' },
                  { value: '$45M', label: 'Total Locked' },
                  { value: '6+', label: 'Chains' }
                ].map((stat, i) => (
                  <div key={i} className="p-3 sm:p-4 bg-card rounded-xl border border-border">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 overflow-hidden bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Trusted by <span className="mooncreditfi-glow">Thousands</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              See what our users are saying about the platform
            </p>
          </motion.div>
        </div>
        
        <div className="relative">
          <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 pb-4 snap-x snap-mandatory">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-72 sm:w-80 md:w-96 p-4 sm:p-6 bg-card rounded-xl border border-border/50 card-glow snap-start"
              >
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
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

      {/* Trusted Partners */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Trusted <span className="mooncreditfi-glow">Partners</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Integrated with leading blockchain platforms
            </p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
            {trustedCompanies.map((company, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="w-28 sm:w-36 md:w-40 h-20 sm:h-24 flex flex-col items-center justify-center bg-card rounded-xl border border-border/50 card-glow"
              >
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">{company.symbol}</div>
                <p className="text-xs sm:text-sm text-muted-foreground">{company.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5"></div>
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5"></div>
            <div className="relative p-8 sm:p-12 md:p-16 text-center">
              <Coins className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-primary" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Ready to Start <span className="mooncreditfi-glow">Earning?</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto">
                Join thousands of users building their on-chain credit and earning competitive yields.
              </p>
              <Button 
                size="lg" 
                className="btn-mooncreditfi text-base sm:text-lg px-8 sm:px-10 h-12 sm:h-14"
                onClick={() => navigate('/dashboard')}
              >
                Launch App
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 sm:py-8 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <img src="/moonfi-logo.svg" alt="MoonCreditFi logo" className="w-5 h-5 sm:w-6 sm:h-6 rounded-sm object-cover" />
              <span className="font-semibold text-sm sm:text-base">MoonCreditFi</span>
            </div>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#terms" className="hover:text-primary transition-colors">Terms</a>
              <a href="#privacy" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2025 MoonCreditFi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;