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
import { parseEther } from 'viem';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { Zap, Sun, Wifi, Car, DollarSign, TrendingUp, Users, Loader2 } from 'lucide-react';

const DePINFinance = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fundingAmounts, setFundingAmounts] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const { isConnected } = useWalletContext();
  const { sendTransaction, data: txHash } = useSendTransaction();
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

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (isTxSuccess && selectedProject) {
      updateProjectFunding(selectedProject);
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

  const updateProjectFunding = async (projectId) => {
    const amount = parseFloat(fundingAmounts[projectId] || 0);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;

    try {
      const newFunding = parseFloat(project.funding_current) + amount;
      const { error } = await supabase
        .from('depin_projects')
        .update({ funding_current: newFunding })
        .eq('id', projectId);
      
      if (error) throw error;
      
      toast.success(`Successfully funded ${project.name}!`);
      fetchProjects();
      setFundingAmounts({ ...fundingAmounts, [projectId]: '' });
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating funding:', error);
      toast.error('Failed to update project funding');
    }
  };

  const handleFund = async (project) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    const amount = fundingAmounts[project.id];
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setSelectedProject(project.id);
      // Send ETH transaction (you can replace this with your contract address)
      sendTransaction({
        to: '0x0000000000000000000000000000000000000000', // Replace with project wallet
        value: parseEther(amount.toString()),
      });
      toast.info('Transaction submitted, waiting for confirmation...');
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Transaction failed');
      setSelectedProject(null);
    }
  };

  const totalFinanced = projects.reduce((sum, p) => sum + parseFloat(p.funding_current || 0), 0);
  const chartData = projects.map(p => ({
    name: p.category,
    value: parseFloat(p.funding_current || 0)
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mooncreditfi-glow">DePIN Finance</h1>
        <div className="text-sm text-muted-foreground">
          Financing the decentralized physical infrastructure
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
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
              title="Average ROI"
              value={`${projects.length > 0 ? (projects.reduce((sum, p) => sum + parseFloat(p.roi || 0), 0) / projects.length).toFixed(1) : 0}%`}
              description="Annual return"
              icon={TrendingUp}
              trend={1.3}
            />
            <StatsCard
              title="Success Rate"
              value="94.2%"
              description="Project completion"
              icon={Zap}
            />
          </div>

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
                {projects.map((project) => {
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
                <Card key={project.id} className="card-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon className={`h-5 w-5 ${iconColors[project.category] || 'text-primary'}`} />
                      <span>{project.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Funding Progress</span>
                        <span className="text-sm font-medium">
                          ${(parseFloat(project.funding_current) / 1000000).toFixed(2)}M / ${(parseFloat(project.funding_goal) / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <Progress value={project.funding_progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-semibold capitalize">{project.status}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ROI</p>
                        <p className="font-semibold text-green-500">{project.roi}%</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Input
                        type="number"
                        placeholder="Amount (ETH)"
                        step="0.01"
                        min="0"
                        value={fundingAmounts[project.id] || ''}
                        onChange={(e) => setFundingAmounts({ ...fundingAmounts, [project.id]: e.target.value })}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleFund(project)}
                        disabled={!isConnected || isTxPending || selectedProject === project.id}
                        className="btn-mooncreditfi"
                      >
                        {selectedProject === project.id && isTxPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Funding...
                          </>
                        ) : (
                          'Fund'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default DePINFinance;