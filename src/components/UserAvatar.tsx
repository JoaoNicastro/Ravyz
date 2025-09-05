import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
  userData?: {
    name?: string;
    linkedinData?: {
      profilePhoto?: string;
      name?: string;
    };
    resumeData?: {
      extractedData?: {
        name?: string;
      };
    };
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showFallback?: boolean;
}

export function UserAvatar({ 
  userData, 
  size = 'md', 
  className = '',
  showFallback = true 
}: UserAvatarProps) {
  // Buscar foto de perfil do LinkedIn
  const profilePhoto = userData?.linkedinData?.profilePhoto;
  
  // Buscar nome para fallback
  const name = userData?.name || 
              userData?.linkedinData?.name || 
              userData?.resumeData?.extractedData?.name ||
              'Usuário';

  // Gerar iniciais para fallback
  const getInitials = (fullName: string) => {
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return nameParts[0][0]?.toUpperCase() || 'U';
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {profilePhoto && (
        <AvatarImage 
          src={profilePhoto} 
          alt={`Foto de perfil de ${name}`}
          className="object-cover"
        />
      )}
      <AvatarFallback className="bg-ravyz-purple/10 text-ravyz-purple font-medium">
        {showFallback ? (
          name ? getInitials(name) : <User className={iconSizes[size]} />
        ) : (
          <User className={iconSizes[size]} />
        )}
      </AvatarFallback>
    </Avatar>
  );
}