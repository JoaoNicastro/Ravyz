import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, User, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface UserProfileHeaderProps {
  userData?: {
    name?: string;
    email?: string;
    profilePhoto?: string;
    mentor?: {
      name: string;
      avatar: string;
      category: string;
      color: string;
      personality: string;
    };
  };
  showMentor?: boolean;
  compact?: boolean;
  className?: string;
}

export function UserProfileHeader({ 
  userData, 
  showMentor = false, 
  compact = false, 
  className = '' 
}: UserProfileHeaderProps) {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const getUserInitials = () => {
    if (!userData?.name) return 'U';
    return userData.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aqui você implementaria o upload da foto
      // Por enquanto, vamos simular que a foto foi carregada
      console.log('Foto selecionada:', file.name);
      setShowPhotoUpload(false);
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="relative">
          <Avatar className="w-10 h-10 border-2 border-ravyz-purple/20">
            <AvatarImage src={userData?.profilePhoto} alt={userData?.name || 'Usuário'} />
            <AvatarFallback className="bg-ravyz-purple/10 text-ravyz-purple font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {showMentor && userData?.mentor && (
            <div className="absolute -bottom-1 -right-1 text-lg">
              {userData.mentor.avatar}
            </div>
          )}
        </div>
        
        {userData?.name && (
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{userData.name}</p>
            {showMentor && userData?.mentor && (
              <p className="text-xs text-gray-500">
                com {userData.mentor.name}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <Card className="p-6 bg-gradient-to-r from-ravyz-purple/5 to-ravyz-blue/5 border-ravyz-purple/20">
        <div className="flex items-start gap-6">
          {/* Avatar do Usuário */}
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <AvatarImage src={userData?.profilePhoto} alt={userData?.name || 'Usuário'} />
              <AvatarFallback className="bg-ravyz-purple text-white font-bold text-xl">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            {/* Botão para upload de foto */}
            <button
              onClick={() => setShowPhotoUpload(true)}
              className="absolute -bottom-1 -right-1 p-2 bg-ravyz-purple text-white rounded-full shadow-lg hover:bg-ravyz-purple/90 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Informações do Usuário */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {userData?.name || 'Seu Nome'}
                </h2>
                <p className="text-gray-600 mb-3">
                  {userData?.email || 'seu.email@exemplo.com'}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log('Editar perfil')}
                className="hover:bg-ravyz-purple/10 text-ravyz-purple"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>

            {/* Mentor Section */}
            {showMentor && userData?.mentor && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 p-3 bg-${userData.mentor.color}/10 rounded-lg border border-${userData.mentor.color}/20`}
              >
                <div className="text-2xl">{userData.mentor.avatar}</div>
                <div>
                  <p className={`font-medium text-${userData.mentor.color}`}>
                    {userData.mentor.name} • {userData.mentor.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    {userData.mentor.personality}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Card>

      {/* Modal de Upload de Foto */}
      {showPhotoUpload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPhotoUpload(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Atualizar foto do perfil
            </h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-ravyz-purple/20">
                  <AvatarImage src={userData?.profilePhoto} alt={userData?.name || 'Usuário'} />
                  <AvatarFallback className="bg-ravyz-purple/10 text-ravyz-purple font-bold text-xl">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="photo-upload" className="block">
                  <Button className="w-full bg-ravyz-purple hover:bg-ravyz-purple/90">
                    <Camera className="w-4 h-4 mr-2" />
                    Selecionar nova foto
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                
                <Button
                  variant="outline"
                  onClick={() => setShowPhotoUpload(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}