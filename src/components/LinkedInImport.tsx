import { useState } from "react";
import { motion } from "motion/react";
import { Linkedin, Check, AlertCircle, ArrowRight, Shield } from "lucide-react";
import { RavyzButton } from "./RavyzButton";
import { Card } from "./ui/card";

interface LinkedInImportProps {
  onImportComplete: (data: any) => void;
  onCancel: () => void;
}

export function LinkedInImport({ onImportComplete, onCancel }: LinkedInImportProps) {
  const [step, setStep] = useState<'auth' | 'importing' | 'preview'>('auth');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simular conexão com LinkedIn
    setTimeout(() => {
      setIsConnecting(false);
      setStep('importing');
      
      // Simular importação
      setTimeout(() => {
        setStep('preview');
      }, 2000);
    }, 1500);
  };

  const handleConfirmImport = () => {
    // Dados simulados do LinkedIn
    const linkedInData = {
      companies: ["Meta", "Apple", "Tesla"],
      positions: ["Senior Software Engineer", "Product Manager", "Technical Lead"],
      skills: ["React", "JavaScript", "Product Strategy", "Team Leadership", "AI/ML"],
      education: ["Stanford University - Computer Science", "MIT - Business Analytics"],
      experienceYears: 8,
      industries: ["Big Tech", "Automotive", "Social Media"]
    };
    
    onImportComplete(linkedInData);
  };

  if (step === 'auth') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <Card className="p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-ravyz-blue/10 rounded-xl flex items-center justify-center mb-4">
            <Linkedin className="w-8 h-8 text-ravyz-blue" />
          </div>
          
          <h3 className="font-bold text-ravyz-black mb-2">
            Conectar com LinkedIn
          </h3>
          <p className="text-ravyz-gray-500 mb-6 text-sm leading-relaxed">
            Importe automaticamente seus dados profissionais do LinkedIn para acelerar seu cadastro
          </p>

          {/* Benefícios */}
          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-ravyz-green flex-shrink-0" />
              <span className="text-ravyz-gray-700">Experiências profissionais atualizadas</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-ravyz-green flex-shrink-0" />
              <span className="text-ravyz-gray-700">Habilidades e endorsements</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-ravyz-green flex-shrink-0" />
              <span className="text-ravyz-gray-700">Formação acadêmica completa</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-ravyz-green flex-shrink-0" />
              <span className="text-ravyz-gray-700">Conexões e recomendações</span>
            </div>
          </div>

          {/* Segurança */}
          <div className="bg-ravyz-blue/10 p-3 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-ravyz-blue" />
              <span className="text-sm font-medium text-ravyz-blue">Seguro e Privado</span>
            </div>
            <p className="text-xs text-ravyz-gray-600">
              Seus dados são importados de forma segura e você pode editá-los antes de finalizar
            </p>
          </div>

          <div className="space-y-3">
            <RavyzButton
              onClick={handleConnect}
              loading={isConnecting}
              className="w-full bg-ravyz-blue hover:bg-ravyz-blue/90"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              {isConnecting ? 'Conectando...' : 'Conectar com LinkedIn'}
            </RavyzButton>
            
            <button
              onClick={onCancel}
              className="w-full text-sm text-ravyz-gray-500 hover:text-ravyz-gray-700 transition-colors"
            >
              Continuar sem LinkedIn
            </button>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (step === 'importing') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto bg-ravyz-blue/10 rounded-xl flex items-center justify-center mb-4"
        >
          <Linkedin className="w-8 h-8 text-ravyz-blue" />
        </motion.div>
        
        <h3 className="font-medium text-ravyz-black mb-2">
          Importando do LinkedIn...
        </h3>
        <p className="text-sm text-ravyz-gray-500 mb-6">
          Estamos buscando suas informações profissionais
        </p>

        <div className="space-y-2 text-left max-w-xs mx-auto">
          {[
            "Conectando com sua conta",
            "Buscando histórico profissional",
            "Importando habilidades",
            "Finalizando importação"
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.4, duration: 0.5 }}
              className="flex items-center gap-2 text-sm text-ravyz-gray-600"
            >
              <div className="w-2 h-2 bg-ravyz-blue rounded-full"></div>
              {step}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (step === 'preview') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center bg-ravyz-green/10 p-4 rounded-xl border border-ravyz-green/20">
          <Check className="w-8 h-8 text-ravyz-green mx-auto mb-2" />
          <h3 className="font-medium text-ravyz-green mb-1">
            Dados Importados com Sucesso!
          </h3>
          <p className="text-sm text-ravyz-gray-600">
            Encontramos seu perfil completo no LinkedIn
          </p>
        </div>

        <Card className="p-4">
          <h4 className="font-medium text-ravyz-black mb-3">Preview dos Dados</h4>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-ravyz-gray-500 block mb-1">Experiência:</span>
              <p className="text-ravyz-black">8 anos • Big Tech, Automotive</p>
            </div>
            
            <div>
              <span className="text-ravyz-gray-500 block mb-1">Última posição:</span>
              <p className="text-ravyz-black">Senior Software Engineer na Meta</p>
            </div>
            
            <div>
              <span className="text-ravyz-gray-500 block mb-1">Principais skills:</span>
              <p className="text-ravyz-black">React, JavaScript, Product Strategy, AI/ML</p>
            </div>
            
            <div>
              <span className="text-ravyz-gray-500 block mb-1">Formação:</span>
              <p className="text-ravyz-black">Stanford University, MIT</p>
            </div>
          </div>
        </Card>

        <div className="bg-ravyz-orange/10 p-4 rounded-xl">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-ravyz-orange mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-ravyz-orange font-medium mb-1">Revise os dados</p>
              <p className="text-ravyz-gray-700">
                Você poderá editar todas as informações na próxima etapa
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <RavyzButton
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </RavyzButton>
          
          <RavyzButton
            onClick={handleConfirmImport}
            className="flex-1"
          >
            Confirmar Importação
            <ArrowRight className="w-4 h-4 ml-2" />
          </RavyzButton>
        </div>
      </motion.div>
    );
  }

  return null;
}