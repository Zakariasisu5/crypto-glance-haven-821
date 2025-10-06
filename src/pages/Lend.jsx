import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useWalletContext } from '@/contexts/WalletContext';
import { useContract, LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from '@/hooks/useContract';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseEther, formatEther } from 'viem';
import { useReadContract, useBlockNumber } from 'wagmi';

const Lend = () => {
  const { account, isConnected } = useWalletContext();
  const { writeContractAsync } = useContract();
  const [depositAmount, setDepositAmount] = useState('');
  const [depositedBalance, setDepositedBalance] = useState('0');
  const [yieldEarned, setYieldEarned] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  // Read lender balance
  const { data: lenderBalance, refetch: refetchBalance } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'getLenderBalance',
    args: account ? [account] : undefined,
    query: { enabled: !!account },
  });

  // Read yield earned
  const { data: yieldData, refetch: refetchYield } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'getYieldEarned',
    args: account ? [account] : undefined,
    query: { enabled: !!account },
  });

  // Read lender info
  const { data: lenderInfo, refetch: refetchLenderInfo } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'lenders',
    args: account ? [account] : undefined,
    query: { enabled: !!account },
  });

  // Refetch on new blocks for near-real-time updates
  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    if (blockNumber) {
      // lightweight refetch on new block
      refetchBalance && refetchBalance();
      refetchYield && refetchYield();
      refetchLenderInfo && refetchLenderInfo();
    }
  }, [blockNumber]);

  useEffect(() => {
    if (lenderInfo && lenderInfo[0]) {
      setDepositedBalance(formatEther(lenderInfo[0]));
    } else {
      setDepositedBalance('0');
    }
  }, [lenderInfo]);

  useEffect(() => {
    if (yieldData) {
      setYieldEarned(formatEther(yieldData));
    } else {
      setYieldEarned('0');
    }
  }, [yieldData]);

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
      const amountInWei = parseEther(depositAmount);

      // Call real contract deposit function
      const hash = await writeContractAsync({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'deposit',
        value: amountInWei,
      });

      toast.success('Transaction submitted! Waiting for confirmation...');
      toast.success(`Successfully deposited ${depositAmount} CTC`);
      setDepositAmount('');

      // Reload data
      setTimeout(() => {
        refetchBalance();
        refetchYield();
        refetchLenderInfo();
      }, 2000);
    } catch (error) {
      console.error('Deposit error:', error);
      if (error.message && error.message.includes('User rejected')) {
        toast.error('Transaction rejected');
      } else {
        toast.error('Failed to deposit: ' + (error.shortMessage || error.message || 'Unknown error'));
      }
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
      const amountInWei = parseEther(depositedBalance);

      // Call real contract withdraw function
      const hash = await writeContractAsync({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'withdraw',
        args: [amountInWei],
      });

      toast.success('Transaction submitted! Waiting for confirmation...');
      toast.success('Successfully withdrew funds');

      // Reload data
      setTimeout(() => {
        refetchBalance();
        refetchYield();
        refetchLenderInfo();
      }, 2000);
    } catch (error) {
      console.error('Withdraw error:', error);
      if (error.message && error.message.includes('User rejected')) {
        toast.error('Transaction rejected');
      } else {
        toast.error('Failed to withdraw: ' + (error.shortMessage || error.message));
      }
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
        <p className="text-muted-foreground">Deposit CTC to earn competitive yields</p>
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
              <CardDescription>Start earning yield on your CTC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount (CTC)</Label>
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
                className="w-full btn-mooncreditfi"
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
                  <span className="font-bold text-lg">{depositedBalance} CTC</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Yield Earned</span>
                  <span className="font-bold text-lg text-green-500">+{yieldEarned} CTC</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="text-sm font-medium">Total</span>
                  <span className="font-bold text-xl">
                    {(parseFloat(depositedBalance) + parseFloat(yieldEarned)).toFixed(4)} CTC
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
                <p className="text-2xl font-bold">12,450 CTC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Lend;
