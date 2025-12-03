import { useEffect, useRef } from 'react';

export default function Footer() {
   const publications = [
      'Rolling Stone',
      'Billboard',
      'Forbes',
      'Wired',
      'TechCrunch',
      'The Verge',
      'Pitchfork',
      'Complex',
   ];

   // Duplicate for seamless loop
   const items = [...publications, ...publications];

   return (
      <footer className="relative z-10 pb-12 pt-8">
         <div className="container mx-auto px-6">
            <div className="flex flex-col items-center gap-4">
               {/* <span className="text-white/60 text-sm font-medium">
                  Featured in
               </span> */}

               {/* Carousel Container */}
               <div className="relative w-full max-w-2xl overflow-hidden">
                  {/* Gradient overlays for smooth edges */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10" />
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10" />

                  {/* Scrolling track */}
                  <div className="flex animate-scroll">
                     {items.map((pub, i) => (
                        <span
                           key={i}
                           className="text-white text-sm whitespace-nowrap px-6 flex-shrink-0"
                        >
                           {pub}
                        </span>
                     ))}
                  </div>
               </div>
            </div>

            <p className="text-center text-white/40 text-xs mt-6">
               Powered by Story Protocol
            </p>
         </div>

         <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 15s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      </footer>
   );
}
