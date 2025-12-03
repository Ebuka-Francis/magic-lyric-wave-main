import { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AudioPlayer from '@/components/AudioPlayer';

interface Song {
  id: string;
  title: string;
  lyrics: string;
  genre: string;
  audio_url: string;
  image_url: string | null;
  created_at: string;
}

const Library = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      // Without authentication, show empty state
      setSongs([]);
    } catch (error: any) {
      toast.error('Failed to load songs');
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <p className="text-white">Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">My Library</h1>
          <Button onClick={() => navigate('/')} variant="outline" className="bg-white/10 text-white border-white/20">
            Back to Home
          </Button>
        </div>

        {songs.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-12 text-center">
              <Music className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No songs yet</h2>
              <p className="text-white/60 mb-6">Create your first song to see it here!</p>
              <Button onClick={() => navigate('/')} className="bg-white text-black hover:bg-white/90">
                Create a Song
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {songs.map((song) => (
              <Card key={song.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {song.image_url ? (
                      <img 
                        src={song.image_url} 
                        alt={song.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                        <Music className="w-10 h-10 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-white mb-1 truncate">{song.title}</h3>
                      <p className="text-white/60 text-sm mb-1">{song.genre}</p>
                      <p className="text-white/40 text-xs">
                        {new Date(song.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {playingSongId === song.id ? (
                    <AudioPlayer
                      audioUrl={song.audio_url}
                      title={song.title}
                      imageUrl={song.image_url || undefined}
                    />
                  ) : (
                    <Button
                      onClick={() => setPlayingSongId(song.id)}
                      className="w-full bg-white text-black hover:bg-white/90"
                    >
                      Play Song
                    </Button>
                  )}

                  {playingSongId === song.id && (
                    <Button
                      onClick={() => setPlayingSongId(null)}
                      variant="outline"
                      className="w-full mt-2 bg-white/5 text-white border-white/20"
                    >
                      Close Player
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
