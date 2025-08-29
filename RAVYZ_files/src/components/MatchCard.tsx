import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Building2, MapPin, DollarSign, Calendar, User } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MatchCardProps {
  type: 'job' | 'candidate';
  title: string;
  company?: string;
  location: string;
  salary?: string;
  fitPercentage: number;
  logo?: string;
  skills?: string[];
  experience?: string;
  postedDate?: string;
  onClick?: () => void;
}

export function MatchCard({
  type,
  title,
  company,
  location,
  salary,
  fitPercentage,
  logo,
  skills = [],
  experience,
  postedDate,
  onClick
}: MatchCardProps) {
  const getFitColor = (percentage: number) => {
    if (percentage >= 80) return "bg-ravyz-green";
    if (percentage >= 60) return "bg-ravyz-blue";
    if (percentage >= 40) return "bg-ravyz-orange";
    return "bg-ravyz-gray-500";
  };

  const getFitLabel = (percentage: number) => {
    if (percentage >= 80) return "Excelente Match";
    if (percentage >= 60) return "Bom Match";
    if (percentage >= 40) return "Match Moderado";
    return "Match Baixo";
  };

  return (
    <Card 
      className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-ravyz-gray-200 hover:border-ravyz-orange"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Logo/Avatar */}
        <div className="flex-shrink-0">
          {logo ? (
            <ImageWithFallback
              src={logo}
              alt={`${type === 'job' ? company : title} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-ravyz-gray-200 flex items-center justify-center">
              {type === 'job' ? (
                <Building2 className="w-6 h-6 text-ravyz-gray-500" />
              ) : (
                <User className="w-6 h-6 text-ravyz-gray-500" />
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-medium text-ravyz-black line-clamp-2">{title}</h3>
              {company && (
                <p className="text-sm text-ravyz-gray-500 mt-1">{company}</p>
              )}
            </div>
            
            {/* Fit Percentage */}
            <div className="flex-shrink-0 text-right">
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getFitColor(fitPercentage)}`}>
                {fitPercentage}% Match
              </div>
              <p className="text-xs text-ravyz-gray-500 mt-1">{getFitLabel(fitPercentage)}</p>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-ravyz-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            
            {salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{salary}</span>
              </div>
            )}
            
            {experience && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{experience}</span>
              </div>
            )}
            
            {postedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{postedDate}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-ravyz-gray-200 text-ravyz-gray-700 hover:bg-ravyz-orange hover:text-white transition-colors"
                >
                  {skill}
                </Badge>
              ))}
              {skills.length > 3 && (
                <Badge 
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-ravyz-gray-200 text-ravyz-gray-500"
                >
                  +{skills.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}