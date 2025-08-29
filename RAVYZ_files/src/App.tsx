import { useState } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { ProfileSelection } from "./components/ProfileSelection";
import { JobsDemo } from "./components/JobsDemo";
import { UserRegistration } from "./components/UserRegistration";
import { DreamJobBuilder } from "./components/DreamJobBuilder";
import { MatchingPage } from "./components/MatchingPage";
import { JobBuilder } from "./components/JobBuilder";
import { CandidateRecommendations } from "./components/CandidateRecommendations";
import { CandidatePage } from "./components/CandidatePage";
import { CompanyDashboard } from "./components/CompanyDashboard";
import { CompanyInsights } from "./components/CompanyInsights";
import { RavyzLogo } from "./components/RavyzLogo";
import { register, login } from "./lib/auth";
import { updateCandidateMe, updateCompanyMe } from "./lib/profile";
import { createJob } from "./lib/jobs";


type AppScreen = 'splash' | 'profile-selection' | 'user-registration' | 'dream-job-builder' | 'matching-page' | 'candidate-demo' | 'candidate-page' | 'company-dashboard' | 'company-insights' | 'job-builder' | 'candidate-recommendations';
type ProfileType = 'candidate' | 'company';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [dreamJobData, setDreamJobData] = useState<any>(null);
  const [matchingData, setMatchingData] = useState<any>(null);
  const [jobData, setJobData] = useState<any>(null);

  const handleSplashComplete = () => {
    setCurrentScreen('profile-selection');
  };

  const handleProfileSelection = (type: ProfileType) => {
    setSelectedProfile(type);
    if (type === 'candidate') {
      setCurrentScreen('user-registration');
    } else {
      setCurrentScreen('company-dashboard');
    }
  };

  const handleBackToProfileSelection = () => {
    setCurrentScreen('profile-selection');
    setSelectedProfile(null);
  };

  const handleRegistrationComplete = async (registrationData: any) => {
  try {
    const role = selectedProfile === "company" ? "EMPLOYER" : "CANDIDATE";
    await register(registrationData.email, registrationData.password, role);
    await login(registrationData.email, registrationData.password);
    setUserData(registrationData);
    setCurrentScreen(role === "EMPLOYER" ? "company-dashboard" : "dream-job-builder");
  } catch (e:any) {
    alert("Erro no cadastro/login: " + (e.message || e));
  }
};



  const handleDreamJobComplete = (dreamJobDataReceived: any) => {
    console.log('Cargo dos sonhos:', dreamJobDataReceived);
    setDreamJobData(dreamJobDataReceived);
    setCurrentScreen('matching-page');
  };

  const handleMatchingComplete = async (matchingDataReceived: any) => {
  try {
    setMatchingData(matchingDataReceived);
    const completeUserData = { ...userData, dreamJob: dreamJobData, matching: matchingDataReceived };
    setUserData(completeUserData);

    const skills =
      matchingDataReceived?.topSkills ||
      userData?.skills ||
      userData?.extractedData?.skills || [];

    await updateCandidateMe({
      fullName: userData?.fullName || userData?.name || "Candidate",
      location: userData?.location,
      skills
    });

    setCurrentScreen("candidate-page");
  } catch (e:any) {
    alert("Erro ao salvar perfil do candidato: " + (e.message || e));
  }
};



  const handleBackToDreamJob = () => {
    setCurrentScreen('dream-job-builder');
  };

  const handleBackToMatching = () => {
    setCurrentScreen('matching-page');
  };

  const handleViewCandidateProfile = () => {
    setCurrentScreen('candidate-page');
  };

  const handleCreateJob = () => {
    setCurrentScreen('job-builder');
  };

  const handleViewInsights = () => {
    setCurrentScreen('company-insights');
  };

  const handleJobCreationComplete = async (createdJobData: any) => {
  try {
    await updateCompanyMe({
      name: createdJobData?.companyName || "Company",
      website: createdJobData?.companyWebsite,
      about: createdJobData?.companyAbout,
      location: createdJobData?.companyLocation
    });

    await createJob({
      title: createdJobData.title,
      description: createdJobData.description,
      location: createdJobData.location,
      employment: createdJobData.employment,
      requirements: createdJobData.requirements || createdJobData.skills || []
    });

    setJobData(createdJobData);
    setCurrentScreen("candidate-recommendations");
  } catch (e:any) {
    alert("Erro ao criar vaga: " + (e.message || e));
  }
};



  const handleBackToJobBuilder = () => {
    setCurrentScreen('job-builder');
  };

  const handleBackToCompanyDashboard = () => {
    setCurrentScreen('company-dashboard');
  };

  const handleContactCandidate = (candidate: any) => {
    console.log('Entrar em contato com candidato:', candidate);
    // Aqui poderia abrir um modal de contato ou enviar email
    alert(`Entrando em contato com ${candidate.name}...`);
  };

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;
    
    case 'profile-selection':
      return <ProfileSelection onSelectProfile={handleProfileSelection} />;
    
    case 'user-registration':
      return (
        <UserRegistration 
          onComplete={handleRegistrationComplete}
          onBack={handleBackToProfileSelection}
        />
      );
    
    case 'dream-job-builder':
      return (
        <DreamJobBuilder 
          onComplete={handleDreamJobComplete}
          onBack={handleBackToProfileSelection}
          userProfile={userData?.professionalAssessment ? {
            primaryProfile: userData.professionalAssessment.primaryProfile,
            secondaryProfile: userData.professionalAssessment.secondaryProfile
          } : undefined}
          userData={{
            linkedinConnected: userData?.linkedinConnected || false,
            linkedinData: userData?.linkedinData,
            extractedData: userData?.extractedData
          }}
        />
      );
    
    case 'matching-page':
      return (
        <MatchingPage
          dreamJobData={dreamJobData}
          userData={userData}
          onComplete={handleMatchingComplete}
          onBack={handleBackToDreamJob}
        />
      );
    
    case 'candidate-demo':
      return <JobsDemo onBack={handleBackToMatching} onViewProfile={handleViewCandidateProfile} userProfile={userData} />;
    
    case 'candidate-page':
      return <CandidatePage candidateData={userData} onBack={handleBackToMatching} />;
    
    case 'company-dashboard':
      return (
        <CompanyDashboard 
          onCreateJob={handleCreateJob}
          onViewInsights={handleViewInsights}
          onBack={handleBackToProfileSelection}
          companyData={null}
        />
      );
    
    case 'company-insights':
      return (
        <CompanyInsights 
          onBack={handleBackToCompanyDashboard}
          companyData={null}
        />
      );
    
    case 'job-builder':
      return (
        <JobBuilder 
          onComplete={handleJobCreationComplete}
          onBack={handleBackToCompanyDashboard}
        />
      );
    
    case 'candidate-recommendations':
      return (
        <CandidateRecommendations 
          jobData={jobData}
          onBack={handleBackToJobBuilder}
          onContactCandidate={handleContactCandidate}
        />
      );
    
    default:
      return <SplashScreen onComplete={handleSplashComplete} />;
  }
}