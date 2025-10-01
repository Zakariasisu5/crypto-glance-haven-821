import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle, LogOut } from 'lucide-react';
import { useWalletContext } from '@/contexts/WalletContext';

const WalletConnectButton = () => {
  const { account, balance, isConnecting, connectWallet, disconnectWallet, isConnected } = useWalletContext();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end px-3 py-1.5 bg-muted rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span className="font-mono text-xs">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{balance} ETH</span>
        </div>
        <Button variant="ghost" size="sm" onClick={disconnectWallet}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connectWallet} disabled={isConnecting} className="btn-moonfi">
      <Wallet className="h-4 w-4 mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};

export default WalletConnectButton;
