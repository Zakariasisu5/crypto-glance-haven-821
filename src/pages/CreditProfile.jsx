import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatsCard from '@/components/StatsCard';
// Using on-chain data; mock data removed
import { User, CreditCard, TrendingUp, DollarSign } from 'lucide-react';
import { useWalletContext } from '@/contexts/WalletContext';
import { useContract } from '@/hooks/useContract';
import { formatEther } from 'viem';
import { useBlockNumber } from 'wagmi';

const CreditProfile = () => {
  const { account, isConnected } = useWalletContext();
  const { creditProfile: creditContract } = useContract();
  const [creditProfile, setCreditProfile] = useState({ creditScore: 0, borrowingHistory: [], availableCredit: 0, utilizedCredit: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const creditScoreHistory = [];

  useEffect(() => {
    if (account && creditContract) {
      loadCreditProfile();
    }
  }, [account, creditContract]);

  // Refresh profile on each new block
  const { data: blockNumber } = useBlockNumber({ watch: true });
  useEffect(() => {
    if (blockNumber && account && creditContract) {
      loadCreditProfile();
    }
  }, [blockNumber]);

  const loadCreditProfile = async () => {
    try {
      setIsLoading(true);
      if (!creditContract || !account) return;

      // Get profile data
      const profile = await creditContract.read.getProfile([account]);
      const history = await creditContract.read.getLoanHistory([account]);

      const formattedHistory = history.map((loan) => ({
        date: new Date(Number(loan[1]) * 1000).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit' }),
        amount: parseFloat(formatEther(loan[0])),
        status: loan[3] ? 'repaid' : 'active',
        rate: Number(loan[2]) / 100,
      }));

      setCreditProfile({
        creditScore: Number(profile[0]) || 500,
        borrowingHistory: formattedHistory,
        availableCredit: parseFloat(formatEther(profile[5])),
        utilizedCredit: parseFloat(formatEther(profile[4]) - formatEther(profile[5])),
      });
    } catch (error) {
      console.error('Error loading credit profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'repaid': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mooncreditfi-glow">Credit Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Credit Score"
          value={creditProfile.creditScore}
          description="Excellent rating"
          icon={TrendingUp}
          trend={2.8}
          className="border-primary/20"
        />
        <StatsCard
          title="Available Credit"
          value={`$${creditProfile.availableCredit.toLocaleString()}`}
          description="Ready to borrow"
          icon={DollarSign}
        />
        <StatsCard
          title="Utilized Credit"
          value={`$${creditProfile.utilizedCredit.toLocaleString()}`}
          description="Currently borrowed"
          icon={CreditCard}
        />
        <StatsCard
          title="Utilization Rate"
          value={`${((creditProfile.utilizedCredit / (creditProfile.availableCredit + creditProfile.utilizedCredit)) * 100).toFixed(1)}%`}
          description="Credit utilization"
          icon={User}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Credit Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={creditScoreHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Credit Utilization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: ${creditProfile.utilizedCredit.toLocaleString()}</span>
                <span>Available: ${creditProfile.availableCredit.toLocaleString()}</span>
              </div>
              <Progress 
                value={(creditProfile.utilizedCredit / (creditProfile.availableCredit + creditProfile.utilizedCredit)) * 100} 
                className="h-3"
              />
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Credit Health Tips</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Keep utilization below 30% for optimal score</li>
                <li>• Pay loans on time to improve rating</li>
                <li>• Diversify borrowing across different assets</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle>Borrowing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creditProfile.borrowingHistory.map((loan, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(loan.status)}>
                    {loan.status}
                  </Badge>
                  <div>
                    <p className="font-medium">${loan.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{loan.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{loan.rate}% APR</p>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditProfile;