import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatsCard from '@/components/StatsCard';
import WalletConnect from '@/components/WalletConnect';
import { mockMoonFIData, mockChartData } from '@/data/mockData';
import { User, CreditCard, TrendingUp, DollarSign } from 'lucide-react';

const CreditProfile = () => {
  const { creditProfile } = mockMoonFIData;
  const { creditScoreHistory } = mockChartData;

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold moonfi-glow">Credit Profile</h1>
        <WalletConnect />
      </div>

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