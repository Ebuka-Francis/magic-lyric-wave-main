import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Creating from './pages/Creating';
import Result from './pages/Result';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import NotFound from './pages/NotFound';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config as wagmiConfig } from './config/wagmi-config';
import { Providers } from './Providers';
import { MyProvider } from './context/MyContext';

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const App = () => (
   <Providers>
      <TooltipProvider>
         <Toaster />
         <Sonner />
         <MyProvider>
            <BrowserRouter>
               <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/creating" element={<Creating />} />
                  <Route path="/result" element={<Result />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/wallet" element={<Wallet />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
               </Routes>
            </BrowserRouter>
         </MyProvider>
      </TooltipProvider>
   </Providers>
);

export default App;
