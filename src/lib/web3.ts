import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClient,
} from "@tanstack/react-query";

export const config = getDefaultConfig({
  appName: 'AIVEST PREMIUM',
  projectId: 'f0f7b7fd839a31e37cb375949b38ec9d', //f0f7b7fd839a31e37cb375949b38ec9d Replace with your real WalletConnect Project ID from cloud.walletconnect.com
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If using Next.js, but good to keep true for Vite too
});

export const queryClient = new QueryClient();

export { RainbowKitProvider, WagmiProvider, darkTheme };
