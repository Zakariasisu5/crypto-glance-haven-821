import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import StatsCard from '@/components/StatsCard';
import { mockCreditcoinData } from '@/data/mockData';
import { TrendingUp, DollarSign, Users, Droplets } from 'lucide-react';

const DeFiInsights = () => {
  const { defiInsights } = mockCreditcoinData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold creditcoin-glow">DeFi Insights</h1>
        <div className="text-sm text-muted-foreground">
          Creditcoin lending & borrowing ecosystem
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Lending Rate"
          value={`${defiInsights.lendingRate}%`}
          description="Annual Percentage Yield"
          icon={TrendingUp}
          trend={0.3}
        />
        <StatsCard
          title="Borrowing Rate"
          value={`${defiInsights.borrowingRate}%`}
          description="Annual Percentage Rate"
          icon={DollarSign}
          trend={-0.2}
        />
        <StatsCard
          title="Active Loans"
          value={defiInsights.activeLoans.toLocaleString()}
          description="Total active positions"
          icon={Users}
        />
        <StatsCard
          title="TVL"
          value={`$${(defiInsights.totalValueLocked / 1000000).toFixed(1)}M`}
          description="Total Value Locked"
          icon={Droplets}
          trend={12.5}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity Pools</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Lending Pool Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Liquidity Utilization</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Available Liquidity</span>
                    <span>${(defiInsights.liquidityPool / 1000000).toFixed(1)}M</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle>24h Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Volume</p>
                    <p className="text-2xl font-bold">
                      ${(defiInsights.dailyVolume / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">New Loans</p>
                  <p className="text-lg font-semibold text-primary">23</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="liquidity" className="space-y-4">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Liquidity Pool Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Pool Size</p>
                    <p className="text-xl font-bold">${(defiInsights.liquidityPool / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">APY</p>
                    <p className="text-xl font-bold text-green-500">{defiInsights.lendingRate}%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Providers</p>
                    <p className="text-xl font-bold">1,847</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Market Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Advanced analytics charts coming soon...</p>
                <p className="text-sm mt-2">Real-time market data and lending trends</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeFiInsights;