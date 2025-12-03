import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
   mainnet,
   sepolia,
   polygon,
   optimism,
   arbitrum,
   base,
} from 'wagmi/chains';

export const config = getDefaultConfig({
   appName: 'Lyric App',
   projectId: '0a49481f0448eef2c62fbb54fef14878', // Get from https://cloud.walletconnect.com
   chains: [mainnet, sepolia, polygon, optimism, arbitrum, base],
   ssr: false,
});
