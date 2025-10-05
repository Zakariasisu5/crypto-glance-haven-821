import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import StatsCard from '@/components/StatsCard';
import { supabase } from '@/integrations/supabase/client';
import { useWalletContext } from '@/contexts/WalletContext';
import { toast } from 'sonner';
import { Zap, Sun, Wifi, Car, DollarSign, TrendingUp, Users, Loader2 } from 'lucide-react';
import { parseEther } from 'viem';
import { useSendTransaction } from 'wagmi';

const DePINFinance = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fundingAmounts, setFundingAmounts] = useState({});
  const { isConnected, account } = useWalletContext();
  const { sendTransaction, isPending } = useSendTransaction();

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const categoryIcons = {
    'Solar': Sun,
    'WiFi': Wifi,
    'Mobility': Car,
    'Other': Zap
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('depin_projects')
        .select('*')
        .eq('status', 'active');
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleFundProject = async (projectId) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    const amount = fundingAmounts[projectId];
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      // Send transaction
      sendTransaction({
        to: account, // In production, this would be the project's contract address
        value: parseEther(amount)
      }, {
        onSuccess: async (hash) => {
          toast.success(`Transaction submitted! Hash: ${hash.slice(0, 10)}...`);
          
          // Update funding in database
          const project = projects.find(p => p.id === projectId);
          const newFunding = parseFloat(project.funding_current) + parseFloat(amount);
          
          const { error } = await supabase
            .from('depin_projects')
            .update({ funding_current: newFunding })
            .eq('id', projectId);
          
          if (error) throw error;
          
          // Refresh projects
          await fetchProjects();
          setFundingAmounts(prev => ({ ...prev, [projectId]: '' }));
        },
        onError: (error) => {
          toast.error(`Transaction failed: ${error.message}`);
        }
      });
    } catch (error) {
      console.error('Funding error:', error);
      toast.error('Failed to fund project');
    }
  };

  const calculateStats = () => {
    const totalFinanced = projects.reduce((sum, p) => sum + parseFloat(p.funding_current), 0);
    const averageROI = projects.reduce((sum, p) => sum + parseFloat(p.roi || 0), 0) / (projects.length || 1);
    return {
      totalFinanced,
      activeProjects: projects.length,
      averageROI: averageROI.toFixed(1)
    };
  };

  const stats = calculateStats();

  const chartData = projects.reduce((acc, project) => {
    const existing = acc.find(item => item.name === project.category);
    if (existing) {
      existing.value += parseFloat(project.funding_current);
    } else {
      acc.push({ name: project.category, value: parseFloat(project.funding_current) });
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mooncreditfi-glow">DePIN Finance</h1>
        <div className="text-sm text-muted-foreground">
          Blockchain-powered infrastructure financing
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Financed"
          value={`$${(stats.totalFinanced / 1000000).toFixed(1)}M`}
          description="Across all projects"
          icon={DollarSign}
          trend={15.2}
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          description="Currently funded"
          icon={Users}
          trend={8.7}
        />
        <StatsCard
          title="Average ROI"
          value={`${stats.averageROI}%`}
          description="Annual return"
          icon={TrendingUp}
          trend={1.3}
        />
        <StatsCard
          title="Wallet Status"
          value={isConnected ? 'Connected' : 'Not Connected'}
          description={isConnected ? account?.slice(0, 6) + '...' : 'Connect to fund'}
          icon={Zap}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Financing Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Live Project Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.slice(0, 3).map((project) => {
              const Icon = categoryIcons[project.category] || Zap;
              const progress = Math.round((parseFloat(project.funding_current) / parseFloat(project.funding_goal)) * 100);
              return (
                <div key={project.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{progress}% funded</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(parseFloat(project.funding_current) / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-muted-foreground">ROI: {project.roi}%</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Fund Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const Icon = categoryIcons[project.category] || Zap;
            const progress = Math.round((parseFloat(project.funding_current) / parseFloat(project.funding_goal)) * 100);
            
            return (
              <Card key={project.id} className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{project.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Funding Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${(parseFloat(project.funding_current) / 1000000).toFixed(2)}M</span>
                      <span>${(parseFloat(project.funding_goal) / 1000000).toFixed(2)}M</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-semibold">{project.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expected ROI</p>
                      <p className="font-semibold text-green-500">{project.roi}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Amount (ETH)"
                      value={fundingAmounts[project.id] || ''}
                      onChange={(e) => setFundingAmounts(prev => ({ ...prev, [project.id]: e.target.value }))}
                      disabled={!isConnected || isPending}
                    />
                    <Button 
                      onClick={() => handleFundProject(project.id)}
                      className="w-full btn-mooncreditfi"
                      disabled={!isConnected || isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Fund Project'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DePINFinance;