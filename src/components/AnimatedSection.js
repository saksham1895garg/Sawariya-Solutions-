'use client';

import { motion } from 'framer-motion';

export default function AnimatedSection({
  children,
  className = '',
  style = {},
  delay = 0,
  duration = 0.6,
  yOffset = 40,
  xOffset = 0,
  scale = 1,
  direction = 'up', // 'up', 'down', 'left', 'right', 'fade', 'scale'
}) {
  let initial = { opacity: 0 };
  let animate = { opacity: 1 };

  if (direction === 'up') {
    initial.y = yOffset;
    animate.y = 0;
  } else if (direction === 'down') {
    initial.y = -yOffset;
    animate.y = 0;
  } else if (direction === 'left') {
    initial.x = xOffset || 40;
    animate.x = 0;
  } else if (direction === 'right') {
    initial.x = -(xOffset || 40);
    animate.x = 0;
  } else if (direction === 'scale') {
    initial.scale = scale;
    animate.scale = 1;
  }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

