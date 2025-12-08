# 🎵 LyricDrop - The Text-to-Song Magic Button

<div align="center">

![LyricDrop](https://img.shields.io/badge/LyricDrop-Text%20to%20Song-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Story Protocol](https://img.shields.io/badge/Story%20Protocol-IP%20Protection-orange?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite)

**Turn any text into a professional song in seconds, with on-chain IP ownership powered by Story Protocol.**

[Live Demo](#) • [Documentation](#features) • [Smart Contracts](#smart-contracts) • [API Reference](#edge-functions)

</div>

---

## 📖 Overview

LyricDrop is a revolutionary web application that transforms any text—memes, tweets, love notes, rants, or random words—into full professional-quality songs instantly. Each song is automatically registered as an IP asset on Story Protocol, giving creators true ownership and the ability to license their music.

### Key Features

-  🎤 **Instant Song Generation** - AI-powered lyrics and music creation
-  🔗 **On-Chain IP Ownership** - Every song is registered on Story Protocol
-  💰 **LYRIC Token Rewards** - Earn tokens for creating and remixing
-  🎨 **AI Album Art Generation** - Automatic cover art for each song
-  🔄 **Remix & Derivatives** - Create licensed remixes with automatic royalty splitting
-  👛 **Multi-Wallet Support** - RainbowKit integration for seamless Web3 experience

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React + Vite)                  │
├─────────────────────────────────────────────────────────────────┤
│  Home Page  │  Creating Page  │  Result Page  │  Library/Profile │
└──────┬──────────────┬───────────────┬──────────────┬────────────┘
       │              │               │              │
       ▼              ▼               ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Edge Functions                       │
├─────────────────────────────────────────────────────────────────┤
│  generate-lyrics  │  generate-music  │  generate-song-image     │
└──────────┬────────────────┬────────────────┬────────────────────┘
           │                │                │
           ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Lovable AI Gateway                            │
│              (Google Gemini / OpenAI Models)                     │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Smart Contracts (Story Protocol)              │
├─────────────────────────────────────────────────────────────────┤
│  SongNFT  │  SongFactory  │  DerivativeFactory  │  LyricToken   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

-  Node.js 18+ or Bun
-  A Web3 wallet (MetaMask, Rainbow, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/lyricdrop.git
cd lyricdrop

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase (auto-configured with Lovable Cloud)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Smart Contract Addresses
VITE_SONG_FACTORY_ADDRESS=0x5d969E73e9597e2F46a5A2827aFcE6d72fE59410
VITE_SONG_NFT_ADDRESS=0x2c2458dd19457ee824D8db315061BdfaBc205a7d
VITE_LYRIC_TOKEN_ADDRESS=0x1b1823580654b007575923b751984901F57c4c7C
```

---

## 📱 Features

### 1. Text-to-Song Generation

Users enter any text and select a genre. The AI generates:

1. **Lyrics** - Creative, genre-appropriate song lyrics
2. **Music** - Full audio track matching the genre
3. **Album Art** - AI-generated cover image

**Supported Genres:**

-  Pop, R&B, Trap, Afro, Lofi, Metal, Ballad, Auto-vibe

### 2. Story Protocol IP Registration

Every generated song is automatically:

-  Minted as an ERC-721 NFT
-  Registered as an IP Asset on Story Protocol
-  Attached with a configurable license (Open Remix License)
-  Timestamped with provenance data

### 3. LYRIC Token Economy

Creators earn LYRIC tokens for:

-  Creating original songs (10 LYRIC)
-  Creating remixes/derivatives (5 LYRIC)
-  Receiving royalties from remixes

---

## 🔗 Smart Contracts

### Deployed Contract Addresses

| Contract    | Address                                      |
| ----------- | -------------------------------------------- |
| SongNFT     | `0x2c2458dd19457ee824D8db315061BdfaBc205a7d` |
| LyricToken  | `0x1b1823580654b007575923b751984901F57c4c7C` |
| SongFactory | `0x5d969E73e9597e2F46a5A2827aFcE6d72fE59410` |

### SongNFT Contract

ERC-721 contract representing song ownership.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract SongNFT is ERC721URIStorage, Ownable {
    // Maps database songId to NFT tokenId
    mapping(uint256 => uint256) public songIdToTokenId;
    mapping(uint256 => uint256) public tokenIdToSongId;

    event SongMinted(uint256 indexed tokenId, uint256 indexed songId, address indexed creator);

    function mint(address to, uint256 songId, string memory uri)
        external
        onlyFactory
        returns (uint256);
}
```

### SongFactory Contract

One-click song registration with Story Protocol integration.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract SongFactory is Ownable, ReentrancyGuard {
    struct Song {
        uint256 tokenId;
        address ipId;
        address creator;
        uint256 timestamp;
    }

    mapping(uint256 => Song) public songs;
    uint256 public songCreationReward = 10 * 10**18; // 10 LYRIC tokens

    event SongRegistered(
        uint256 indexed songId,
        uint256 indexed tokenId,
        address indexed ipId,
        address creator,
        uint256 rewardAmount
    );

    function registerSong(uint256 songId, string calldata metadataURI)
        external
        nonReentrant
        returns (uint256 tokenId, address ipId);
}
```

### DerivativeFactory Contract

Create licensed remixes linked to parent songs.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract DerivativeFactory is Ownable, ReentrancyGuard {
    struct Derivative {
        uint256 childTokenId;
        address childIpId;
        uint256 parentSongId;
        string derivativeType;
        address creator;
        uint256 timestamp;
    }

    mapping(uint256 => Derivative) public derivatives;
    mapping(uint256 => uint256[]) public childrenOf;

    event DerivativeCreated(
        uint256 indexed childSongId,
        uint256 indexed parentSongId,
        address indexed childIpId,
        string derivativeType
    );

    function createDerivative(
        uint256 parentSongId,
        uint256 childSongId,
        string calldata metadataURI,
        string calldata derivativeType
    ) external nonReentrant returns (uint256 childTokenId, address childIpId);
}
```

### LyricToken Contract

ERC-20 token for the LyricDrop ecosystem.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract LyricToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000_000 * 10**18; // 10 billion
    address public rewardDistributor;

    event RewardDistributed(address indexed to, uint256 amount, string reason);

    function distributeReward(address to, uint256 amount, string calldata reason)
        external
        onlyDistributor;

    function batchDistributeRewards(
        address[] calldata recipients,
        uint256[] calldata amounts,
        string calldata reason
    ) external onlyDistributor;
}
```

---

## 🔧 Edge Functions

### generate-lyrics

Generates creative song lyrics using Lovable AI (Google Gemini).

**Endpoint:** `POST /functions/v1/generate-lyrics`

**Request:**

```json
{
   "text": "I love sunny days at the beach",
   "genre": "Pop"
}
```

**Response:**

```json
{
   "lyrics": "[Verse 1]\nSunshine on my face...\n[Chorus]\nBeach vibes all day..."
}
```

**Implementation:**

```typescript
// supabase/functions/generate-lyrics/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
   const { text, genre } = await req.json();

   const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

   const response = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
               {
                  role: 'system',
                  content: `You are a professional songwriter...`,
               },
               { role: 'user', content: text },
            ],
         }),
      }
   );

   const data = await response.json();
   return new Response(
      JSON.stringify({ lyrics: data.choices[0].message.content })
   );
});
```

### generate-music

Generates music audio from lyrics (placeholder mode - requires REPLICATE_API_KEY for real generation).

**Endpoint:** `POST /functions/v1/generate-music`

**Request:**

```json
{
   "lyrics": "Verse 1...",
   "genre": "Pop"
}
```

**Response:**

```json
{
   "audioUrl": "https://...",
   "message": "Music generated successfully"
}
```

### generate-song-image

Generates AI album cover art.

**Endpoint:** `POST /functions/v1/generate-song-image`

**Request:**

```json
{
   "title": "Beach Vibes",
   "genre": "Pop"
}
```

**Response:**

```json
{
   "imageUrl": "data:image/png;base64,..."
}
```

**Implementation:**

```typescript
// supabase/functions/generate-song-image/index.ts
const response = await fetch(
   'https://ai.gateway.lovable.dev/v1/chat/completions',
   {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${LOVABLE_API_KEY}`,
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         model: 'google/gemini-2.5-flash-image-preview',
         messages: [{ role: 'user', content: prompt }],
         modalities: ['image', 'text'],
      }),
   }
);
```

---

## 🎨 Frontend Components

### Key Pages

| Page     | Path        | Description                                      |
| -------- | ----------- | ------------------------------------------------ |
| Home     | `/`         | Main landing with text input and genre selection |
| Creating | `/creating` | Animated loading screen during generation        |
| Result   | `/result`   | Song player with IP ownership card               |
| Library  | `/library`  | User's generated songs collection                |
| Profile  | `/profile`  | User profile management                          |
| Wallet   | `/wallet`   | LYRIC token balance and transactions             |

### Core Components

```
src/
├── components/
│   ├── AudioPlayer.tsx      # Custom audio player with controls
│   ├── Footer.tsx           # App footer with Story Protocol branding
│   ├── ProfileDropdown.tsx  # User menu dropdown
│   └── wallet-modal/        # Wallet connection UI
├── hooks/
│   ├── usRegisterSong.ts    # Song registration hook
│   ├── useDeriv.ts          # Derivative creation hook
│   └── useGetSong.ts        # Song data fetching
└── contracts/
    └── songContract.ts      # Contract configuration
```

---

## 🔐 Web3 Integration

### Wallet Connection

LyricDrop uses RainbowKit for wallet connections:

```typescript
// src/config/wagmi-config.ts
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
   appName: 'LyricDrop',
   projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
   chains: [mainnet, sepolia, polygon, optimism, arbitrum, base],
});
```

### Song Registration Flow

```typescript
// Register a song on-chain
const registerSong = async (songId: number, metadataURI: string) => {
   const txHash = await writeContractAsync({
      address: SONG_FACTORY_ADDRESS,
      abi: SONG_FACTORY_ABI,
      functionName: 'registerSong',
      args: [songId, metadataURI],
   });

   // Wait for confirmation
   const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
   });

   // Extract event data
   const event = receipt.logs.find(
      (log) =>
         decodeEventLog({ abi: SONG_FACTORY_ABI, ...log }).eventName ===
         'SongRegistered'
   );

   return {
      tokenId: event.args.tokenId,
      ipId: event.args.ipId,
   };
};
```

---

## 🗄️ Database Schema

### Songs Table

```sql
CREATE TABLE public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  lyrics TEXT NOT NULL,
  genre TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own songs"
  ON public.songs FOR SELECT
  USING (auth.uid() = user_id);
```

### Profiles Table

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🛠️ Technology Stack

| Category   | Technology                            |
| ---------- | ------------------------------------- |
| Frontend   | React 18, TypeScript, Vite            |
| Styling    | Tailwind CSS, shadcn/ui               |
| Web3       | wagmi, viem, RainbowKit               |
| Backend    | Supabase (Lovable Cloud)              |
| AI         | Lovable AI Gateway (Gemini/GPT)       |
| Blockchain | Story Protocol, EVM-compatible chains |
| State      | React Query, React Context            |

---

## 📂 Project Structure

```
lyricdrop/
├── ABIs/                    # Smart contract ABIs
│   ├── DerivativeFactory.json
│   ├── LyricToken.json
│   ├── SongFactory.json
│   ├── SongNFT.json
│   └── addresses.json
├── contracts/               # Solidity contracts
│   ├── DerivativeFactory.sol
│   ├── LyricToken.sol
│   ├── SongFactory.sol
│   └── SongNFT.sol
├── src/
│   ├── components/          # React components
│   ├── config/              # App configuration
│   ├── context/             # React context providers
│   ├── contracts/           # Contract configs
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Supabase client
│   ├── pages/               # Route pages
│   └── lib/                 # Utilities
├── supabase/
│   ├── functions/           # Edge functions
│   │   ├── generate-lyrics/
│   │   ├── generate-music/
│   │   └── generate-song-image/
│   └── config.toml
└── public/                  # Static assets
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

-  [Story Protocol](https://story.foundation/) - On-chain IP infrastructure
-  [Lovable](https://lovable.dev) - AI-powered development platform
-  [RainbowKit](https://rainbowkit.com/) - Wallet connection library
-  [shadcn/ui](https://ui.shadcn.com/) - UI component library

---

<div align="center">

**Built with ❤️ by the LyricDrop Team**

[Website](#) • [Twitter](#) • [Discord](#)

</div>
