import { useState, useEffect } from 'react';
import { Contract } from 'ethers';

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

export const useContract = (signer) => {
  const [lendingPool, setLendingPool] = useState(null);
  const [creditProfile, setCreditProfile] = useState(null);

  useEffect(() => {
    if (signer) {
      const lending = new Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, signer);
      const credit = new Contract(CREDIT_PROFILE_ADDRESS, CREDIT_PROFILE_ABI, signer);
      
      setLendingPool(lending);
      setCreditProfile(credit);
    } else {
      setLendingPool(null);
      setCreditProfile(null);
    }
  }, [signer]);

  return {
    lendingPool,
    creditProfile,
  };
};
