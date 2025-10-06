import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';

// Deployed on Creditcoin Testnet
export const LENDING_POOL_ADDRESS = '0x6AFa3a9BDc76e7e2a88104cf24420e7Bc9F07728';
export const CREDIT_PROFILE_ADDRESS = '0x32228b52A411528F521412B4cEb1F0D21e84bDed';
export const DEPIN_FINANCE_ADDRESS = '0x0000000000000000000000000000000000000000'; // Update after deployment

// Complete ABIs for the smart contracts (JSON format)
export const LENDING_POOL_ABI = [
  { type: 'function', name: 'deposit', stateMutability: 'payable', inputs: [], outputs: [] },
  { type: 'function', name: 'withdraw', stateMutability: 'nonpayable', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [] },
  { type: 'function', name: 'borrow', stateMutability: 'nonpayable', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [] },
  { type: 'function', name: 'repay', stateMutability: 'payable', inputs: [], outputs: [] },
  { type: 'function', name: 'claimYield', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'function', name: 'getLenderBalance', stateMutability: 'view', inputs: [{ name: 'lender', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'getBorrowerLoan', stateMutability: 'view', inputs: [{ name: 'borrower', type: 'address' }], outputs: [{ name: 'amount', type: 'uint256' }, { name: 'interestRate', type: 'uint256' }, { name: 'isActive', type: 'bool' }, { name: 'totalOwed', type: 'uint256' }] },
  { type: 'function', name: 'getYieldEarned', stateMutability: 'view', inputs: [{ name: 'lender', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'getAvailableLiquidity', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'getUtilizationRate', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'getPoolStats', stateMutability: 'view', inputs: [], outputs: [{ name: 'totalDeposited', type: 'uint256' }, { name: 'totalBorrowed', type: 'uint256' }, { name: 'availableLiquidity', type: 'uint256' }, { name: 'utilizationRate', type: 'uint256' }, { name: 'currentAPY', type: 'uint256' }] },
  { type: 'function', name: 'lenders', stateMutability: 'view', inputs: [{ name: '', type: 'address' }], outputs: [{ name: 'depositedAmount', type: 'uint256' }, { name: 'depositTimestamp', type: 'uint256' }, { name: 'lastYieldClaim', type: 'uint256' }] },
  { type: 'function', name: 'borrowers', stateMutability: 'view', inputs: [{ name: '', type: 'address' }], outputs: [{ name: 'borrowedAmount', type: 'uint256' }, { name: 'borrowTimestamp', type: 'uint256' }, { name: 'interestRate', type: 'uint256' }, { name: 'creditProfileLoanIndex', type: 'uint256' }, { name: 'isActive', type: 'bool' }] },
  // Events emitted by the lending pool so frontends can listen for real-time updates
  { type: 'event', name: 'Deposit', inputs: [{ name: 'lender', type: 'address', indexed: true }, { name: 'amount', type: 'uint256', indexed: false }] },
  { type: 'event', name: 'Withdraw', inputs: [{ name: 'lender', type: 'address', indexed: true }, { name: 'amount', type: 'uint256', indexed: false }] },
  { type: 'event', name: 'Borrow', inputs: [{ name: 'borrower', type: 'address', indexed: true }, { name: 'amount', type: 'uint256', indexed: false }] },
  { type: 'event', name: 'Repay', inputs: [{ name: 'borrower', type: 'address', indexed: true }, { name: 'amount', type: 'uint256', indexed: false }] },
];

export const CREDIT_PROFILE_ABI = [
  { type: 'function', name: 'initializeProfile', stateMutability: 'nonpayable', inputs: [{ name: 'user', type: 'address' }], outputs: [] },
  { type: 'function', name: 'recordLoan', stateMutability: 'nonpayable', inputs: [{ name: 'user', type: 'address' }, { name: 'amount', type: 'uint256' }, { name: 'interestRate', type: 'uint256' }], outputs: [] },
  { type: 'function', name: 'recordRepayment', stateMutability: 'nonpayable', inputs: [{ name: 'user', type: 'address' }, { name: 'loanIndex', type: 'uint256' }, { name: 'onTime', type: 'bool' }], outputs: [] },
  { type: 'function', name: 'calculateCreditScore', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'getScore', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'getProfile', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: 'creditScore', type: 'uint256' }, { name: 'totalLoans', type: 'uint256' }, { name: 'repaidLoans', type: 'uint256' }, { name: 'latePayments', type: 'uint256' }, { name: 'totalBorrowed', type: 'uint256' }, { name: 'totalRepaid', type: 'uint256' }] },
  { type: 'function', name: 'getLoanHistory', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'tuple[]', components: [{ name: 'amount', type: 'uint256' }, { name: 'timestamp', type: 'uint256' }, { name: 'interestRate', type: 'uint256' }, { name: 'repaid', type: 'bool' }, { name: 'onTime', type: 'bool' }] }] },
  { type: 'function', name: 'getLoan', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }, { name: 'loanIndex', type: 'uint256' }], outputs: [{ name: 'amount', type: 'uint256' }, { name: 'timestamp', type: 'uint256' }, { name: 'interestRate', type: 'uint256' }, { name: 'repaid', type: 'bool' }, { name: 'onTime', type: 'bool' }] },
  { type: 'function', name: 'getMaxBorrowLimit', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'getLoanCount', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'uint256' }] },
];

// DePIN Finance Contract ABI
export const DEPIN_FINANCE_ABI = [
  { type: 'function', name: 'fundProject', stateMutability: 'payable', inputs: [{ name: 'projectId', type: 'uint256' }], outputs: [] },
  { type: 'function', name: 'getContribution', stateMutability: 'view', inputs: [{ name: 'contributor', type: 'address' }, { name: 'projectId', type: 'uint256' }], outputs: [{ name: 'amount', type: 'uint256' }, { name: 'ownershipPercentage', type: 'uint256' }, { name: 'nftTokenId', type: 'uint256' }] },
  { type: 'function', name: 'getUserContributions', stateMutability: 'view', inputs: [{ name: 'contributor', type: 'address' }], outputs: [{ type: 'uint256[]' }] },
  { type: 'function', name: 'getProjectFunding', stateMutability: 'view', inputs: [{ name: 'projectId', type: 'uint256' }], outputs: [{ name: 'totalFunded', type: 'uint256' }, { name: 'contributorsCount', type: 'uint256' }] },
  { type: 'function', name: 'mintProofOfImpactNFT', stateMutability: 'nonpayable', inputs: [{ name: 'contributor', type: 'address' }, { name: 'projectId', type: 'uint256' }], outputs: [{ name: 'tokenId', type: 'uint256' }] },
  { type: 'function', name: 'calculateOwnershipPercentage', stateMutability: 'view', inputs: [{ name: 'contribution', type: 'uint256' }, { name: 'projectId', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'distributeYield', stateMutability: 'nonpayable', inputs: [{ name: 'projectId', type: 'uint256' }], outputs: [] },
  { type: 'event', name: 'ProjectFunded', inputs: [{ name: 'projectId', type: 'uint256', indexed: true }, { name: 'contributor', type: 'address', indexed: true }, { name: 'amount', type: 'uint256', indexed: false }, { name: 'ownershipPercentage', type: 'uint256', indexed: false }] },
  { type: 'event', name: 'NFTMinted', inputs: [{ name: 'contributor', type: 'address', indexed: true }, { name: 'projectId', type: 'uint256', indexed: true }, { name: 'tokenId', type: 'uint256', indexed: false }] },
  { type: 'event', name: 'YieldDistributed', inputs: [{ name: 'projectId', type: 'uint256', indexed: true }, { name: 'totalYield', type: 'uint256', indexed: false }] },
];

// Hook to use write contract
export const useContract = () => {
  const { writeContractAsync } = useWriteContract();

  return {
    writeContractAsync,
    LENDING_POOL_ADDRESS,
    CREDIT_PROFILE_ADDRESS,
    DEPIN_FINANCE_ADDRESS,
    LENDING_POOL_ABI,
    CREDIT_PROFILE_ABI,
    DEPIN_FINANCE_ABI,
  };
};
