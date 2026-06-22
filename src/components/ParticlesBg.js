'use client';

import { motion } from 'framer-motion';

export default function ParticlesBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Glow Orb 1 */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -120, 60, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 'clamp(300px, 40vw, 500px)',
          height: 'clamp(300px, 40vw, 500px)',
          borderRadius: '50%',
          background: 'rgba(0, 74, 173, 0.05)',
          filter: 'blur(100px)',
        }}
      />
      {/* Glow Orb 2 */}
      <motion.div
        animate={{
          x: [0, -100, 60, 0],
          y: [0, 150, -80, 0],
          scale: [0.95, 1.1, 0.95, 0.95],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '40%',
          left: '-10%',
          width: 'clamp(350px, 45vw, 600px)',
          height: 'clamp(350px, 45vw, 600px)',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.04)',
          filter: 'blur(120px)',
        }}
      />
      {/* Glow Orb 3 */}
      <motion.div
        animate={{
          x: [0, 120, -60, 0],
          y: [0, -80, 100, 0],
          scale: [1.1, 0.9, 1.1, 1.1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '15%',
          width: 'clamp(280px, 35vw, 450px)',
          height: 'clamp(280px, 35vw, 450px)',
          borderRadius: '50%',
          background: 'rgba(37, 99, 235, 0.05)',
          filter: 'blur(90px)',
        }}
      />
    </div>
  );
}
