import { createContext, useContext } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { formatEther } from 'viem';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const { address, isConnected, isConnecting } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
  });
  const { disconnect } = useDisconnect();

  const balance = balanceData 
    ? parseFloat(formatEther(balanceData.value)).toFixed(4)
    : '0';

  const wallet = {
    account: address,
    balance,
    isConnected,
    isConnecting,
    disconnectWallet: disconnect,
  };
  
  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within WalletProvider');
  }
  return context;
};
