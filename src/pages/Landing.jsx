import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Shield, TrendingUp, Zap } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
      setIsChecking(false);
    });
  }, [navigate]);

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "DeFi Investor",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      text: "MoonFI revolutionized how I access credit in DeFi. The platform is intuitive and secure."
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
      text: "MoonFI's lending rates are competitive and the credit profiles are game-changing."
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-moonfi-blue to-moonfi-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold moonfi-glow">MoonFI</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button className="btn-moonfi" onClick={() => navigate('/auth')}>
              Sign Up
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">🚀 Moonshot Universe Hackathon</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="moonfi-glow">MoonFI Moonshot</span>
            <br />
            <span className="text-muted-foreground">The Future of Decentralized Credit</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access transparent credit scoring, competitive DeFi lending rates, and real-world asset financing 
            through blockchain technology. Build your on-chain credit history today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-moonfi text-lg px-8" onClick={() => navigate('/auth')}>
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/auth')}>
              View Dashboard
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="card-glow p-6 rounded-xl">
              <Shield className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="font-bold text-lg mb-2">Secure & Transparent</h3>
              <p className="text-sm text-muted-foreground">
                Blockchain-verified credit history with full transparency and security.
              </p>
            </div>
            <div className="card-glow p-6 rounded-xl">
              <TrendingUp className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="font-bold text-lg mb-2">Competitive Rates</h3>
              <p className="text-sm text-muted-foreground">
                Access the best lending and borrowing rates across DeFi protocols.
              </p>
            </div>
            <div className="card-glow p-6 rounded-xl">
              <Zap className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="font-bold text-lg mb-2">DePIN Integration</h3>
              <p className="text-sm text-muted-foreground">
                Finance real-world assets like solar panels, WiFi nodes, and mobility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 overflow-hidden bg-muted/30">
        <div className="container mx-auto px-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Trusted by <span className="moonfi-glow">Thousands</span>
          </h2>
          <p className="text-center text-muted-foreground">
            See what our users are saying about the platform
          </p>
        </div>
        
        <div className="relative">
          <div className="flex animate-scroll-right">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-96 mx-4 p-6 bg-card rounded-xl border border-border/50 card-glow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Companies Section */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Trusted <span className="moonfi-glow">Partners</span>
          </h2>
          <p className="text-center text-muted-foreground">
            Integrated with leading blockchain platforms
          </p>
        </div>
        
        <div className="relative">
          <div className="flex animate-scroll-left items-center">
            {[...trustedCompanies, ...trustedCompanies].map((company, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-48 h-24 mx-6 flex flex-col items-center justify-center bg-card rounded-xl border border-border/50 card-glow gap-2"
              >
                <div className="text-3xl font-bold text-primary">
                  {company.symbol}
                </div>
                <p className="text-sm text-muted-foreground">{company.name}</p>
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
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-moonfi-blue to-moonfi-purple flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <span className="font-semibold">MoonFI Moonshot Universe</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#terms" className="hover:text-primary transition-colors">Terms</a>
              <a href="#privacy" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 MoonFI Moonshot Universe
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
