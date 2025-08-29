import { motion } from "motion/react";

interface RavyzLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'icon-only';
  className?: string;
  animated?: boolean;
}

export function RavyzLogo({ 
  size = 'md', 
  variant = 'full', 
  className = '',
  animated = false 
}: RavyzLogoProps) {
  
  const sizes = {
    sm: { width: 100, height: 32, fontSize: 20, iconSize: 24 },
    md: { width: 140, height: 40, fontSize: 24, iconSize: 28 },
    lg: { width: 180, height: 48, fontSize: 28, iconSize: 32 },
    xl: { width: 220, height: 56, fontSize: 32, iconSize: 36 }
  };

  const currentSize = sizes[size];

  if (variant === 'icon-only') {
    return (
      <motion.div 
        className={`inline-flex items-center justify-center ${className}`}
        initial={animated ? { scale: 0.8, opacity: 0 } : {}}
        animate={animated ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <svg 
          width={currentSize.iconSize} 
          height={currentSize.iconSize}
          viewBox="0 0 32 32" 
          className="drop-shadow-sm"
        >
          {/* Modern geometric R */}
          <path 
            d="M6 4h12c2.21 0 4 1.79 4 4v2c0 1.38-.56 2.63-1.46 3.54L24 17v2l-3.46-3.46C19.63 15.56 18.38 16 17 16h-5v8h-2V20h-2V4h2zm2 2v6h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8z" 
            fill="url(#iconGradient)" 
          />
          
          <defs>
            <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#6C4DFF" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div 
        className={`inline-flex items-center gap-2 ${className}`}
        initial={animated ? { x: -20, opacity: 0 } : {}}
        animate={animated ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <svg 
          width={currentSize.iconSize} 
          height={currentSize.iconSize}
          viewBox="0 0 32 32" 
          className="drop-shadow-sm"
        >
          <path 
            d="M6 4h12c2.21 0 4 1.79 4 4v2c0 1.38-.56 2.63-1.46 3.54L24 17v2l-3.46-3.46C19.63 15.56 18.38 16 17 16h-5v8h-2V20h-2V4h2zm2 2v6h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8z" 
            fill="url(#compactGradient)" 
          />
          
          <defs>
            <linearGradient id="compactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#6C4DFF" />
            </linearGradient>
          </defs>
        </svg>
        
        <span 
          className="font-bold text-gray-900 tracking-tight"
          style={{ fontSize: currentSize.fontSize }}
        >
          RAVYZ
        </span>
      </motion.div>
    );
  }

  // Full variant (default) - Professional and clean
  return (
    <motion.div 
      className={`inline-flex items-center gap-3 ${className}`}
      initial={animated ? { y: 20, opacity: 0 } : {}}
      animate={animated ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <svg 
        width={currentSize.iconSize} 
        height={currentSize.iconSize}
        viewBox="0 0 32 32" 
        className="drop-shadow-sm"
      >
        <path 
          d="M6 4h12c2.21 0 4 1.79 4 4v2c0 1.38-.56 2.63-1.46 3.54L24 17v2l-3.46-3.46C19.63 15.56 18.38 16 17 16h-5v8h-2V20h-2V4h2zm2 2v6h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8z" 
          fill="url(#fullGradient)" 
        />
        
        <defs>
          <linearGradient id="fullGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#6C4DFF" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="flex flex-col">
        <span 
          className="font-bold text-gray-900 tracking-tight leading-none"
          style={{ fontSize: currentSize.fontSize }}
        >
          RAVYZ
        </span>
        <span 
          className="text-gray-500 uppercase tracking-wider leading-none mt-0.5"
          style={{ fontSize: currentSize.fontSize * 0.32, letterSpacing: '0.1em' }}
        >
          Talent Matching
        </span>
      </div>
    </motion.div>
  );
}