import { Wallet as WalletIcon, Copy, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAccount, useDisconnect } from 'wagmi';

const Wallet = () => {
   const navigate = useNavigate();
   const { address, isConnected } = useAccount();
   const { disconnect } = useDisconnect();
   const copyAddress = () => {
      navigator.clipboard.writeText(address);
      toast.success(`Address ${address} copied to clipboard!`);
   };

   return (
      <div className="min-h-screen bg-gradient-hero">
         <div className="container mx-auto px-6 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
               <h1 className="text-4xl font-bold text-white">Wallet</h1>
               <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="bg-white/10 text-white border-white/20"
               >
                  Back to Home
               </Button>
            </div>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
               <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                     <WalletIcon className="w-6 h-6" />
                     Connected Wallet
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                     <p className="text-white/60 text-sm mb-2">
                        Wallet Address
                     </p>
                     <div className="flex items-center justify-between">
                        <p className="text-white font-mono text-lg">
                           {address}
                        </p>
                        <div className="flex gap-2">
                           <Button
                              size="sm"
                              variant="ghost"
                              onClick={copyAddress}
                              className="text-white hover:bg-white/10"
                           >
                              <Copy className="w-4 h-4" />
                           </Button>
                           <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-white/10"
                           >
                              <ExternalLink className="w-4 h-4" />
                           </Button>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white/60 text-sm mb-1">Network</p>
                        <p className="text-white font-semibold">
                           Story Protocol
                        </p>
                     </div>
                     <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white/60 text-sm mb-1">Status</p>
                        <p className="text-green-400 font-semibold">
                           {isConnected ? 'Connected' : 'Disconnected'}
                        </p>
                     </div>
                  </div>

                  <Button
                     variant="destructive"
                     className="w-full"
                     onClick={() => disconnect()}
                  >
                     Disconnect Wallet
                  </Button>
               </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
               <CardHeader>
                  <CardTitle className="text-white">IP Assets</CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-white/60 text-center py-8">
                     Your registered songs will appear here
                  </p>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default Wallet;
