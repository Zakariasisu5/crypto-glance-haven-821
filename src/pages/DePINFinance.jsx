import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import StatsCard from '@/components/StatsCard';
import { supabase } from '@/integrations/supabase/client';
import { useWalletContext } from '@/contexts/WalletContext';
import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';
import { parseEther, formatEther } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract, useBlockNumber } from 'wagmi';
import { Zap, Sun, Wifi, Car, DollarSign, TrendingUp, Users, Loader2, Shield, Target, Award, ExternalLink, Search, Filter, X } from 'lucide-react';
import { DEPIN_FINANCE_ADDRESS, DEPIN_FINANCE_ABI } from '@/hooks/useContract';

const DePINFinance = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [fundingAmount, setFundingAmount] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [minROI, setMinROI] = useState(0);
  const [minProgress, setMinProgress] = useState(0);
  const [isFunding, setIsFunding] = useState(false);
  const { isConnected } = useWalletContext();
  const { address } = useAccount();
  const { addNotification } = useNotifications();
  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isTxPending, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Fetch real pool stats from contract
  const { data: poolStats, refetch: refetchPoolStats } = useReadContract({
    address: DEPIN_FINANCE_ADDRESS,
    abi: DEPIN_FINANCE_ABI,
    functionName: 'getPoolStats',
    query: { enabled: true }
  });

  // Auto-refresh on new blocks
  useEffect(() => {
    if (blockNumber) {
      refetchPoolStats();
    }
  }, [blockNumber, refetchPoolStats]);

  // Parse pool stats
  const realPoolStats = poolStats ? {
    totalContributions: formatEther(poolStats[1] ?? 0n),
    totalYieldsDistributed: formatEther(poolStats[2] ?? 0n),
  } : null;

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const categoryIcons = {
    'Solar': Sun,
    'WiFi': Wifi,
    'Mobility': Car,
    'IoT': Zap,
    'Energy Storage': Zap,
    'Telecom': Wifi,
    'Other': Zap
  };

  const benefits = [
    {
      icon: Shield,
      title: 'Real Ownership',
      description: 'Direct ownership shares recorded on blockchain'
    },
    {
      icon: Target,
      title: 'Transparent Impact',
      description: 'Track project performance and funding in real-time'
    },
    {
      icon: DollarSign,
      title: 'Profit Sharing',
      description: 'Earn yield based on actual project revenue'
    },
    {
      icon: Award,
      title: 'Proof-of-Impact NFT',
      description: 'Receive NFT certification for every contribution'
    }
  ];

  // Mock projects data for when database is not available
  const mockProjects = [
    {
      id: '1',
      name: 'Solar Grid Network',
      category: 'Solar',
      description: 'Decentralized solar energy grid powering rural communities with blockchain-tracked energy credits.',
      funding_goal: 5000000,
      funding_current: 3250000,
      funding_progress: 65,
      roi: 12.5,
      status: 'active',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Community WiFi Mesh',
      category: 'WiFi',
      description: 'Peer-to-peer WiFi network providing affordable internet access to underserved areas.',
      funding_goal: 2000000,
      funding_current: 1400000,
      funding_progress: 70,
      roi: 8.2,
      status: 'active',
      image: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'EV Charging Stations',
      category: 'Mobility',
      description: 'Network of electric vehicle charging stations with tokenized rewards for usage.',
      funding_goal: 8000000,
      funding_current: 4800000,
      funding_progress: 60,
      roi: 15.0,
      status: 'active',
      image: '/placeholder.svg'
    },
    {
      id: '4',
      name: 'Smart Energy Storage',
      category: 'Energy Storage',
      description: 'Distributed battery storage network for renewable energy optimization and grid stability.',
      funding_goal: 3500000,
      funding_current: 2100000,
      funding_progress: 60,
      roi: 10.8,
      status: 'active',
      image: '/placeholder.svg'
    },
    {
      id: '5',
      name: 'IoT Sensor Network',
      category: 'IoT',
      description: 'Decentralized environmental monitoring sensors for air quality, weather, and pollution tracking.',
      funding_goal: 1500000,
      funding_current: 975000,
      funding_progress: 65,
      roi: 9.5,
      status: 'active',
      image: '/placeholder.svg'
    },
    {
      id: '6',
      name: 'Smart Agriculture Sensors',
      category: 'IoT',
      description: 'IoT-enabled soil and crop monitoring system for precision farming with data marketplace.',
      funding_goal: 2200000,
      funding_current: 1540000,
      funding_progress: 70,
      roi: 11.2,
      status: 'active',
      image: '/placeholder.svg'
    },
    {
      id: '7',
      name: '5G Telecom Towers',
      category: 'Telecom',
      description: 'Community-owned 5G infrastructure with revenue sharing from network usage fees.',
      funding_goal: 12000000,
      funding_current: 7200000,
      funding_progress: 60,
      roi: 18.5,
      status: 'active',
      image: '/placeholder.svg'
    },
    {
      id: '8',
      name: 'Rural Connectivity Hub',
      category: 'Telecom',
      description: 'Satellite-linked communication hubs bringing internet to remote villages.',
      funding_goal: 4000000,
      funding_current: 2800000,
      funding_progress: 70,
      roi: 13.0,
      status: 'active',
      image: '/placeholder.svg'
    },
    {
      id: '9',
      name: 'Grid Battery Network',
      category: 'Energy Storage',
      description: 'Large-scale lithium-ion battery facilities for peak demand management and energy arbitrage.',
      funding_goal: 15000000,
      funding_current: 10500000,
      funding_progress: 70,
      roi: 16.5,
      status: 'active',
      image: '/placeholder.svg'
    },
    {
      id: '10',
      name: 'Smart City Sensors',
      category: 'IoT',
      description: 'Traffic, parking, and utility monitoring sensors for urban efficiency optimization.',
      funding_goal: 3000000,
      funding_current: 1800000,
      funding_progress: 60,
      roi: 10.0,
      status: 'active',
      image: '/placeholder.svg'
    }
  ];

  useEffect(() => {
    // Load mock data immediately for instant display
    setProjects(mockProjects);
    setLoading(false);
    
    // Then try to fetch from database in background
    fetchProjects();
    if (address) {
      fetchUserContributions();
    }
  }, [address]);

  useEffect(() => {
    if (isTxSuccess && selectedProject) {
      setIsFunding(false);
      handleSuccessfulFunding();
    }
  }, [isTxSuccess]);

  const fetchProjects = async () => {
    try {
      // Use AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const { data, error } = await supabase
        .from('depin_projects')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal);
      
      clearTimeout(timeoutId);
      
      if (error) throw error;
      if (data && data.length > 0) {
        setProjects(data);
      }
    } catch (error) {
      // Silently fail - mock data already loaded
      console.log('Using mock data for DePIN projects');
    }
  };

  const fetchUserContributions = async () => {
    if (!address) return;
    
    try {
      const { data, error } = await supabase
        .from('user_contributions')
        .select(`
          *,
          depin_projects (
            name,
            category,
            image
          )
        `)
        .eq('user_address', address.toLowerCase())
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching contributions:', error);
        setContributions([]);
        return;
      }
      setContributions(data || []);
    } catch (error) {
      console.error('Error fetching contributions:', error);
      setContributions([]);
    }
  };

  const handleSuccessfulFunding = async () => {
    const amount = parseFloat(fundingAmount);
    const project = projects.find(p => p.id === selectedProject);
    
    if (!project || !address) return;

    try {
      // Update project funding
      const newFunding = parseFloat(project.funding_current) + amount;
      const { error: projectError } = await supabase
        .from('depin_projects')
        .update({ funding_current: newFunding })
        .eq('id', selectedProject);
      
      if (projectError) throw projectError;

      // Calculate ownership percentage
      const ownershipPercentage = (amount / (newFunding || 1)) * 100;

      // Record contribution
      const { data: contributionData, error: contributionError } = await supabase
        .from('user_contributions')
        .insert({
          user_address: address.toLowerCase(),
          project_id: selectedProject,
          amount: amount,
          ownership_percentage: ownershipPercentage.toFixed(4),
          transaction_hash: txHash,
          nft_token_id: `NFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })
        .select()
        .single();
      
      if (contributionError) throw contributionError;
      
      toast.success(
        <div className="space-y-2">
          <p className="font-semibold">Successfully funded {project.name}!</p>
          <p className="text-sm">🎉 Proof-of-Impact NFT minted!</p>
          <p className="text-xs">NFT ID: {contributionData.nft_token_id}</p>
        </div>,
        { duration: 5000 }
      );
      
      addNotification(
        `Funded ${project.name} with ${amount} CTC - NFT minted: ${contributionData.nft_token_id}`,
        'success'
      );
      
      fetchProjects();
      fetchUserContributions();
      setFundingAmount('');
      setSelectedProject(null);
      setModalOpen(false);
    } catch (error) {
      console.error('Error recording contribution:', error);
      toast.error('Failed to record contribution');
    }
  };

  const handleFundClick = (project) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setSelectedProject(project.id);
    setModalOpen(true);
  };

  const handleConfirmFunding = async () => {
    if (!fundingAmount || parseFloat(fundingAmount) < 0.01) {
      toast.error('Minimum contribution is 0.01 CTC');
      return;
    }

    const project = projects.find(p => p.id === selectedProject);
    if (!project) return;

    setIsFunding(true);
    try {
      toast.info('Submitting transaction to DePIN contract...');
      
      // Call smart contract contribute function (matches DEPIN.sol)
      const hash = await writeContractAsync({
        address: DEPIN_FINANCE_ADDRESS,
        abi: DEPIN_FINANCE_ABI,
        functionName: 'contribute',
        value: parseEther(fundingAmount.toString()),
      });
      
      toast.success('Transaction submitted!', {
        description: `Hash: ${hash.slice(0, 10)}...`,
        action: {
          label: 'View',
          onClick: () => window.open(`https://creditcoin-testnet.blockscout.com/tx/${hash}`, '_blank')
        }
      });
    } catch (error) {
      console.error('Transaction error:', error);
      setIsFunding(false);
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction cancelled by user');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient CTC balance');
      } else {
        toast.error('Transaction failed: ' + (error.shortMessage || error.message));
      }
    }
  };

  const totalFinanced = projects.reduce((sum, p) => sum + parseFloat(p.funding_current || 0), 0);
  const chartData = projects.map(p => ({
    name: p.category,
    value: parseFloat(p.funding_current || 0)
  }));

  // Get unique categories
  const categories = [...new Set(projects.map(p => p.category))];

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const matchesROI = project.roi >= minROI;
    const matchesProgress = project.funding_progress >= minProgress;
    
    return matchesSearch && matchesCategory && matchesROI && matchesProgress;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setMinROI(0);
    setMinProgress(0);
  };

  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || minROI > 0 || minProgress > 0;

  const totalContributed = contributions.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
  const totalOwnership = contributions.reduce((sum, c) => sum + parseFloat(c.ownership_percentage || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mooncreditfi-glow">DePIN Finance</h1>
        <Badge variant="outline" className="text-sm">
          Decentralized Physical Infrastructure
        </Badge>
      </div>

      {/* Why Fund DePIN Section */}
      <Card className="card-glow border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Why Fund DePIN Projects?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="p-3 rounded-full bg-primary/10 mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="TVL (On-Chain)"
              value={realPoolStats ? `${parseFloat(realPoolStats.totalContributions).toFixed(2)} CTC` : `$${(totalFinanced / 1000000).toFixed(1)}M`}
              description="Total value locked"
              icon={DollarSign}
              trend={15.2}
            />
            <StatsCard
              title="Yields Distributed"
              value={realPoolStats ? `${parseFloat(realPoolStats.totalYieldsDistributed).toFixed(4)} CTC` : '0 CTC'}
              description="Total rewards paid"
              icon={TrendingUp}
              trend={8.7}
            />
            <StatsCard
              title="Your Contributions"
              value={`${totalContributed.toFixed(2)} CTC`}
              description={`${contributions.length} projects funded`}
              icon={Award}
            />
            <StatsCard
              title="Active Projects"
              value={projects.length}
              description="Currently funded"
              icon={Users}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Financing Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'Value']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Project Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.slice(0, 4).map((project) => {
                  const Icon = categoryIcons[project.category] || Zap;
                  return (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{project.category}</p>
                          <p className="text-sm text-muted-foreground">{project.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(parseFloat(project.funding_current) / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-muted-foreground">{project.funding_progress}%</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* My Contributions Section */}
          {isConnected && contributions.length > 0 && (
            <Card className="card-glow border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  My Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contributions.map((contribution) => (
                    <div key={contribution.id} className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{contribution.depin_projects?.name}</h4>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {contribution.depin_projects?.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-semibold">{parseFloat(contribution.amount).toFixed(4)} CTC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ownership:</span>
                          <span className="font-semibold text-primary">{parseFloat(contribution.ownership_percentage).toFixed(2)}%</span>
                        </div>
                        {contribution.nft_token_id && (
                          <div className="flex justify-between items-center pt-2 border-t border-border">
                            <span className="text-muted-foreground">NFT Proof:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => toast.info(`NFT ID: ${contribution.nft_token_id}`)}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Projects */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">Available Projects</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredProjects.length} of {projects.length} projects
                </span>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Category Filter */}
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* ROI Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Min ROI</span>
                      <span className="font-medium">{minROI}%+</span>
                    </div>
                    <Slider
                      value={[minROI]}
                      onValueChange={(value) => setMinROI(value[0])}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Progress Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Min Progress</span>
                      <span className="font-medium">{minProgress}%+</span>
                    </div>
                    <Slider
                      value={[minProgress]}
                      onValueChange={(value) => setMinProgress(value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {filteredProjects.length === 0 ? (
              <Card className="card-glow">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => {
                const Icon = categoryIcons[project.category] || Zap;
                const iconColors = {
                  'Solar': 'text-yellow-500',
                  'WiFi': 'text-blue-500',
                  'Mobility': 'text-purple-500',
                  'IoT': 'text-green-500',
                  'Energy Storage': 'text-orange-500',
                  'Telecom': 'text-cyan-500',
                  'Other': 'text-primary'
                };
                
                return (
                  <Card key={project.id} className="card-glow hover:border-primary/50 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className={`h-5 w-5 ${iconColors[project.category] || 'text-primary'}`} />
                          <CardTitle>{project.name}</CardTitle>
                        </div>
                        <Badge variant="outline">{project.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Funding Progress</span>
                          <span className="font-medium">
                            ${(parseFloat(project.funding_current) / 1000000).toFixed(2)}M / ${(parseFloat(project.funding_goal) / 1000000).toFixed(2)}M
                          </span>
                        </div>
                        <Progress value={project.funding_progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{project.funding_progress}% funded</span>
                          <span>{project.roi}% ROI</span>
                        </div>
                      </div>

                      <Dialog open={modalOpen && selectedProject === project.id} onOpenChange={(open) => {
                        setModalOpen(open);
                        if (!open) {
                          setSelectedProject(null);
                          setFundingAmount('');
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => handleFundClick(project)}
                            disabled={!isConnected}
                            className="w-full btn-mooncreditfi"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Fund Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Fund {project.name}</DialogTitle>
                            <DialogDescription>
                              Enter the amount you'd like to contribute. You'll receive a Proof-of-Impact NFT upon successful funding.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Funding Amount (CTC)</label>
                              <Input
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={fundingAmount}
                                onChange={(e) => setFundingAmount(e.target.value)}
                              />
                            </div>
                            
                            {fundingAmount && parseFloat(fundingAmount) > 0 && (
                              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Estimated Ownership:</span>
                                  <span className="font-semibold text-primary">
                                    {((parseFloat(fundingAmount) / (parseFloat(project.funding_current) + parseFloat(fundingAmount))) * 100).toFixed(4)}%
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Expected ROI:</span>
                                  <span className="font-semibold text-green-500">{project.roi}%</span>
                                </div>
                              </div>
                            )}

                            <Button
                              onClick={handleConfirmFunding}
                              disabled={!fundingAmount || parseFloat(fundingAmount) <= 0 || isFunding || isPending || isTxPending}
                              className="w-full btn-mooncreditfi"
                            >
                              {(isFunding || isPending || isTxPending) ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  {isTxPending ? 'Confirming...' : 'Processing...'}
                                </>
                              ) : (
                                <>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Confirm Funding
                                </>
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DePINFinance;