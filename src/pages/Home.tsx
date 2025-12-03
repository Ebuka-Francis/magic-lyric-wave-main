import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Music, Sparkles } from 'lucide-react';
import Footer from '@/components/Footer';
import ProfileDropdown from '@/components/ProfileDropdown';
import { WalletConnect } from '@/components/wallet-modal';
import { useMyContext } from '@/context/MyContext';
import {
   useAccount,
   useWriteContract,
   useWaitForTransactionReceipt,
   useChainId,
} from 'wagmi';
import { songContractConfig } from '@/contracts/songContract';
import { useToast } from '@/hooks/use-toast';
import { Chain } from 'wagmi/chains';

const Home = () => {
   const { isConnected, address } = useAccount();
   const chainId = useChainId();
   const { toast } = useToast();
   const [prompt, setPrompt] = useState('');
   const [isGenerating, setIsGenerating] = useState(false);
   const navigate = useNavigate();
   const { myData, setMyData } = useMyContext();

   // Smart contract hooks
   const {
      data: hash,
      writeContract,
      isPending: isWritePending,
      error: writeError,
      reset: resetWrite,
   } = useWriteContract();

   const { isLoading: isConfirming, isSuccess: isConfirmed } =
      useWaitForTransactionReceipt({
         hash,
      });

   // Handle navigation to /creating immediately after transaction submission (hash is available)
   useEffect(() => {
      // Navigate once the transaction hash is received (submitted, not yet confirmed)
      if (hash && !isConfirming && !isConfirmed) {
         // Update context with the hash immediately
         setMyData({ ...myData, txHash: hash as `0x${string}` });

         // Navigate to the CREATING page (as it acts as the loading page)
         navigate('/creating', {
            state: {
               text: prompt,
               genre: 'Auto-vibe',
               txHash: hash,
            },
         });

         // Note: We keep isGenerating = true until confirmation or error
      }
   }, [hash, navigate, setMyData, prompt, isConfirming, isConfirmed, myData]);

   // Handle transaction confirmation (runs after navigating)
   useEffect(() => {
      if (isConfirmed && hash) {
         toast({
            title: 'Success!',
            description: 'Song created and license terms attached',
         });

         // Reset the write contract state and stop loading
         resetWrite();
         setPrompt('');
         setIsGenerating(false); // STOP overall process
      }
   }, [isConfirmed, hash, resetWrite, toast]); // Only run when these change

   // Handle transaction error
   useEffect(() => {
      if (writeError) {
         toast({
            title: 'Transaction Error',
            description: writeError.message,
            variant: 'destructive',
         });
         setIsGenerating(false); // STOP overall process on error
         resetWrite(); // Clear pending state
      }
   }, [writeError, resetWrite, toast]);

   const handleCreateSong = async () => {
      if (!prompt.trim()) return;

      if (!isConnected) {
         toast({
            title: 'Wallet not connected',
            description: 'Please connect your wallet to create a song',
            variant: 'destructive',
         });
         return;
      }

      // START the overall process
      setIsGenerating(true);

      try {
         const ipId = '0x0000000000000000000000000000000000000000'; // Replace with actual IP ID
         const licenseTemplate = '0x0000000000000000000000000000000000000000'; // Replace with actual license template
         const licenseTermsId = BigInt(1); // Replace with actual license terms ID

         // Call smart contract
         writeContract({
            address: songContractConfig.address,
            abi: songContractConfig.abi,
            functionName: 'attachLicenseTerms',
            args: [
               ipId as `0x${string}`,
               licenseTemplate as `0x${string}`,
               licenseTermsId,
            ],
            account: address,
            chain: { id: chainId, name: 'Ethereum' } as Chain,
         });

         // Show pending toast (will be superseded by success/error toast later)
         toast({
            title: 'Transaction submitted',
            description: 'Waiting for confirmation...',
         });
      } catch (error) {
         console.error('Error creating song:', error);
         toast({
            title: 'Transaction failed',
            description:
               error instanceof Error ? error.message : 'Unknown error',
            variant: 'destructive',
         });
         setIsGenerating(false); // Stop loading if writeContract fails locally
      }
   };

   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && prompt.trim()) {
         handleCreateSong();
      }
   };

   // Use isGenerating for consistent loading state
   const isProcessing = isGenerating;
   // Note: isGenerating is set true in handleCreateSong, and set false only on success/error.
   // This prevents the momentary drop in loading state between submission and confirmation.

   return (
      <div className="h-screen bg-gradient-hero relative overflow-hidden">
         <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
         >
            <source src="./hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
         </video>

         <div className="absolute inset-0 bg-black opacity-10 z-[10]" />

         <div
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
         />

         <header className="relative z-10 sm:px-6 py-6">
            <div className="container mx-auto flex items-center justify-between max-w-7xl">
               <div className="flex items-center gap-2">
                  <Music className="w-7 h-7 text-white" />
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                     LyricDrop
                  </h1>
               </div>
               <div className="flex items-center gap-3">
                  {isConnected ? <ProfileDropdown /> : <ConnectButton />}
               </div>
            </div>
         </header>

         <main className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] max-w-4xl md:pb-[3rem] sm:pb-32">
            <div className="text-center mb-1 sm:mb-12">
               <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  {['Make', 'any', 'song'].map((word, i) => (
                     <span
                        key={i}
                        className="inline-block animate-text-reveal mr-4"
                        style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}
                     >
                        {word}
                     </span>
                  ))}
                  <br />
                  {['you', 'can', 'imagine'].map((word, i) => (
                     <span
                        key={i}
                        className="inline-block animate-text-reveal mr-4"
                        style={{
                           animationDelay: `${(i + 3) * 0.15}s`,
                           opacity: 0,
                        }}
                     >
                        {word}
                     </span>
                  ))}
               </h2>
               <p className="text-xl text-white/80 max-w-2xl mx-auto animate-text-reveal-delay">
                  Start with a simple prompt or dive into our pro editing tools,
                  your next track is just a step away.
               </p>
            </div>

            <div
               className="w-full max-w-2xl animate-fade-in"
               style={{ animationDelay: '0.1s' }}
            >
               <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-2 flex items-center gap-3">
                  <Input
                     placeholder="Chat to make music"
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                     onKeyPress={handleKeyPress}
                     disabled={isProcessing}
                     className="flex-1 bg-transparent border-0 text-white text-lg placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                  />
                  <Button
                     variant="ghost"
                     size="sm"
                     className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                     Advanced
                  </Button>
                  <Button
                     onClick={handleCreateSong}
                     disabled={!prompt.trim() || isProcessing}
                     className="bg-black hover:bg-black/80 text-white font-semibold px-6 h-12 rounded-xl border border-white/20 disabled:opacity-50"
                  >
                     <Sparkles
                        className={`w-4 h-4 ${
                           isProcessing ? 'animate-spin' : ''
                        }`}
                     />
                     {isProcessing ? 'Creating...' : 'Create'}
                  </Button>
               </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-white/60 text-sm">
               <span>✨ Turn any text into a professional song in seconds</span>
            </div>
         </main>

         <Footer />
      </div>
   );
};

export default Home;
