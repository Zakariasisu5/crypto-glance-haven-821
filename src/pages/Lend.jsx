import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useWalletContext } from '@/contexts/WalletContext';
import { useContract, LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from '@/hooks/useContract';
import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';
import { DollarSign, TrendingUp, Wallet, Coins, Gift, Loader2, ExternalLink, RefreshCw, PiggyBank, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseEther, formatEther } from 'viem';
import { useReadContract, useBlockNumber, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';

const Lend = () => {
  const { isConnected } = useWalletContext();
  const { address } = useAccount();
  const { addNotification } = useNotifications();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  // Auto-refresh on new blocks
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Read lender info from contract
  const { data: lenderInfo, refetch: refetchLenderInfo, isLoading: isLoadingLender } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'lenders',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read yield earned
  const { data: yieldData, refetch: refetchYield } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'calculateYieldEarned',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read pool stats
  const { data: poolStats, refetch: refetchPoolStats, isLoading: isLoadingPool } = useReadContract({
    address: LENDING_POOL_ADDRESS,
    abi: LENDING_POOL_ABI,
    functionName: 'getPoolStats',
    query: { enabled: true },
  });

  // Refetch on new blocks
  useEffect(() => {
    if (blockNumber) {
      refetchLenderInfo?.();
      refetchYield?.();
      refetchPoolStats?.();
    }
  }, [blockNumber, refetchLenderInfo, refetchYield, refetchPoolStats]);

  // Reset loading states on confirmation
  useEffect(() => {
    if (isConfirmed) {
      setIsDepositing(false);
      setIsWithdrawing(false);
      setIsClaiming(false);
      setDepositAmount('');
      setWithdrawAmount('');
      refetchLenderInfo?.();
      refetchYield?.();
      refetchPoolStats?.();
    }
  }, [isConfirmed, refetchLenderInfo, refetchYield, refetchPoolStats]);

  // Parse data
  const depositedBalance = lenderInfo ? formatEther(lenderInfo[0] ?? 0n) : '0';
  const depositTimestamp = lenderInfo ? Number(lenderInfo[1] ?? 0n) : 0;
  const yieldEarned = yieldData ? formatEther(yieldData) : '0';

  const pool = poolStats ? {
    totalDeposited: formatEther(poolStats[0] ?? 0n),
    totalBorrowed: formatEther(poolStats[1] ?? 0n),
    availableLiquidity: formatEther(poolStats[2] ?? 0n),
    utilizationRate: Number(poolStats[3] ?? 0n) / 100,
    currentAPY: Number(poolStats[4] ?? 0n) / 100,
  } : null;

  const handleDeposit = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) < 0.01) {
      toast.error('Minimum deposit is 0.01 CTC');
      return;
    }

    setIsDepositing(true);
    try {
      const hash = await writeContractAsync({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'deposit',
        value: parseEther(depositAmount),
      });

      toast.success('Transaction submitted!', {
        description: `Hash: ${hash.slice(0, 10)}...`,
        action: {
          label: 'View',
          onClick: () => window.open(`https://creditcoin-testnet.blockscout.com/tx/${hash}`, '_blank')
        }
      });
      addNotification(`Deposited ${depositAmount} CTC to lending pool`, 'success');
    } catch (error) {
      console.error('Deposit error:', error);
      setIsDepositing(false);
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction cancelled');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient CTC balance');
      } else {
        toast.error('Deposit failed: ' + (error.shortMessage || error.message));
      }
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    const amountToWithdraw = withdrawAmount || depositedBalance;
    if (parseFloat(amountToWithdraw) <= 0) {
      toast.error('No funds to withdraw');
      return;
    }

    if (parseFloat(amountToWithdraw) > parseFloat(depositedBalance)) {
      toast.error('Insufficient deposited balance');
      return;
    }

    setIsWithdrawing(true);
    try {
      const hash = await writeContractAsync({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'withdraw',
        args: [parseEther(amountToWithdraw)],
      });

      toast.success('Withdrawal submitted!', {
        description: `Hash: ${hash.slice(0, 10)}...`,
        action: {
          label: 'View',
          onClick: () => window.open(`https://creditcoin-testnet.blockscout.com/tx/${hash}`, '_blank')
        }
      });
      addNotification(`Withdrew ${amountToWithdraw} CTC from lending pool`, 'success');
    } catch (error) {
      console.error('Withdraw error:', error);
      setIsWithdrawing(false);
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction cancelled');
      } else {
        toast.error('Withdrawal failed: ' + (error.shortMessage || error.message));
      }
    }
  };

  const handleClaimYield = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (parseFloat(yieldEarned) <= 0) {
      toast.error('No yield to claim');
      return;
    }

    setIsClaiming(true);
    try {
      const hash = await writeContractAsync({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'claimYield',
      });

      toast.success('Claiming yield...', {
        description: `Hash: ${hash.slice(0, 10)}...`,
        action: {
          label: 'View',
          onClick: () => window.open(`https://creditcoin-testnet.blockscout.com/tx/${hash}`, '_blank')
        }
      });
      addNotification(`Claimed ${yieldEarned} CTC yield`, 'success');
    } catch (error) {
      console.error('Claim error:', error);
      setIsClaiming(false);
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction cancelled');
      } else {
        toast.error('Claim failed: ' + (error.shortMessage || error.message));
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mooncreditfi-glow">Lend & Earn</h1>
          <p className="text-muted-foreground">Deposit CTC to earn competitive yields</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {pool ? `${pool.currentAPY.toFixed(1)}% APY` : 'Loading...'}
        </Badge>
      </div>

      {/* Pool Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-glow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Deposited</span>
            </div>
            {isLoadingPool ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold">{parseFloat(pool?.totalDeposited ?? 0).toFixed(2)} CTC</p>
            )}
          </CardContent>
        </Card>
        <Card className="card-glow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Total Borrowed</span>
            </div>
            {isLoadingPool ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold">{parseFloat(pool?.totalBorrowed ?? 0).toFixed(2)} CTC</p>
            )}
          </CardContent>
        </Card>
        <Card className="card-glow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Available Liquidity</span>
            </div>
            {isLoadingPool ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold">{parseFloat(pool?.availableLiquidity ?? 0).toFixed(2)} CTC</p>
            )}
          </CardContent>
        </Card>
        <Card className="card-glow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Utilization</span>
            </div>
            {isLoadingPool ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-2xl font-bold">{(pool?.utilizationRate ?? 0).toFixed(1)}%</p>
                <Progress value={pool?.utilizationRate ?? 0} className="mt-2 h-1" />
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Deposit Form */}
        <motion.div variants={itemVariants}>
          <Card className="card-glow h-full">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Deposit Funds
              </CardTitle>
              <CardDescription>Start earning yield on your CTC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount (CTC)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  className="text-lg h-12"
                />
              </div>
              {depositAmount && parseFloat(depositAmount) > 0 && pool && (
                <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected APY</span>
                    <span className="font-medium text-green-500">{pool.currentAPY.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Monthly Yield</span>
                    <span className="font-medium">
                      {((parseFloat(depositAmount) * pool.currentAPY / 100) / 12).toFixed(4)} CTC
                    </span>
                  </div>
                </div>
              )}
              <Button
                onClick={handleDeposit}
                disabled={isDepositing || isPending || isConfirming || !isConnected}
                className="w-full btn-mooncreditfi h-12"
              >
                {(isDepositing || isPending || isConfirming) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isConfirming ? 'Confirming...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Deposit
                  </>
                )}
              </Button>
              {txHash && (
                <a 
                  href={`https://creditcoin-testnet.blockscout.com/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  View transaction <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Balance & Yield Card */}
        <motion.div variants={itemVariants}>
          <Card className="card-glow h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Your Position
              </CardTitle>
              <CardDescription>Current deposited amount and earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingLender ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                      <div>
                        <span className="text-sm text-muted-foreground">Deposited</span>
                        {depositTimestamp > 0 && (
                          <p className="text-xs text-muted-foreground">Since {formatDate(depositTimestamp)}</p>
                        )}
                      </div>
                      <span className="font-bold text-xl">{parseFloat(depositedBalance).toFixed(4)} CTC</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div>
                        <span className="text-sm text-muted-foreground">Yield Earned</span>
                        <p className="text-xs text-green-500">Claimable now</p>
                      </div>
                      <span className="font-bold text-xl text-green-500">+{parseFloat(yieldEarned).toFixed(6)} CTC</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <span className="text-sm font-medium">Total Value</span>
                      <span className="font-bold text-2xl">
                        {(parseFloat(depositedBalance) + parseFloat(yieldEarned)).toFixed(4)} CTC
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleClaimYield}
                      disabled={isClaiming || isPending || isConfirming || !isConnected || parseFloat(yieldEarned) <= 0}
                      variant="outline"
                      className="h-12"
                    >
                      {(isClaiming && !isWithdrawing) ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Gift className="h-4 w-4 mr-2" />
                      )}
                      Claim Yield
                    </Button>
                    <Button
                      onClick={handleWithdraw}
                      disabled={isWithdrawing || isPending || isConfirming || !isConnected || parseFloat(depositedBalance) <= 0}
                      variant="secondary"
                      className="h-12"
                    >
                      {(isWithdrawing && !isClaiming) ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Withdraw All
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* How It Works */}
      <motion.div variants={itemVariants}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              How Lending Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Deposit CTC</h3>
                <p className="text-sm text-muted-foreground">
                  Add your CTC to the lending pool to start earning yield immediately
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Earn Yield</h3>
                <p className="text-sm text-muted-foreground">
                  Your funds earn interest from borrowers, accruing yield in real-time
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Withdraw Anytime</h3>
                <p className="text-sm text-muted-foreground">
                  Claim your yield or withdraw your funds whenever you want
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Lend;