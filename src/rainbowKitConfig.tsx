"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { storyAeneid, story, base, celo } from "wagmi/chains";

export default getDefaultConfig({
  appName: "Cross-Credit Lending",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [storyAeneid, story, base, celo],
  ssr: false,
});