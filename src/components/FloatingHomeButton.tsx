import { motion } from "motion/react";
import { Home } from "lucide-react";
import { Button } from "./ui/button";

interface FloatingHomeButtonProps {
  onGoHome: () => void;
  show?: boolean;
}

export function FloatingHomeButton({ onGoHome, show = true }: FloatingHomeButtonProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="fixed top-4 left-4 z-40"
    >
      <Button
        onClick={onGoHome}
        size="sm"
        className="bg-ravyz-orange hover:bg-orange-600 text-white shadow-lg rounded-full w-12 h-12 p-0"
        title="Voltar à tela principal"
      >
        <Home className="w-5 h-5" />
      </Button>
    </motion.div>
  );
}