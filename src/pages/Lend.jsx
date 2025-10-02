import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useWalletContext } from '@/contexts/WalletContext';
import { useContract } from '@/hooks/useContract';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const Lend = () => {
  const { account, isConnected } = useWalletContext();
  const { lendingPool } = useContract();
  const [depositAmount, setDepositAmount] = useState('');
  const [depositedBalance, setDepositedBalance] = useState('0');
  const [yieldEarned, setYieldEarned] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lendingPool && account) {
      loadLenderData();
    }
  }, [lendingPool, account]);

  const loadLenderData = async () => {
    try {
      // Mock data for demo - replace with actual contract calls
      setDepositedBalance('5.0');
      setYieldEarned('0.15');
    } catch (error) {
      console.error('Error loading lender data:', error);
    }
  };

  const handleDeposit = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      // Mock transaction - replace with actual contract call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Successfully deposited ${depositAmount} ETH`);
      setDepositAmount('');
      loadLenderData();
    } catch (error) {
      toast.error('Failed to deposit: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (parseFloat(depositedBalance) <= 0) {
      toast.error('No funds to withdraw');
      return;
    }

    setIsLoading(true);
    try {
      // Mock transaction - replace with actual contract call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Successfully withdrew funds');
      loadLenderData();
    } catch (error) {
      toast.error('Failed to withdraw: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-6xl mx-auto"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">Lend & Earn</h1>
        <p className="text-muted-foreground">Deposit ETH to earn competitive yields</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Deposit Form */}
        <motion.div variants={itemVariants}>
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Deposit Funds
              </CardTitle>
              <CardDescription>Start earning yield on your ETH</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount (ETH)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <Button
                onClick={handleDeposit}
                disabled={isLoading || !isConnected}
                className="w-full btn-moonfi"
              >
                {isLoading ? 'Processing...' : 'Deposit'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Balance Card */}
        <motion.div variants={itemVariants}>
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Your Balance
              </CardTitle>
              <CardDescription>Current deposited amount and earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Deposited</span>
                  <span className="font-bold text-lg">{depositedBalance} ETH</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Yield Earned</span>
                  <span className="font-bold text-lg text-green-500">+{yieldEarned} ETH</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="text-sm font-medium">Total</span>
                  <span className="font-bold text-xl">
                    {(parseFloat(depositedBalance) + parseFloat(yieldEarned)).toFixed(4)} ETH
                  </span>
                </div>
              </div>
              <Button
                onClick={handleWithdraw}
                disabled={isLoading || !isConnected}
                variant="outline"
                className="w-full"
              >
                {isLoading ? 'Processing...' : 'Withdraw All'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* APY Info Card */}
      <motion.div variants={itemVariants}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Current APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-primary">8.5%</p>
                <p className="text-sm text-muted-foreground mt-1">Annual Percentage Yield</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Value Locked</p>
                <p className="text-2xl font-bold">12,450 ETH</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Lend;
