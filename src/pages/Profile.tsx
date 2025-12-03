import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const profileSchema = z.object({
  display_name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  bio: z.string().max(500, 'Bio too long').optional(),
});

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Without authentication, show default empty state
      setProfile({
        display_name: '',
        bio: '',
        avatar_url: '',
      });
    } catch (error: any) {
      toast.error('Failed to load profile');
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      profileSchema.parse({
        display_name: profile.display_name,
        bio: profile.bio || '',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setSaving(true);
    try {
      // Without authentication, just update local state
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Profile</h1>
          <Button onClick={() => navigate('/')} variant="outline" className="bg-white/10 text-white border-white/20">
            Back to Home
          </Button>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="displayName" className="text-white">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profile.display_name}
                        onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-white">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {profile.display_name || 'Music Creator'}
                    </h2>
                    <p className="text-white/60">{profile.bio || 'No bio yet'}</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave}
                  className="w-full bg-white text-black hover:bg-white/90"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  onClick={() => {
                    setIsEditing(false);
                    loadProfile();
                  }}
                  variant="outline" 
                  className="w-full bg-white/5 text-white border-white/20"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline" 
                className="w-full bg-white/5 text-white border-white/20"
              >
                Edit Profile
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
