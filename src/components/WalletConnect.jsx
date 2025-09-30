import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle } from 'lucide-react';

const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const handleConnect = () => {
    // Simulate wallet connection
    const mockAddress = '0x742d35Cc6635C0532925a3b8D6Ac6a00000000';
    setAddress(mockAddress);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setAddress('');
    setIsConnected(false);
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} className="btn-moonfi">
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;