import { AlchemyAccountsUIConfig, createConfig } from '@account-kit/react';
import { sepolia, alchemy } from '@account-kit/infra';

const uiConfig: AlchemyAccountsUIConfig = {
   illustrationStyle: 'outline',
   auth: {
      sections: [
         [{ type: 'email' }],
         [
            { type: 'passkey' },
            { type: 'social', authProviderId: 'google', mode: 'popup' },
            { type: 'social', authProviderId: 'facebook', mode: 'popup' },
         ],
      ],
      addPasskeyOnSignup: false,
   },
};

export const config = createConfig(
   {
      transport: alchemy({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY }),
      chain: sepolia,
      ssr: false, // Set to false for Vite
      policyId: import.meta.env.VITE_ALCHEMY_GAS_POLICY_ID,
   },
   uiConfig
);
