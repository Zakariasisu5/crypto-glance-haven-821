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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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

  const loadBorrowerData = async () => {
    try {
      // Mock data for demo - replace with actual contract calls
      setActiveLoan({
        amount: '2.5',
        repaid: '1.2',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        interestRate: '5.0'
      });
      setCreditScore(720);
      setLoanHistory([
        { id: 1, amount: '1.0', date: '2025-01-15', status: 'Repaid', onTime: true },
        { id: 2, amount: '1.5', date: '2025-02-01', status: 'Repaid', onTime: true },
        { id: 3, amount: '2.5', date: '2025-03-10', status: 'Active', onTime: true },
      ]);
    } catch (error) {
      console.error('Error loading borrower data:', error);
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

    setIsLoading(true);
    try {
      // Mock transaction - replace with actual contract call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Successfully borrowed ${borrowAmount} ETH`);
      setBorrowAmount('');
      loadBorrowerData();
    } catch (error) {
      toast.error('Failed to borrow: ' + error.message);
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

    setIsLoading(true);
    try {
      // Mock transaction - replace with actual contract call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Successfully repaid loan');
      loadBorrowerData();
    } catch (error) {
      toast.error('Failed to repay: ' + error.message);
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
              <CardDescription>Borrow ETH based on your credit score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="borrow-amount">Amount (ETH)</Label>
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
                  <span className="font-medium">3.5 ETH</span>
                </div>
              </div>
              <Button
                onClick={handleBorrow}
                disabled={isLoading || !isConnected || !!activeLoan}
                className="w-full btn-moonfi"
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
                      <span className="font-bold text-lg">{activeLoan.amount} ETH</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">Repaid</span>
                      <span className="font-bold text-lg text-green-500">{activeLoan.repaid} ETH</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <span className="font-bold text-lg text-orange-500">
                        {(parseFloat(activeLoan.amount) - parseFloat(activeLoan.repaid)).toFixed(2)} ETH
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
                    className="w-full btn-moonfi"
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
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">On Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanHistory.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.date}</TableCell>
                        <TableCell>{loan.amount} ETH</TableCell>
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
