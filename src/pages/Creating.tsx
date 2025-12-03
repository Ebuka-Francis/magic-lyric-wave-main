import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Music } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProfileDropdown from "@/components/ProfileDropdown";

const loadingMessages = [
  "Generating melody...",
  "Crafting lyrics...",
  "Mastering vocals...",
  "Adding harmonies...",
  "Finalizing sound...",
  "Registering IP on-chain...",
];

const Creating = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { text, genre } = location.state || { text: "", genre: "Auto-vibe" };

  useEffect(() => {
    let messageInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const generateSong = async () => {
      try {
        // Start UI animations
        messageInterval = setInterval(() => {
          setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 500);

        progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 2, 90));
        }, 100);

        // Generate lyrics
        console.log('Calling generate-lyrics function...');
        const { data: lyricsData, error: lyricsError } = await supabase.functions.invoke('generate-lyrics', {
          body: { text, genre }
        });

        if (lyricsError) throw lyricsError;
        console.log('Lyrics generated:', lyricsData);

        // Generate music
        console.log('Calling generate-music function...');
        const { data: musicData, error: musicError } = await supabase.functions.invoke('generate-music', {
          body: { lyrics: lyricsData.lyrics, genre }
        });

        if (musicError) throw musicError;
        console.log('Music generated:', musicData);

        // Complete progress
        setProgress(100);
        
        // Navigate to result
        setTimeout(() => {
          navigate("/result", { 
            state: { 
              text, 
              genre,
              lyrics: lyricsData.lyrics,
              audioUrl: musicData.audioUrl,
              message: musicData.message
            } 
          });
        }, 500);
      } catch (error) {
        console.error('Error generating song:', error);
        toast.error('Failed to generate song. Please try again.');
        setTimeout(() => navigate('/'), 2000);
      }
    };

    generateSong();

    return () => {
      if (messageInterval) clearInterval(messageInterval);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [navigate, text, genre]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Header with profile icon */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-6">
        <div className="container mx-auto flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <Music className="w-7 h-7 text-white" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              LyricDrop
            </h1>
          </div>
          <ProfileDropdown />
        </div>
      </header>

      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent animate-glow-pulse" />

      {/* Animated waveform bars */}
      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-30">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="w-2 bg-primary rounded-full animate-wave"
            style={{
              height: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.8 + Math.random() * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        {/* Animated music icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Music className="w-24 h-24 text-primary animate-float" />
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl animate-glow-pulse" />
          </div>
        </div>

        {/* Loading message */}
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Creating Your Song...
        </h2>
        <p className="text-xl text-foreground/80 mb-8 h-8 animate-fade-in">
          {loadingMessages[messageIndex]}
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Selected genre indicator */}
        <div className="mt-12 glass-card inline-block px-6 py-3 rounded-full">
          <p className="text-sm text-muted-foreground">
            Genre: <span className="text-primary font-semibold">{genre}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Creating;
