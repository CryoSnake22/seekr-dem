import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- Particle Drift Effect ---
export const BackgroundEffects: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Soft Animated Gradient - Top Center */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 blur-[120px] rounded-full"
      />
      
      {/* Secondary Gradient - Bottom Left */}
      <div className="absolute top-[40%] -left-[10%] w-[600px] h-[500px] bg-neutral-800/20 blur-[100px] rounded-full" />
      
      {/* Particles */}
      <div className="absolute inset-0 w-full h-full">
         {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/20 rounded-full"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5
              }}
            />
         ))}
      </div>
    </div>
  );
};

// --- Grid Shimmer Effect ---
export const GridPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
    </div>
  );
};

// --- Button Hover Beam ---
export const ButtonBeam: React.FC = () => (
  <span className="absolute inset-0 overflow-hidden rounded-md">
    <span className="absolute top-0 left-0 h-full w-[20px] -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
  </span>
);

// --- Cursor Proximity Glow Card ---
// Simplified for performance: standard hover glow
export const GlowCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 0 20px rgba(16, 185, 129, 0.1)" }}
      className={`glass-card relative overflow-hidden rounded-xl p-6 transition-all duration-300 group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export const BeamTexture: React.FC = () => (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-30">
        <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent opacity-20" />
        <div className="absolute top-0 right-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent opacity-20" />
        <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-20" />
    </div>
)
