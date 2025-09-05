import { Crown, Users, BarChart3, Lightbulb, Target } from "lucide-react";

interface ProfileIconProps {
  profileType: 'leadership' | 'communication' | 'analytical' | 'creative' | 'execution';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const profileIcons = {
  leadership: Crown,
  communication: Users,
  analytical: BarChart3,
  creative: Lightbulb,
  execution: Target
};

const profileColors = {
  leadership: 'ravyz-orange',
  communication: 'ravyz-blue', 
  analytical: 'ravyz-purple',
  creative: 'ravyz-green',
  execution: 'ravyz-orange'
};

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8', 
  xl: 'w-10 h-10'
};

export function ProfileIcon({ profileType, size = 'md', className = '' }: ProfileIconProps) {
  const IconComponent = profileIcons[profileType];
  const color = profileColors[profileType];
  const containerSize = sizes[size];
  const iconSize = iconSizes[size];

  return (
    <div className={`${containerSize} bg-${color}/10 rounded-2xl flex items-center justify-center ${className}`}>
      <IconComponent className={`${iconSize} text-${color}`} />
    </div>
  );
}

// Hook para obter informações do perfil
export function useProfileInfo(profileName: string) {
  const profileTypes = {
    'Líder Estratégico': 'leadership',
    'Facilitador': 'communication', 
    'Analista Estratégico': 'analytical',
    'Inovador Criativo': 'creative',
    'Executor de Resultados': 'execution'
  } as const;

  const profileKey = profileTypes[profileName as keyof typeof profileTypes] || 'execution';
  
  return {
    type: profileKey,
    color: profileColors[profileKey],
    icon: profileIcons[profileKey]
  };
}