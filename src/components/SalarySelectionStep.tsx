import { motion } from "motion/react";
import { DollarSign } from "lucide-react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { JobSalaryReference } from "./JobSalaryReference";

interface SalarySelectionStepProps {
  dreamJob: {
    position: string;
    positionLevel: string;
    industry: string[];
    location: string[];
    workModel: string[];
    salaryRange: { min: number; max: number };
  };
  onSalaryUpdate: (min: number, max: number) => void;
}

export function SalarySelectionStep({ dreamJob, onSalaryUpdate }: SalarySelectionStepProps) {
  const handleSliderChange = (values: number[]) => {
    onSalaryUpdate(values[0], values[1]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-ravyz-orange/10 rounded-2xl flex items-center justify-center mb-6">
          <DollarSign className="w-8 h-8 text-ravyz-orange flex-shrink-0" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Faixa Salarial</h2>
        <p className="text-gray-600">Defina sua expectativa salarial baseada no mercado</p>
      </div>

      {/* Controles de Faixa Salarial */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sua Faixa Salarial Desejada</h3>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <Label className="text-sm text-gray-500">Mínimo</Label>
                <p className="text-2xl font-bold text-ravyz-green">
                  R$ {dreamJob.salaryRange.min.toLocaleString()}
                </p>
              </div>
              <div className="text-gray-400">-</div>
              <div className="text-center">
                <Label className="text-sm text-gray-500">Máximo</Label>
                <p className="text-2xl font-bold text-ravyz-blue">
                  R$ {dreamJob.salaryRange.max.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4">
            <Slider
              value={[dreamJob.salaryRange.min, dreamJob.salaryRange.max]}
              onValueChange={handleSliderChange}
              min={1000}
              max={50000}
              step={500}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>R$ 1.000</span>
              <span>R$ 50.000+</span>
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              💡 <strong>Dica:</strong> Use as referências de vagas abaixo para calibrar sua faixa salarial
            </p>
          </div>
        </div>
      </Card>

      {/* Referências de Vagas */}
      <JobSalaryReference
        position={dreamJob.position}
        level={dreamJob.positionLevel}
        industry={dreamJob.industry}
        location={dreamJob.location}
        workModel={dreamJob.workModel}
        onSalarySelect={onSalaryUpdate}
        selectedMin={dreamJob.salaryRange.min}
        selectedMax={dreamJob.salaryRange.max}
        showOnlyRelevant={true}
      />
    </motion.div>
  );
}