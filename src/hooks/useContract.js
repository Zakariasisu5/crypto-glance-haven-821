import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';

// Deployed on Creditcoin Testnet
export const LENDING_POOL_ADDRESS = '0x6AFa3a9BDc76e7e2a88104cf24420e7Bc9F07728';
export const CREDIT_PROFILE_ADDRESS = '0x32228b52A411528F521412B4cEb1F0D21e84bDed';

// Complete ABIs for the smart contracts (JSON format)
export const LENDING_POOL_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getLoanCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getMaxBorrowLimit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getScore",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "interestRate",
				"type": "uint256"
			}
		],
		"name": "recordLoan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "loanIndex",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "onTime",
				"type": "bool"
			}
		],
		"name": "recordRepayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

export const CREDIT_PROFILE_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newScore",
				"type": "uint256"
			}
		],
		"name": "CreditScoreUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "interestRate",
				"type": "uint256"
			}
		],
		"name": "LoanRecorded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "loanIndex",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "onTime",
				"type": "bool"
			}
		],
		"name": "RepaymentRecorded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "calculateCreditScore",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "loanIndex",
				"type": "uint256"
			}
		],
		"name": "getLoan",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "interestRate",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "repaid",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "onTime",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getLoanCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getLoanHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "interestRate",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "repaid",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "onTime",
						"type": "bool"
					}
				],
				"internalType": "struct CreditProfile.Loan[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getMaxBorrowLimit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getProfile",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "creditScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalLoans",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "repaidLoans",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "latePayments",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalBorrowed",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalRepaid",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getScore",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "initializeProfile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "loanHistory",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "interestRate",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "repaid",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "onTime",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "profiles",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "creditScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalLoans",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "repaidLoans",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "latePayments",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalBorrowed",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalRepaid",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "interestRate",
				"type": "uint256"
			}
		],
		"name": "recordLoan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "loanIndex",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "onTime",
				"type": "bool"
			}
		],
		"name": "recordRepayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

// Hook to use write contract
export const useContract = () => {
  const { writeContractAsync } = useWriteContract();

  return {
    writeContractAsync,
    LENDING_POOL_ADDRESS,
    CREDIT_PROFILE_ADDRESS,
    LENDING_POOL_ABI,
    CREDIT_PROFILE_ABI,
  };
};
