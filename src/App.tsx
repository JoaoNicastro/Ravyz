import { useState, useEffect } from "react";
import { motion } from "motion/react";

import { CandidateAvatarSelection } from "./components/CandidateAvatarSelection";
import { QuestionnaireMethodSelection } from "./components/QuestionnaireMethodSelection";
import { AIWritingChat } from "./components/AIWritingChat";
import { AIConversationChat } from "./components/AIConversationChat";
import { DreamJobBuilder } from "./components/DreamJobBuilder";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { JobBuilder } from "./components/JobBuilder";
import { CandidateRecommendations } from "./components/CandidateRecommendations";
import { MatchingPage } from "./components/MatchingPage";
import { CompanyDashboard } from "./components/CompanyDashboard";
import { CandidatePageWithLogout } from "./components/CandidatePageWithLogout";
import { LoginSelection } from "./components/LoginSelection";
import { Login } from "./components/Login";
import { CandidateFeedback } from "./components/CandidateFeedback";
import { ProfessionalAssessment } from "./components/ProfessionalAssessment";
import { SalaryBenchmarking } from "./components/SalaryBenchmarking";
import { PurposeSelection } from "./components/PurposeSelection";
import { BasicRegistration } from "./components/BasicRegistration";
import { DevNavigation } from "./components/DevNavigation";
import { FloatingHomeButton } from "./components/FloatingHomeButton";

type AppState = 
  | "login-selection"
  | "login"
  | "purpose-selection"
  | "basic-registration"
  | "candidate-registration"
  | "questionnaire-method-selection"
  | "professional-assessment"
  | "ai-writing-chat"
  | "ai-conversation-chat"
  | "dream-job-builder"
  | "candidate-page"
  | "job-builder"
  | "candidate-recommendations"
  | "matching-page"
  | "company-dashboard"
  | "candidate-feedback"
  | "salary-benchmarking";

interface UserData {
  email: string;
  password: string;
  userType: string;
  document?: string; // CPF ou CNPJ
  linkedinConnected?: boolean;
  linkedinData?: any;
  extractedData?: any;
  mentor?: {
    name: string;
    avatar: string;
    color: string;
    category: string;
    description?: string;
    specialties?: string[];
    personality?: string;
  };
  questionnaireMethod?: 'manual' | 'ai-writing' | 'ai-conversation';
  dreamJob?: any;
  professionalProfile?: {
    primaryProfile: string;
    secondaryProfile: string;
    profileType: string;
    assessmentScore?: number;
    detailedResults?: any;
  };
  personalityProfile?: any;
  salaryData?: {
    currentSalary?: number;
    expectedMin?: number;
    expectedMax?: number;
    benchmarkData?: any;
  };
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>("login-selection");

  const [userData, setUserData] = useState<UserData | null>(null);
  const [jobData, setJobData] = useState<any>(null);
  const [registrationData, setRegistrationData] = useState<{
    email: string;
    password: string;
    document: string;
    userType: 'candidate' | 'company';
  } | null>(null);
  
  // Monitor de mudanças de estado
  useEffect(() => {
    console.log("📱 App - Estado mudou para:", currentState);
    console.log("🔍 App - Timestamp:", new Date().toLocaleTimeString());
  }, [currentState]);

  const handleBasicRegistrationComplete = (data: any) => {
    setRegistrationData(data);
    
    if (data.userType === 'candidate') {
      setCurrentState("candidate-registration");
    } else {
      setCurrentState("job-builder");
    }
  };

  const handleAvatarSelection = (data: any) => {
    const initialUserData: UserData = {
      email: registrationData?.email || 'temp@ravyz.com',
      password: registrationData?.password || 'temp123',
      userType: registrationData?.userType || 'candidate',
      document: registrationData?.document,
      linkedinConnected: false,
      mentor: {
        name: data.selectedAvatar.name,
        avatar: data.selectedAvatar.avatar,
        color: data.selectedAvatar.color,
        category: "mentor",
        description: data.selectedAvatar.description,
        specialties: ["Mentoria", "Orientação de Carreira"],
        personality: data.selectedAvatar.description
      },
      extractedData: data
    };
    
    setUserData(initialUserData);
    setCurrentState("questionnaire-method-selection");
  };

  const handleMethodSelection = (method: 'manual' | 'ai-writing' | 'ai-conversation') => {
    if (userData) {
      const updatedUserData = { ...userData, questionnaireMethod: method };
      setUserData(updatedUserData);
    }
    
    // Redirecionar baseado no método selecionado
    switch (method) {
      case 'manual':
        setCurrentState("professional-assessment");
        break;
      case 'ai-writing':
        setCurrentState("ai-writing-chat");
        break;
      case 'ai-conversation':
        setCurrentState("ai-conversation-chat");
        break;
    }
  };

  // Removido handleMentorComplete pois o mentor já é selecionado na primeira etapa

  const handleAssessmentComplete = (assessmentData: any) => {
    if (userData) {
      const updatedUserData = { 
        ...userData, 
        professionalProfile: {
          primaryProfile: assessmentData.primaryProfile || "Líder Estratégico",
          secondaryProfile: assessmentData.secondaryProfile || "Inovador Criativo",
          profileType: assessmentData.profileType || "leadership",
          assessmentScore: assessmentData.score || assessmentData.assessmentScore,
          detailedResults: assessmentData
        },
        personalityProfile: assessmentData.personalityProfile,
        // Para métodos de IA, adicionar dados mock do dream job já que as perguntas cobrem tudo
        ...(userData.questionnaireMethod !== 'manual' && {
          dreamJob: {
            position: assessmentData.preferredRole || "Especialista em " + (assessmentData.primaryProfile || "Liderança"),
            industry: assessmentData.preferredIndustry || "Tecnologia",
            workModel: assessmentData.workPreference || "Híbrido",
            location: assessmentData.preferredLocation || "São Paulo",
            salaryRange: assessmentData.salaryExpectation || { min: 8000, max: 15000 },
            benefits: assessmentData.desiredBenefits || ["Vale Refeição", "Plano de Saúde", "Home Office"],
            companySize: assessmentData.companySizePreference || "Média",
            culture: assessmentData.culturePreference || "Inovadora e colaborativa"
          }
        })
      };
      setUserData(updatedUserData);
    }
    
    // Se é método manual, vai para dream-job-builder
    // Se é método de IA, vai direto para candidate-page
    if (userData?.questionnaireMethod === 'manual') {
      setCurrentState("dream-job-builder");
    } else {
      setCurrentState("candidate-page");
    }
  };

  const handleDreamJobComplete = (dreamJobData: any) => {
    if (userData) {
      const updatedUserData = { ...userData, dreamJob: dreamJobData };
      setUserData(updatedUserData);
    } else {
      const basicUserData: UserData = {
        email: 'test@test.com',
        password: 'test123',
        userType: 'candidate',
        dreamJob: dreamJobData
      };
      setUserData(basicUserData);
    }
    
    setCurrentState("candidate-page");
  };

  const handleJobBuilderComplete = (data: any) => {
    setJobData(data);
    setCurrentState("candidate-recommendations");
  };

  const handleCandidateContact = (candidate: any) => {
    console.log("Contato com candidato:", candidate);
  };

  const handleLoginSuccess = (loginUserData: any) => {
    const mappedUserData: UserData = {
      email: loginUserData.email,
      password: loginUserData.password,
      userType: loginUserData.profileType === 'candidate' ? 'candidate' : 'company',
      linkedinConnected: true,
      linkedinData: {
        name: loginUserData.name,
        title: loginUserData.dreamJob?.position || "Profissional",
        company: loginUserData.companyName || "Empresa"
      },
      mentor: loginUserData.mentor || {
        name: "Alex",
        avatar: "🎯",
        color: "ravyz-orange",
        category: "mentor",
        personality: "Mentor experiente e motivador"
      },
      dreamJob: loginUserData.dreamJob,
      professionalProfile: {
        primaryProfile: "Líder Estratégico",
        secondaryProfile: "Inovador Criativo",
        profileType: "leadership",
        assessmentScore: 92
      },
      personalityProfile: loginUserData.personalityProfile,
      salaryData: {
        currentSalary: loginUserData.currentSalary,
        expectedMin: loginUserData.dreamJob?.salaryRange?.min,
        expectedMax: loginUserData.dreamJob?.salaryRange?.max
      },
      extractedData: loginUserData
    };
    
    setUserData(mappedUserData);
    
    if (loginUserData.profileType === 'company') {
      setCurrentState("company-dashboard");
    } else {
      setCurrentState("candidate-page");
    }
  };

  const handleLogout = () => {
    setUserData(null);
    setJobData(null);
    setRegistrationData(null);
    setCurrentState("login-selection");
  };

  // Função utilitária para voltar à tela principal facilmente
  const goToMainScreen = () => {
    setCurrentState("login-selection");
  };

  const handlePurposeSelect = (purpose: 'candidate' | 'company') => {
    setCurrentState("basic-registration");
    // Temporariamente armazenar o tipo de usuário para o BasicRegistration
    setRegistrationData(prev => ({ 
      email: '', 
      password: '', 
      document: '', 
      userType: purpose 
    }));
  };

  const renderCurrentScreen = () => {
    switch (currentState) {
      case "login-selection":
        return (
          <LoginSelection
            onSelectLogin={() => setCurrentState("login")}
            onSelectRegister={() => setCurrentState("purpose-selection")}
          />
        );

      case "login":
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setCurrentState("login-selection")}
          />
        );

      case "purpose-selection":
        return (
          <PurposeSelection
            onSelect={handlePurposeSelect}
            onBack={() => setCurrentState("login-selection")}
          />
        );

      case "basic-registration":
        return (
          <BasicRegistration
            userType={registrationData?.userType || 'candidate'}
            onComplete={handleBasicRegistrationComplete}
            onBack={() => setCurrentState("purpose-selection")}
          />
        );

      case "candidate-registration":
        return (
          <CandidateAvatarSelection
            onComplete={handleAvatarSelection}
            onBack={() => setCurrentState("basic-registration")}
          />
        );

      case "questionnaire-method-selection":
        return (
          <QuestionnaireMethodSelection
            onMethodSelect={handleMethodSelection}
            onBack={() => setCurrentState("candidate-registration")}
            mentorData={userData?.mentor}
          />
        );

      case "professional-assessment":
        return (
          <ProfessionalAssessment
            onComplete={handleAssessmentComplete}
            onBack={() => setCurrentState("questionnaire-method-selection")}
            mentorData={userData?.mentor}
            selectedMethod={userData?.questionnaireMethod}
          />
        );

      case "ai-writing-chat":
        return (
          <AIWritingChat
            onComplete={handleAssessmentComplete}
            onBack={() => setCurrentState("questionnaire-method-selection")}
            mentorData={userData?.mentor}
          />
        );

      case "ai-conversation-chat":
        return (
          <AIConversationChat
            onComplete={handleAssessmentComplete}
            onBack={() => setCurrentState("questionnaire-method-selection")}
            mentorData={userData?.mentor}
          />
        );

      case "dream-job-builder":
        return (
          <DreamJobBuilder
            onComplete={handleDreamJobComplete}
            onBack={() => setCurrentState("professional-assessment")}
          />
        );

      case "candidate-page":
        return (
          <CandidatePageWithLogout
            candidateData={userData}
            onBack={() => {
              // Se veio de método manual, volta para dream-job-builder
              // Se veio de IA, volta para method selection
              if (userData?.questionnaireMethod === 'manual') {
                setCurrentState("dream-job-builder");
              } else {
                setCurrentState("questionnaire-method-selection");
              }
            }}
            onLogout={handleLogout}
            onNavigateToMatching={() => setCurrentState("matching-page")}
            onNavigateToFeedback={() => setCurrentState("candidate-feedback")}
            onNavigateToSalary={() => setCurrentState("salary-benchmarking")}
          />
        );

      case "job-builder":
        return (
          <JobBuilder
            onComplete={handleJobBuilderComplete}
            onBack={() => setCurrentState("basic-registration")}
          />
        );

      case "candidate-recommendations":
        return (
          <CandidateRecommendations
            jobData={jobData}
            onBack={() => setCurrentState("job-builder")}
            onContactCandidate={handleCandidateContact}
          />
        );

      case "matching-page":
        return (
          <MatchingPage
            onBack={() => setCurrentState("candidate-page")}
          />
        );

      case "company-dashboard":
        return (
          <CompanyDashboard
            onBack={() => setCurrentState("login-selection")}
            onLogout={handleLogout}
          />
        );

      case "candidate-feedback":
        return (
          <CandidateFeedback
            candidateData={userData}
          />
        );

      case "salary-benchmarking":
        return (
          <SalaryBenchmarking
            currentPosition={userData?.dreamJob?.position || "Product Manager"}
            currentLevel="Sênior"
            currentIndustry="Tecnologia"
            currentLocation="São Paulo"
            currentSalary={userData?.salaryData?.currentSalary}
            selectedMin={userData?.dreamJob?.salaryRange?.min}
            selectedMax={userData?.dreamJob?.salaryRange?.max}
            onSuggestionApply={(min: number, max: number) => {
              if (userData) {
                const updatedUserData = {
                  ...userData,
                  dreamJob: {
                    ...userData.dreamJob,
                    salaryRange: { min, max }
                  },
                  salaryData: {
                    ...userData.salaryData,
                    expectedMin: min,
                    expectedMax: max
                  }
                };
                setUserData(updatedUserData);
              }
            }}
          />
        );

      default:
        console.warn("⚠️ Estado não reconhecido:", currentState);
        console.log("🔄 Usando LoginSelection como fallback");
        
        return (
          <LoginSelection
            onSelectLogin={() => setCurrentState("login")}
            onSelectRegister={() => setCurrentState("purpose-selection")}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50"
      >
        {renderCurrentScreen()}
        
        {/* Botão Home flutuante - aparece em telas específicas */}
        <FloatingHomeButton 
          onGoHome={goToMainScreen}
          show={currentState !== "login-selection"}
        />
        
        {/* Developer Navigation - só aparece em desenvolvimento */}
        <DevNavigation
          currentState={currentState}
          onNavigate={(state) => setCurrentState(state as AppState)}
          onGoHome={goToMainScreen}
        />
      </motion.div>
    </ErrorBoundary>
  );
}