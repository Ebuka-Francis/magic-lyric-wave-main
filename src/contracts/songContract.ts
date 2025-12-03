// src/contracts/songContract.ts
export const SONG_CONTRACT_ABI = [
   {
      inputs: [
         {
            internalType: 'address',
            name: 'ipId',
            type: 'address',
         },
         {
            internalType: 'address',
            name: 'licenseTemplate',
            type: 'address',
         },
         {
            internalType: 'uint256',
            name: 'licenseTermsId',
            type: 'uint256',
         },
      ],
      name: 'attachLicenseTerms',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
] as const;

// Replace with your actual contract address
export const CONTRACT_ADDRESS =
   '0x2c2458dd19457ee824D8db315061BdfaBc205a7d' as `0x${string}`;

// Type-safe contract configuration
export const songContractConfig = {
   address: CONTRACT_ADDRESS,
   abi: SONG_CONTRACT_ABI,
} as const;
