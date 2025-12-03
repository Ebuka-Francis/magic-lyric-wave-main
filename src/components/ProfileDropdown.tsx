import { User, Library, Wallet, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const ProfileDropdown = () => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <UserCircle className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border-border">
        <DropdownMenuItem onClick={() => navigate('/library')} className="cursor-pointer">
          <Library className="w-4 h-4 mr-2" />
          Library
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          Profile Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/wallet')} className="cursor-pointer">
          <Wallet className="w-4 h-4 mr-2" />
          Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
