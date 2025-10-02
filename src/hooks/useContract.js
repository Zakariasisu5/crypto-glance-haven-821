import { useState, useEffect } from 'react';
import { useWalletClient } from 'wagmi';
import { getContract } from 'viem';

// Mock contract addresses - replace with your deployed contracts
const LENDING_POOL_ADDRESS = '0x0000000000000000000000000000000000000000';
const CREDIT_PROFILE_ADDRESS = '0x0000000000000000000000000000000000000000';

// Simplified ABIs - replace with your actual contract ABIs
const LENDING_POOL_ABI = [
  'function deposit() external payable',
  'function withdraw(uint256 amount) external',
  'function borrow(uint256 amount) external',
  'function repay() external payable',
  'function getLenderBalance(address lender) external view returns (uint256)',
  'function getBorrowerLoan(address borrower) external view returns (uint256, uint256, bool)',
  'function getYieldEarned(address lender) external view returns (uint256)',
];

const CREDIT_PROFILE_ABI = [
  'function getScore(address user) external view returns (uint256)',
  'function getLoanHistory(address user) external view returns (tuple(uint256 amount, uint256 timestamp, bool repaid)[])',
];

export const useContract = () => {
  const { data: walletClient } = useWalletClient();
  const [lendingPool, setLendingPool] = useState(null);
  const [creditProfile, setCreditProfile] = useState(null);

  useEffect(() => {
    if (walletClient) {
      const lending = getContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        client: walletClient,
      });
      
      const credit = getContract({
        address: CREDIT_PROFILE_ADDRESS,
        abi: CREDIT_PROFILE_ABI,
        client: walletClient,
      });
      
      setLendingPool(lending);
      setCreditProfile(credit);
    } else {
      setLendingPool(null);
      setCreditProfile(null);
    }
  }, [walletClient]);

  return {
    lendingPool,
    creditProfile,
  };
};
