import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Download,
   Share2,
   Scissors,
   ArrowLeft,
   Music,
   CheckCircle2,
   ExternalLink,
   Clock,
   Shield,
   Sparkles,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import ProfileDropdown from '@/components/ProfileDropdown';
import { useAccount } from 'wagmi';
import { useMyContext } from '@/context/MyContext';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { DERIVATIVE_FACTORY_ABI } from '@/config/abi';
import { DERIVATIVE_FACTORY_ADDRESS } from '@/config/contracts';

const Result = () => {
   const { address, chain } = useAccount();
   const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
   const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
      hash,
   });
   const location = useLocation();
   const navigate = useNavigate();
   const { myData } = useMyContext();
   const { text, genre, lyrics, audioUrl, message } = location.state || {
      text: 'Your amazing lyrics',
      genre: 'Auto-vibe',
      lyrics: 'No lyrics generated',
      audioUrl: '',
      message: '',
   };

   const [isPlaying, setIsPlaying] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [songSaved, setSongSaved] = useState(false);
   const [imageUrl, setImageUrl] = useState<string>('');
   const audioRef = useRef<HTMLAudioElement>(null);

   // Mock data for demonstration
   const mockIpAssetId = myData.txHash;
   const mockTimestamp = Date.now();

   useEffect(() => {
      if (message) {
         toast.info(message);
      }
      saveSongToDatabase();
   }, [message]);

   useEffect(() => {
    if (isConfirmed) {
       toast.success('Remixing enabled successfully!');
    }
    if (writeError) {
        toast.error(`Failed to enable remixing: ${writeError.message}`);
    }
 }, [isConfirmed, writeError]);

 const handleEnableRemixing = () => {
    try {
       const parentSongId = BigInt(1); 
       const childSongId = BigInt(2); 
       const metadataURI = ""; 
       const derivativeType = "Remix"; 
       writeContract({
          address: DERIVATIVE_FACTORY_ADDRESS as `0x${string}`,
          abi: DERIVATIVE_FACTORY_ABI,
          functionName: 'createDerivative',
          args: [parentSongId, childSongId, metadataURI, derivativeType],
          account: address,
          chain: chain,
       });
    } catch (error) {
       console.error('Error calling contract:', error);
       toast.error('Failed to initiate transaction');
    }
 };

   const saveSongToDatabase = async () => {
      if (songSaved || isSaving) return;

      setIsSaving(true);
      try {   
         toast.success('Song generated successfully!');
         setSongSaved(true);
      } catch (error) {
         console.error('Error saving song:', error);
         toast.error('Failed to save song');
      } finally {
         setIsSaving(false);
      }
   };

   const togglePlay = () => {
      if (audioRef.current) {
         if (isPlaying) {
            audioRef.current.pause();
         } else {
            audioRef.current.play();
         }
         setIsPlaying(!isPlaying);
      }
   };

   return (
      <div className="min-h-screen bg-background py-4 sm:py-8 px-3 sm:px-4">
         <div className="container mx-auto max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
               <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => navigate('/')}
                     className="rounded-full flex-shrink-0"
                  >
                     <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="min-w-0 flex-1">
                     <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
                        Your Song is Ready!
                     </h1>
                     <p className="text-sm sm:text-base text-muted-foreground truncate">
                        Generated in {genre} style
                     </p>
                  </div>
               </div>
               <div className="ml-auto sm:ml-0">
                  <ProfileDropdown />
               </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
               {/* Main player section */}
               <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {/* Audio player card */}
                  <Card className="glass-card border-border/30">
                     <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                           <Music className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                           <span>Audio Player</span>
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                        {/* Album cover image */}
                        {imageUrl && (
                           <div className="flex justify-center">
                              <img
                                 src={imageUrl}
                                 alt="Album Cover"
                                 className="w-48 h-48 sm:w-64 sm:h-64 rounded-xl object-cover shadow-lg"
                              />
                           </div>
                        )}

                        {isSaving && !imageUrl && (
                           <div className="flex justify-center items-center h-48 sm:h-64">
                              <p className="text-sm sm:text-base text-white/60">
                                 Generating album cover...
                              </p>
                           </div>
                        )}

                        {/* Audio element */}
                        {audioUrl && (
                           <audio
                              ref={audioRef}
                              src={audioUrl}
                              onEnded={() => setIsPlaying(false)}
                              onPlay={() => setIsPlaying(true)}
                              onPause={() => setIsPlaying(false)}
                           />
                        )}

                        {/* Waveform visualization */}
                        <div className="flex items-center justify-center gap-0.5 sm:gap-1 h-24 sm:h-32 bg-white/10 rounded-xl p-3 sm:p-4 overflow-hidden">
                           {[...Array(40)].map((_, i) => (
                              <div
                                 key={i}
                                 className={`w-1 bg-black rounded-full transition-all ${
                                    isPlaying ? 'animate-wave' : ''
                                 }`}
                                 style={{
                                    height: `${20 + Math.random() * 80}%`,
                                    animationDelay: `${i * 0.05}s`,
                                 }}
                              />
                           ))}
                        </div>

                        {/* Play controls */}
                        <div className="flex items-center justify-center gap-4">
                           <Button
                              onClick={togglePlay}
                              disabled={!audioUrl}
                              className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-black text-white hover:bg-black/80 disabled:opacity-50 text-xl sm:text-2xl"
                           >
                              {isPlaying ? '⏸' : '▶'}
                           </Button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                           <Button
                              variant="glass"
                              size="lg"
                              className="w-full sm:w-auto gap-2"
                           >
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline">Download</span>
                              <span className="sm:hidden">Download</span>
                           </Button>
                           <Button
                              variant="glass"
                              size="lg"
                              className="w-full sm:w-auto gap-2"
                           >
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                           </Button>
                           <Button
                              variant="glass"
                              size="lg"
                              className="w-full sm:w-auto gap-2"
                           >
                              <Scissors className="w-4 h-4" />
                              <span className="hidden sm:inline">
                                 Create Clip
                              </span>
                              <span className="sm:hidden">Clip</span>
                           </Button>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Lyrics card */}
                  <Card className="glass-card border-border/30">
                     <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-lg sm:text-xl">
                           Generated Lyrics
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="bg-secondary/30 rounded-xl p-4 sm:p-6">
                           <p className="whitespace-pre-wrap text-sm sm:text-base text-foreground/90 leading-relaxed">
                              {lyrics}
                           </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                           <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs sm:text-sm">
                              {genre}
                           </span>
                           <span className="px-3 py-1 bg-accent/20 text-white rounded-full text-xs sm:text-sm">
                              Energetic
                           </span>
                           <span className="px-3 py-1 bg-secondary text-foreground rounded-full text-xs sm:text-sm">
                              Uplifting
                           </span>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               {/* Story IP Ownership Card */}
               <div className="lg:col-span-1">
                  <Card className="glass-card border-primary/30 lg:sticky lg:top-8">
                     <CardHeader className="border-b border-border/30 pb-4 p-4 sm:p-6">
                        <div className="flex items-center gap-2">
                           <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                           <CardTitle className="text-lg sm:text-xl">
                              Registered On-Chain
                           </CardTitle>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                           Your song is protected by Story Protocol
                        </p>
                     </CardHeader>
                     <CardContent className="space-y-4 pt-4 sm:pt-6 p-4 sm:p-6">
                        {/* IP Asset ID */}
                        <div>
                           <label className="text-xs text-muted-foreground uppercase tracking-wider">
                              IP Asset ID
                           </label>
                           <div className="mt-1 p-2 sm:p-3 bg-secondary/30 rounded-lg overflow-hidden">
                              <code className="text-xs text-white break-all">
                                 {mockIpAssetId}
                              </code>
                           </div>
                        </div>

                        {/* Owner */}
                        <div>
                           <label className="text-xs text-muted-foreground uppercase tracking-wider">
                              Owner
                           </label>
                           <div className="mt-1 p-2 sm:p-3 bg-secondary/30 rounded-lg overflow-hidden">
                              <code className="text-xs text-foreground/80 break-all">
                                 {address}
                              </code>
                           </div>
                        </div>

                        {/* License */}
                        <div>
                           <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              License Type
                           </label>
                           <div className="mt-1">
                              <Button className="w-full bg-black text-white hover:bg-black/80 text-sm sm:text-base">
                                 Open Remix License
                              </Button>
                           </div>
                        </div>

                        {/* Timestamp */}
                        <div>
                           <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Registered
                           </label>
                           <div className="mt-1">
                              <p className="text-xs sm:text-sm text-foreground/80 break-words">
                                 {new Date(mockTimestamp).toLocaleString()}
                              </p>
                           </div>
                        </div>

                        {/* Action links */}
                        <div className="space-y-2 pt-4 border-t border-border/30">
                           <Button
                              variant="outline"
                              className="w-full justify-between text-sm"
                              size="lg"
                           >
                              <span>View Provenance</span>
                              <ExternalLink className="w-4 h-4 flex-shrink-0" />
                           </Button>
                           <Button
                              variant="outline"
                              className="w-full justify-between text-sm"
                              size="lg"
                              onClick={handleEnableRemixing}
                              disabled={isPending}
                           >
                              <span>{isPending ? 'Enabling...' : 'Enable Remixing'}</span>
                              <Sparkles className="w-4 h-4 flex-shrink-0" />
                           </Button>
                           <Button
                              variant="outline"
                              className="w-full justify-between text-sm"
                              size="lg"
                           >
                              <span>Set Royalty Split</span>
                              <ExternalLink className="w-4 h-4 flex-shrink-0" />
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>

            {/* Bottom action */}
            <div className="mt-6 sm:mt-8 text-center">
               <Button
                  size="xl"
                  onClick={() => navigate('/')}
                  className="bg-black text-white hover:bg-black/80 w-full sm:w-auto gap-2"
               >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">
                     Create Another Song
                  </span>
               </Button>
            </div>
         </div>
      </div>
   );
};

export default Result;
