import { useState } from 'react';
import { User, Building2 } from 'lucide-react';

export function FlowTest() {
  const [currentStep, setCurrentStep] = useState<'profile' | 'candidate' | 'company'>('profile');
  const [selectedProfile, setSelectedProfile] = useState<string>('');

  const handleProfileSelect = (profile: 'candidate' | 'company') => {
    console.log('Profile selecionado:', profile);
    setSelectedProfile(profile);
    setCurrentStep(profile);
  };

  if (currentStep === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-8">Escolha seu perfil</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => handleProfileSelect('candidate')}
              className="w-full flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-ravyz-purple hover:bg-ravyz-purple/5 transition-colors"
            >
              <div className="w-12 h-12 bg-ravyz-purple/10 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-ravyz-purple" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Busco Vaga</div>
                <div className="text-sm text-gray-600">Encontrar oportunidades</div>
              </div>
            </button>

            <button
              onClick={() => handleProfileSelect('company')}
              className="w-full flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-ravyz-blue hover:bg-ravyz-blue/5 transition-colors"
            >
              <div className="w-12 h-12 bg-ravyz-blue/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-ravyz-blue" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Busco Talentos</div>
                <div className="text-sm text-gray-600">Encontrar candidatos</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'candidate') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="w-20 h-20 mx-auto bg-ravyz-purple/10 rounded-2xl flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-ravyz-purple" />
          </div>
          
          <h1 className="text-3xl font-bold text-ravyz-purple">
            ✅ Fluxo Candidato OK!
          </h1>
          
          <p className="text-lg text-gray-700">
            Navegação funcionando perfeitamente
          </p>
          
          <button
            onClick={() => setCurrentStep('profile')}
            className="bg-ravyz-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-ravyz-purple/90"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'company') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="w-20 h-20 mx-auto bg-ravyz-blue/10 rounded-2xl flex items-center justify-center mb-6">
            <Building2 className="w-10 h-10 text-ravyz-blue" />
          </div>
          
          <h1 className="text-3xl font-bold text-ravyz-blue">
            ✅ Fluxo Empresa OK!
          </h1>
          
          <p className="text-lg text-gray-700">
            Navegação funcionando perfeitamente
          </p>
          
          <button
            onClick={() => setCurrentStep('profile')}
            className="bg-ravyz-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-ravyz-blue/90"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return null;
}