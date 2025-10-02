import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, TrendingUp, Zap } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

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
            <img src="/moonfi-logo.svg" alt="moonFi logo" className="w-8 h-8 rounded-md object-cover" />
            <span className="text-xl font-bold moonfi-glow">MoonFI</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 leading-tight">
            <span className="moonfi-glow block">MoonFI — Decentralized Credit, Simplified</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            Transparent on-chain credit, competitive DeFi lending, and real-world financing powered by privacy-first
            blockchain integrations. Start building your on-chain credit profile and unlock better rates today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="btn-moonfi text-base sm:text-lg px-6 sm:px-8" onClick={() => navigate('/dashboard')}
              aria-label="Get started with MoonFI">
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

      {/* Testimonials Section */}
      <section className="py-20 overflow-hidden bg-muted/30">
        <div className="container mx-auto px-6 mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            Trusted by <span className="moonfi-glow">Thousands</span>
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
            Trusted <span className="moonfi-glow">Partners</span>
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
              <img src="/moonfi-logo.svg" alt="moonFi logo" className="w-6 h-6 rounded-sm object-cover" />
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
