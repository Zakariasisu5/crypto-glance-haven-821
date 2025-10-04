import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, optimism, arbitrum, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'MoonCreditFi',
  projectId: 'f8c7b74f5ffedea9c3e1b9a4d7f0e8a2', // Default WalletConnect Project ID - Replace with your own from https://cloud.walletconnect.com
  chains: [mainnet, sepolia, polygon, optimism, arbitrum, base],
  ssr: false,
});
