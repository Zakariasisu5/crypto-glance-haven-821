import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import StatsCard from '@/components/StatsCard';
import { mockMoonFIData, mockChartData } from '@/data/mockData';
import { TrendingUp, DollarSign, Users, Droplets, Activity, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DeFiInsights = () => {
  const { defiInsights } = mockMoonFIData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold moonfi-glow">DeFi Insights</h1>
        <div className="text-sm text-muted-foreground">
          MoonFI lending & borrowing ecosystem
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Total Value Locked (TVL)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={mockChartData.tvlHistory}>
                    <defs>
                      <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'TVL']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tvl" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fill="url(#tvlGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Lending & Borrowing Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={mockChartData.rateHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`${value}%`, '']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="lending" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      name="Lending APY"
                      dot={{ fill: 'hsl(var(--chart-1))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="borrowing" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name="Borrowing APR"
                      dot={{ fill: 'hsl(var(--chart-2))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mockChartData.tvlHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="lenders" 
                      fill="hsl(var(--chart-3))" 
                      name="Lenders"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="borrowers" 
                      fill="hsl(var(--chart-4))" 
                      name="Borrowers"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Volume & Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={mockChartData.volumeHistory}>
                    <defs>
                      <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value, name) => [
                        name === 'volume' ? `$${(value / 1000).toFixed(0)}K` : value,
                        name === 'volume' ? 'Volume' : 'Loans'
                      ]}
                    />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="volume" 
                      stroke="hsl(var(--chart-5))" 
                      strokeWidth={2}
                      fill="url(#volumeGradient)"
                      name="Volume"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="loans" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Loans"
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeFiInsights;