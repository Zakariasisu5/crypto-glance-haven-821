import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useWalletContext } from '@/contexts/WalletContext';
import { useContract } from '@/hooks/useContract';
import { toast } from 'sonner';
import { DollarSign, CreditCard, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBlockNumber } from 'wagmi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { parseEther, formatEther } from 'viem';

const Borrow = () => {
  const { account, isConnected } = useWalletContext();
  const { lendingPool, creditProfile } = useContract();
  const [borrowAmount, setBorrowAmount] = useState('');
  const [activeLoan, setActiveLoan] = useState(null);
  const [creditScore, setCreditScore] = useState(0);
  const [loanHistory, setLoanHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (account && lendingPool && creditProfile) {
      loadBorrowerData();
    }
  }, [account, lendingPool, creditProfile]);

  // Refresh on new block
  const { data: blockNumber } = useBlockNumber({ watch: true });
  useEffect(() => {
    if (blockNumber && account) loadBorrowerData();
  }, [blockNumber]);

  const loadBorrowerData = async () => {
    try {
      if (!lendingPool || !creditProfile || !account) return;

      // Get credit score
      const score = await creditProfile.read.getScore([account]);
      setCreditScore(Number(score));

      // Get active loan
      const loan = await lendingPool.read.getBorrowerLoan([account]);
      if (loan[2]) { // isActive
        setActiveLoan({
          amount: formatEther(loan[0]),
          totalOwed: formatEther(loan[3]),
          interestRate: (Number(loan[1]) / 100).toFixed(1),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        });
      } else {
        setActiveLoan(null);
      }

      // Get loan history
      const history = await creditProfile.read.getLoanHistory([account]);
      const formattedHistory = history.map((loan, index) => ({
        id: index,
        amount: formatEther(loan[0]),
        date: new Date(Number(loan[1]) * 1000).toLocaleDateString(),
        status: loan[3] ? 'Repaid' : 'Active',
        onTime: loan[4],
      }));
      setLoanHistory(formattedHistory);
    } catch (error) {
      console.error('Error loading borrower data:', error);
      setCreditScore(0);
      setActiveLoan(null);
      setLoanHistory([]);
    }
  };

  const handleBorrow = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!lendingPool) {
      toast.error('Contract not loaded');
      return;
    }

    setIsLoading(true);
    try {
      const amountInWei = parseEther(borrowAmount);

      // Call real contract borrow function
      const hash = await lendingPool.write.borrow([amountInWei]);

      toast.success('Transaction submitted! Waiting for confirmation...');

      toast.success(`Successfully borrowed ${borrowAmount} CTC`);
      setBorrowAmount('');

      // Reload data after a short delay
      setTimeout(() => loadBorrowerData(), 2000);
    } catch (error) {
      console.error('Borrow error:', error);
      if (error.message.includes('User rejected')) {
        toast.error('Transaction rejected');
      } else if (error.message.includes('Credit score too low')) {
        toast.error('Credit score too low to borrow');
      } else if (error.message.includes('Exceeds borrowing limit')) {
        toast.error('Amount exceeds your borrowing limit');
      } else {
        toast.error('Failed to borrow: ' + (error.shortMessage || error.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepay = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!activeLoan) {
      toast.error('No active loan to repay');
      return;
    }

    if (!lendingPool) {
      toast.error('Contract not loaded');
      return;
    }

    setIsLoading(true);
    try {
      const amountToRepay = parseEther(activeLoan.totalOwed);

      // Call real contract repay function
      const hash = await lendingPool.write.repay([], {
        value: amountToRepay
      });

      toast.success('Transaction submitted! Waiting for confirmation...');

      toast.success('Successfully repaid loan! Your credit score has been updated.');

      // Reload data after a short delay
      setTimeout(() => loadBorrowerData(), 2000);
    } catch (error) {
      console.error('Repay error:', error);
      if (error.message.includes('User rejected')) {
        toast.error('Transaction rejected');
      } else {
        toast.error('Failed to repay: ' + (error.shortMessage || error.message));
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
        <h1 className="text-3xl font-bold mb-2">Borrow & Build Credit</h1>
        <p className="text-muted-foreground">Access loans and improve your on-chain credit profile</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Borrow Form */}
        <motion.div variants={itemVariants}>
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Request Loan
              </CardTitle>
              <CardDescription>Borrow CTC based on your credit score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="borrow-amount">Amount (CTC)</Label>
                <Input
                  id="borrow-amount"
                  type="number"
                  placeholder="0.0"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Interest Rate</span>
                  <span className="font-medium">5.0% APR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Borrowable</span>
                  <span className="font-medium">3.5 CTC</span>
                </div>
              </div>
              <Button
                onClick={handleBorrow}
                disabled={isLoading || !isConnected || !!activeLoan}
                className="w-full btn-mooncreditfi"
              >
                {isLoading ? 'Processing...' : activeLoan ? 'Repay Current Loan First' : 'Borrow'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Loan Card */}
        <motion.div variants={itemVariants}>
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Active Loan
              </CardTitle>
              <CardDescription>Current loan status and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeLoan ? (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">Borrowed</span>
                      <span className="font-bold text-lg">{activeLoan.amount} CTC</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">Interest Rate</span>
                      <span className="font-bold text-lg text-blue-500">{activeLoan.interestRate}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">Total to Repay</span>
                      <span className="font-bold text-lg text-orange-500">
                        {parseFloat(activeLoan.totalOwed).toFixed(4)} CTC
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <span className="text-sm font-medium">Due Date</span>
                      <span className="font-bold">{activeLoan.dueDate}</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleRepay}
                    disabled={isLoading || !isConnected}
                    className="w-full btn-mooncreditfi"
                  >
                    {isLoading ? 'Processing...' : 'Repay Loan'}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-muted-foreground">No active loans</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Credit Profile Card */}
      <motion.div variants={itemVariants}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Credit Profile
            </CardTitle>
            <CardDescription>Your on-chain credit score and loan history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Credit Score</p>
                <p className="text-4xl font-bold text-primary">{creditScore}</p>
              </div>
              <div className="text-right">
                <Badge variant={creditScore >= 700 ? "default" : "secondary"} className="mb-2">
                  {creditScore >= 700 ? 'Excellent' : creditScore >= 600 ? 'Good' : 'Fair'}
                </Badge>
                <p className="text-xs text-muted-foreground">Based on {loanHistory.length} loans</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Loan History</h4>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount (CTC)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">On Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanHistory.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.date}</TableCell>
                        <TableCell>{loan.amount}</TableCell>
                        <TableCell>
                          <Badge variant={loan.status === 'Repaid' ? 'default' : 'secondary'}>
                            {loan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {loan.onTime ? (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Borrow;
