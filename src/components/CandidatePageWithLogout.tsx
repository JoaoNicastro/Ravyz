import { useState } from "react";
import { motion } from "motion/react";
import { LogOut, User, Settings, Bell, Search, Download } from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { UserProfileHeader } from "./UserProfileHeader";
import { CandidatePage } from "./CandidatePage";

interface CandidatePageWithLogoutProps {
  candidateData?: any;
  onBack: () => void;
  onLogout?: () => void;
  onNavigateToMatching?: () => void;
  onNavigateToFeedback?: () => void;
  onNavigateToSalary?: () => void;
}

export function CandidatePageWithLogout({ 
  candidateData, 
  onBack, 
  onLogout,
  onNavigateToMatching,
  onNavigateToFeedback,
  onNavigateToSalary
}: CandidatePageWithLogoutProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <RavyzLogo size="sm" variant="compact" />
            <div className="hidden sm:block h-6 w-px bg-gray-300" />
            <div className="hidden sm:block">
              <h1 className="font-semibold text-gray-900">Painel do Candidato</h1>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar vagas, empresas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* User Profile Header */}
            <div className="hidden sm:block">
              <UserProfileHeader 
                userData={candidateData} 
                showMentor={true} 
                compact={true}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Bell className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Settings className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Download className="w-4 h-4" />
              </Button>

              {/* Logout Button */}
              {onLogout && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile User Profile */}
        <div className="sm:hidden mt-4">
          <UserProfileHeader 
            userData={candidateData} 
            showMentor={true} 
            compact={true}
          />
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar vagas, empresas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <CandidatePage 
          candidateData={candidateData}
          onBack={onBack}
          onLogout={onLogout}
          onNavigateToMatching={onNavigateToMatching}
          onNavigateToFeedback={onNavigateToFeedback}
          onNavigateToSalary={onNavigateToSalary}
        />
      </div>
    </div>
  );
}