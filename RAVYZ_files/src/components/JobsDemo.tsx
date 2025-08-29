import { useState } from "react";
import { motion } from "motion/react";
import { Search, Filter, Heart, X, MapPin, ArrowLeft, User } from "lucide-react";
import { RavyzLogo } from "./RavyzLogo";
import { MatchCard } from "./MatchCard";
import { FilterChipGroup } from "./FilterChip";
import { RavyzButton } from "./RavyzButton";
import { Input } from "./ui/input";

export type JobsDemoProps = {
  onBack: () => void;
  onViewProfile: () => void;
  userProfile?: any;     
};

export function JobsDemo({ onBack, onViewProfile }: JobsDemoProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterOptions = [
    { id: "remote", label: "Remoto" },
    { id: "senior", label: "Sênior" },
    { id: "junior", label: "Júnior" },
    { id: "startup", label: "Startup" },
    { id: "tech", label: "Tecnologia" },
    { id: "design", label: "Design" },
    { id: "marketing", label: "Marketing" },
    { id: "sales", label: "Vendas" },
  ];

  const jobs = [
    {
      id: 1,
      title: "Desenvolvedor Frontend React",
      company: "TechCorp",
      location: "São Paulo, SP",
      salary: "R$ 8.000 - R$ 12.000",
      fitPercentage: 92,
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      postedDate: "2 dias atrás"
    },
    {
      id: 2,
      title: "UX/UI Designer Sênior",
      company: "Design Studio",
      location: "Rio de Janeiro, RJ",
      salary: "R$ 7.000 - R$ 10.000",
      fitPercentage: 85,
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      postedDate: "1 dia atrás"
    },
    {
      id: 3,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remoto",
      salary: "R$ 10.000 - R$ 15.000",
      fitPercentage: 78,
      skills: ["Agile", "Product Strategy", "Analytics", "Leadership"],
      postedDate: "3 dias atrás"
    },
    {
      id: 4,
      title: "Desenvolvedor Backend Java",
      company: "Enterprise Corp",
      location: "Belo Horizonte, MG",
      salary: "R$ 9.000 - R$ 13.000",
      fitPercentage: 72,
      skills: ["Java", "Spring Boot", "MySQL", "AWS"],
      postedDate: "5 dias atrás"
    },
    {
      id: 5,
      title: "Data Scientist",
      company: "AI Company",
      location: "São Paulo, SP",
      salary: "R$ 12.000 - R$ 18.000",
      fitPercentage: 65,
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      postedDate: "1 semana atrás"
    }
  ];

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const chipsData = filterOptions.map(option => ({
    ...option,
    selected: selectedFilters.includes(option.id)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-ravyz-gray-200/10 via-white to-ravyz-blue/5">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-ravyz-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl lg:max-w-6xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-ravyz-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-ravyz-gray-700" />
            </button>
            <div className="flex-1 flex items-center gap-3">
              <RavyzLogo size="sm" variant="compact" />
              <div className="border-l border-gray-300 pl-3">
                <h1 className="font-bold text-ravyz-black">Vagas para Você</h1>
                <p className="text-sm text-ravyz-gray-500">{jobs.length} oportunidades</p>
              </div>
            </div>
            <button 
              onClick={onViewProfile}
              className="p-2 hover:bg-ravyz-purple/10 rounded-lg transition-colors group"
              title="Ver perfil completo"
            >
              <User className="w-5 h-5 text-ravyz-purple" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ravyz-gray-500" />
            <Input
              placeholder="Buscar vagas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 h-12 border-ravyz-gray-200 focus:border-ravyz-orange"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-ravyz-gray-200 rounded transition-colors"
            >
              <Filter className="w-4 h-4 text-ravyz-gray-500" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <FilterChipGroup
                chips={chipsData}
                onChipToggle={handleFilterToggle}
                className="mb-3"
              />
              {selectedFilters.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ravyz-gray-500">
                    {selectedFilters.length} filtro(s) aplicado(s)
                  </span>
                  <button
                    onClick={() => setSelectedFilters([])}
                    className="text-sm text-ravyz-orange hover:text-ravyz-orange/80"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Job List */}
      <div className="max-w-2xl lg:max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <MatchCard
                type="job"
                title={job.title}
                company={job.company}
                location={job.location}
                salary={job.salary}
                fitPercentage={job.fitPercentage}
                skills={job.skills}
                postedDate={job.postedDate}
                onClick={() => {
                  // Handle job click
                  console.log("Clicked job:", job.title);
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-ravyz-gray-200 p-4 lg:p-6 shadow-xl">
        <div className="max-w-2xl lg:max-w-6xl mx-auto flex gap-3 lg:gap-4">
          <RavyzButton
            variant="outline"
            className="flex-1"
            onClick={() => {
              // Handle skip
              console.log("Skip");
            }}
          >
            <X className="w-4 h-4 mr-2" />
            Pular
          </RavyzButton>
          <RavyzButton
            variant="primary"
            className="flex-1"
            onClick={() => {
              // Handle apply
              console.log("Apply");
            }}
          >
            <Heart className="w-4 h-4 mr-2" />
            Candidatar
          </RavyzButton>
        </div>
      </div>
    </div>
  );
}