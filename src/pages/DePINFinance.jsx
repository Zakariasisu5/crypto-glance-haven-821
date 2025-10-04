import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import StatsCard from '@/components/StatsCard';
import { mockMoonCreditFiData, mockChartData } from '@/data/mockData';
import { Zap, Sun, Wifi, Car, DollarSign, TrendingUp, Users } from 'lucide-react';

const DePINFinance = () => {
  const { depinFinance } = mockMoonCreditFiData;
  const { depinGrowth } = mockChartData;

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const categoryIcons = {
    'Solar': Sun,
    'WiFi': Wifi,
    'Mobility': Car,
    'Other': Zap
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mooncreditfi-glow">DePIN Finance</h1>
        <div className="text-sm text-muted-foreground">
          Financing the decentralized physical infrastructure
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Financed"
          value={`$${(depinFinance.totalFinanced / 1000000).toFixed(1)}M`}
          description="Across all projects"
          icon={DollarSign}
          trend={15.2}
        />
        <StatsCard
          title="Active Projects"
          value={depinFinance.activeProjects}
          description="Currently funded"
          icon={Users}
          trend={8.7}
        />
        <StatsCard
          title="Average ROI"
          value={`${depinFinance.averageROI}%`}
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={depinGrowth}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {depinGrowth.map((entry, index) => (
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
            <CardTitle>Project Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(depinFinance).filter(([key]) => key.includes('Credits')).map(([key, value]) => {
              const category = key.replace('Credits', '');
              const Icon = categoryIcons[category] || Zap;
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{category}</p>
                      <p className="text-sm text-muted-foreground">{value.funded} projects</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(value.totalValue / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              <span>Solar Energy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Capacity Funded</span>
                <span className="text-sm font-medium">2.4 GW</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Projects</p>
                <p className="font-semibold">{depinFinance.solarCredits.funded}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ROI</p>
                <p className="font-semibold text-green-500">9.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5 text-blue-500" />
              <span>WiFi Networks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Coverage Area</span>
                <span className="text-sm font-medium">45,000 km²</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Projects</p>
                <p className="font-semibold">{depinFinance.wifiCredits.funded}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ROI</p>
                <p className="font-semibold text-green-500">7.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-purple-500" />
              <span>Mobility</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Vehicles Funded</span>
                <span className="text-sm font-medium">1,247</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Projects</p>
                <p className="font-semibold">{depinFinance.mobilityCredits.funded}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ROI</p>
                <p className="font-semibold text-green-500">8.9%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DePINFinance;