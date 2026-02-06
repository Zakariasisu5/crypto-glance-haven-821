import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, TrendingUp, Wallet, CreditCard, Zap, Building2, 
  CheckCircle, ArrowDown, ChevronRight, Lock, Eye, FileCheck,
  Coins, Users, Globe, Award, Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Scene = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });
  
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-16 relative ${className}`}
    >
      {children}
    </motion.section>
  );
};

const AnimatedText = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
};

const CreditScoreAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  const [score, setScore] = useState(580);
  
  useEffect(() => {
    if (isInView) {
      setScore(580);
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setScore(prev => {
            if (prev >= 720) {
              clearInterval(interval);
              return 720;
            }
            return prev + 5;
          });
        }, 50);
        return () => clearInterval(interval);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInView]);
  
  const getScoreColor = (s) => {
    if (s >= 700) return 'text-green-500';
    if (s >= 600) return 'text-yellow-500';
    return 'text-orange-500';
  };
  
  return (
    <div ref={ref} className="bg-card border border-border rounded-2xl p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-2">Your Credit Score</p>
        <motion.p 
          className={`text-6xl font-bold ${getScoreColor(score)}`}
          key={score}
        >
          {score}
        </motion.p>
        <p className="text-sm text-muted-foreground mt-2">
          {score >= 700 ? 'Excellent' : score >= 600 ? 'Good' : 'Building'}
        </p>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500"
          initial={{ width: '0%' }}
          animate={isInView ? { width: `${((score - 300) / 550) * 100}%` } : { width: '0%' }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>300</span>
        <span>850</span>
      </div>
    </div>
  );
};

const LendingFlowAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      setStep(0);
      const timers = [
        setTimeout(() => setStep(1), 800),
        setTimeout(() => setStep(2), 1600),
        setTimeout(() => setStep(3), 2400),
        setTimeout(() => setStep(4), 3200),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isInView]);
  
  const steps = [
    { icon: Wallet, label: 'Connect Wallet', status: step >= 1 },
    { icon: CreditCard, label: 'Check Credit Score', status: step >= 2 },
    { icon: Coins, label: 'Loan Approved', status: step >= 3 },
    { icon: CheckCircle, label: 'Repayment Complete', status: step >= 4 },
  ];
  
  return (
    <div ref={ref} className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={s.status ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.5 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col items-center ${s.status ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-colors ${s.status ? 'bg-primary/20' : 'bg-muted'}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">{s.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div 
                className="hidden md:block w-12 h-0.5 mx-2"
                initial={{ scaleX: 0 }}
                animate={s.status ? { scaleX: 1, backgroundColor: 'hsl(var(--primary))' } : { scaleX: 0 }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: 'hsl(var(--muted))' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const DePINAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  const [funded, setFunded] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      setFunded(0);
      const interval = setInterval(() => {
        setFunded(prev => {
          if (prev >= 15000) {
            clearInterval(interval);
            return 15000;
          }
          return prev + 500;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isInView]);
  
  return (
    <div ref={ref} className="bg-card border border-border rounded-2xl p-8 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
          <Zap className="h-8 w-8 text-yellow-500" />
        </div>
        <div>
          <h3 className="font-semibold">Solar Grid Initiative</h3>
          <p className="text-sm text-muted-foreground">Renewable Energy Infrastructure</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Funded</span>
            <span className="font-semibold">${funded.toLocaleString()} / $50,000</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-primary/70"
              initial={{ width: '0%' }}
              animate={isInView ? { width: `${(funded / 50000) * 100}%` } : { width: '0%' }}
              transition={{ duration: 2 }}
            />
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={funded >= 15000 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          className="flex items-center gap-2 text-sm text-green-500"
        >
          <Award className="h-4 w-4" />
          <span>Proof-of-Impact NFT #1234 Minted!</span>
        </motion.div>
      </div>
    </div>
  );
};

const ProductDemo = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="MoonCreditFi" className="w-8 h-8 rounded-md" />
            <span className="font-bold">MoonCreditFi</span>
          </Link>
          <Link to="/dashboard">
            <Button size="sm">
              Launch App <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>
      
      {/* Scene 1: The Problem */}
      <Scene className="bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedText>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm mb-8">
              <Lock className="h-4 w-4" />
              <span>The Current DeFi Landscape</span>
            </div>
          </AnimatedText>
          
          <AnimatedText delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Most DeFi lending requires
              <span className="text-destructive"> heavy collateral</span>
            </h1>
          </AnimatedText>
          
          <AnimatedText delay={0.4}>
            <p className="text-xl text-muted-foreground mb-8">
              Your credit reputation is completely ignored.
            </p>
          </AnimatedText>
          
          <AnimatedText delay={0.6}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <div className="bg-card/50 border border-destructive/20 rounded-xl p-6">
                <p className="text-3xl font-bold text-destructive mb-2">150%+</p>
                <p className="text-sm text-muted-foreground">Typical Collateral Required</p>
              </div>
              <div className="bg-card/50 border border-destructive/20 rounded-xl p-6">
                <p className="text-3xl font-bold text-destructive mb-2">$0</p>
                <p className="text-sm text-muted-foreground">Value of Your Credit History</p>
              </div>
              <div className="bg-card/50 border border-destructive/20 rounded-xl p-6">
                <p className="text-3xl font-bold text-destructive mb-2">0</p>
                <p className="text-sm text-muted-foreground">Real-World Asset Backing</p>
              </div>
            </div>
          </AnimatedText>
          
          <motion.div 
            className="mt-16"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="h-8 w-8 mx-auto text-muted-foreground" />
          </motion.div>
        </div>
      </Scene>
      
      {/* Scene 2: Introduction */}
      <Scene className="bg-gradient-to-b from-muted/30 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedText>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-8">
              <Play className="h-4 w-4" />
              <span>Introducing</span>
            </div>
          </AnimatedText>
          
          <AnimatedText delay={0.2}>
            <img 
              src="/logo.png" 
              alt="MoonCreditFi" 
              className="w-24 h-24 rounded-2xl mx-auto mb-6 shadow-lg shadow-primary/20"
            />
          </AnimatedText>
          
          <AnimatedText delay={0.3}>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              MoonCreditFi
            </h2>
          </AnimatedText>
          
          <AnimatedText delay={0.5}>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Credit-aware DeFi & DePIN for the Creditcoin ecosystem
            </p>
          </AnimatedText>
          
          <AnimatedText delay={0.7}>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <span className="px-4 py-2 rounded-full bg-card border border-border text-sm">On-Chain Credit</span>
              <span className="px-4 py-2 rounded-full bg-card border border-border text-sm">Reputation Lending</span>
              <span className="px-4 py-2 rounded-full bg-card border border-border text-sm">Real-World Impact</span>
            </div>
          </AnimatedText>
        </div>
      </Scene>
      
      {/* Scene 3: Credit Profile */}
      <Scene className="bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <AnimatedText>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6">
                <User className="h-4 w-4" />
                <span>Feature Highlight</span>
              </div>
            </AnimatedText>
            
            <AnimatedText delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                On-Chain Credit Profiles
              </h2>
            </AnimatedText>
            
            <AnimatedText delay={0.3}>
              <p className="text-xl text-muted-foreground">
                Reputation built through behavior, not just collateral
              </p>
            </AnimatedText>
          </div>
          
          <CreditScoreAnimation />
          
          <AnimatedText delay={0.5} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="text-center p-4">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Score increases with repayments</p>
              </div>
              <div className="text-center p-4">
                <FileCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Full loan history on-chain</p>
              </div>
              <div className="text-center p-4">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Portable across protocols</p>
              </div>
            </div>
          </AnimatedText>
        </div>
      </Scene>
      
      {/* Scene 4: Reputation-Based Lending */}
      <Scene className="bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <AnimatedText>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm mb-6">
                <Coins className="h-4 w-4" />
                <span>Core Protocol</span>
              </div>
            </AnimatedText>
            
            <AnimatedText delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Reputation-Based Lending
              </h2>
            </AnimatedText>
            
            <AnimatedText delay={0.3}>
              <p className="text-xl text-muted-foreground">
                Borrow based on reputation, not just collateral
              </p>
            </AnimatedText>
          </div>
          
          <LendingFlowAnimation />
          
          <AnimatedText delay={0.5} className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-card/50 border border-border rounded-xl p-6">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  For Lenders
                </h4>
                <p className="text-sm text-muted-foreground">Deposit CTC to earn competitive yields from a diversified borrower pool</p>
              </div>
              <div className="bg-card/50 border border-border rounded-xl p-6">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  For Borrowers
                </h4>
                <p className="text-sm text-muted-foreground">Access loans with lower collateral requirements based on your credit score</p>
              </div>
            </div>
          </AnimatedText>
        </div>
      </Scene>
      
      {/* Scene 5: DePIN Funding */}
      <Scene className="bg-gradient-to-b from-muted/30 to-primary/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <AnimatedText>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-500 text-sm mb-6">
                <Zap className="h-4 w-4" />
                <span>Real-World Impact</span>
              </div>
            </AnimatedText>
            
            <AnimatedText delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                DePIN Infrastructure Funding
              </h2>
            </AnimatedText>
            
            <AnimatedText delay={0.3}>
              <p className="text-xl text-muted-foreground">
                Fund real-world infrastructure. Transparent ownership and impact.
              </p>
            </AnimatedText>
          </div>
          
          <DePINAnimation />
          
          <AnimatedText delay={0.5} className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="text-center p-4">
                <Building2 className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="font-semibold">Solar & Energy</p>
                <p className="text-sm text-muted-foreground">Renewable infrastructure</p>
              </div>
              <div className="text-center p-4">
                <Globe className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="font-semibold">IoT Networks</p>
                <p className="text-sm text-muted-foreground">Connected devices</p>
              </div>
              <div className="text-center p-4">
                <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="font-semibold">NFT Ownership</p>
                <p className="text-sm text-muted-foreground">Proof-of-Impact tokens</p>
              </div>
            </div>
          </AnimatedText>
        </div>
      </Scene>
      
      {/* Scene 6: Trust & Architecture */}
      <Scene className="bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedText>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Built on Trust
            </h2>
          </AnimatedText>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={Lock} 
              title="On-Chain Contracts" 
              description="Fully deployed and verifiable smart contracts"
              delay={0.1}
            />
            <FeatureCard 
              icon={Shield} 
              title="Creditcoin Native" 
              description="Built specifically for the Creditcoin ecosystem"
              delay={0.2}
            />
            <FeatureCard 
              icon={Eye} 
              title="Transparent" 
              description="All credit history publicly auditable"
              delay={0.3}
            />
            <FeatureCard 
              icon={FileCheck} 
              title="Credit-First" 
              description="Reputation as the foundation of finance"
              delay={0.4}
            />
          </div>
          
          <AnimatedText delay={0.6} className="mt-12">
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 text-sm font-medium">
                <CheckCircle className="h-4 w-4 inline mr-2" />
                Smart Contracts Deployed
              </div>
              <div className="px-6 py-3 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                <CheckCircle className="h-4 w-4 inline mr-2" />
                Testnet Live
              </div>
            </div>
          </AnimatedText>
        </div>
      </Scene>
      
      {/* Scene 7: Closing */}
      <Scene className="bg-gradient-to-b from-background to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedText>
            <motion.img 
              src="/logo.png" 
              alt="MoonCreditFi" 
              className="w-32 h-32 rounded-3xl mx-auto mb-8 shadow-2xl shadow-primary/30"
              animate={{ 
                boxShadow: [
                  '0 25px 50px -12px rgba(var(--primary), 0.2)',
                  '0 25px 50px -12px rgba(var(--primary), 0.4)',
                  '0 25px 50px -12px rgba(var(--primary), 0.2)',
                ]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          </AnimatedText>
          
          <AnimatedText delay={0.2}>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              MoonCreditFi
            </h2>
          </AnimatedText>
          
          <AnimatedText delay={0.4}>
            <p className="text-2xl md:text-3xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Turning credit into real financial infrastructure
            </p>
          </AnimatedText>
          
          <AnimatedText delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6">
                  Launch App
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/whitepaper">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Read Whitepaper
                </Button>
              </Link>
            </div>
          </AnimatedText>
          
          <AnimatedText delay={0.8} className="mt-16">
            <p className="text-sm text-muted-foreground">
              Built for Creditcoin • CEIP Application Ready • 2026
            </p>
          </AnimatedText>
        </div>
      </Scene>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 MoonCreditFi. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/whitepaper" className="text-sm text-muted-foreground hover:text-primary transition-colors">Whitepaper</Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Missing import fix
const User = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default ProductDemo;
