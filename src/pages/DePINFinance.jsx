import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import StatsCard from '@/components/StatsCard';
import { supabase } from '@/integrations/supabase/client';
import { useWalletContext } from '@/contexts/WalletContext';
import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';
import { parseEther, formatEther } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { Zap, Sun, Wifi, Car, DollarSign, TrendingUp, Users, Loader2, Shield, Target, Award, ExternalLink } from 'lucide-react';
import { DEPIN_FINANCE_ADDRESS, DEPIN_FINANCE_ABI } from '@/hooks/useContract';

const DePINFinance = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [fundingAmount, setFundingAmount] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [contributions, setContributions] = useState([]);
  const { isConnected } = useWalletContext();
  const { address } = useAccount();
  const { addNotification } = useNotifications();
  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isTxPending, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const categoryIcons = {
    'Solar': Sun,
    'WiFi': Wifi,
    'Mobility': Car,
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

  useEffect(() => {
    fetchProjects();
    if (address) {
      fetchUserContributions();
    }
  }, [address]);

  useEffect(() => {
    if (isTxSuccess && selectedProject) {
      handleSuccessfulFunding();
    }
  }, [isTxSuccess]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('depin_projects')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
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
      
      if (error) throw error;
      setContributions(data || []);
    } catch (error) {
      console.error('Error fetching contributions:', error);
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
    if (!fundingAmount || parseFloat(fundingAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const project = projects.find(p => p.id === selectedProject);
    if (!project) return;

    try {
      toast.info('Submitting transaction...');
      
      // Call smart contract to fund project
      writeContract({
        address: DEPIN_FINANCE_ADDRESS,
        abi: DEPIN_FINANCE_ABI,
        functionName: 'fundProject',
        args: [BigInt(selectedProject.replace(/-/g, '').slice(0, 16))], // Convert UUID to uint256
        value: parseEther(fundingAmount.toString()),
      });
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Transaction failed');
    }
  };

  const totalFinanced = projects.reduce((sum, p) => sum + parseFloat(p.funding_current || 0), 0);
  const chartData = projects.map(p => ({
    name: p.category,
    value: parseFloat(p.funding_current || 0)
  }));

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
              title="Total Financed"
              value={`$${(totalFinanced / 1000000).toFixed(1)}M`}
              description="Across all projects"
              icon={DollarSign}
              trend={15.2}
            />
            <StatsCard
              title="Active Projects"
              value={projects.length}
              description="Currently funded"
              icon={Users}
              trend={8.7}
            />
            <StatsCard
              title="Your Contributions"
              value={`${totalContributed.toFixed(2)} CTC`}
              description={`${contributions.length} projects funded`}
              icon={Award}
            />
            <StatsCard
              title="Avg. Ownership"
              value={`${contributions.length > 0 ? (totalOwnership / contributions.length).toFixed(2) : 0}%`}
              description="Per project funded"
              icon={TrendingUp}
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
            <h2 className="text-2xl font-bold mb-4">Available Projects</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => {
                const Icon = categoryIcons[project.category] || Zap;
                const iconColors = {
                  'Solar': 'text-yellow-500',
                  'WiFi': 'text-blue-500',
                  'Mobility': 'text-purple-500',
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
                              disabled={!fundingAmount || parseFloat(fundingAmount) <= 0 || isTxPending}
                              className="w-full btn-mooncreditfi"
                            >
                              {isTxPending ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
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
          </div>
        </>
      )}
    </div>
  );
};

export default DePINFinance;