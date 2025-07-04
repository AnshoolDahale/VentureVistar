import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CounterContainer = styled(motion.div)`
  font-size: ${props => props.fontSize || '2rem'};
  font-weight: 700;
  color: ${props => props.color || '#2D3748'};
  text-align: center;
  padding: 1rem;
`;

const CounterLabel = styled.div`
  font-size: 0.9rem;
  color: #718096;
  margin-top: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AnimatedCounter = ({ 
  end, 
  duration = 2, 
  label, 
  prefix = '', 
  suffix = '',
  fontSize,
  color,
  delay = 0 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const increment = end / (duration * 60); // 60 FPS
      const interval = setInterval(() => {
        setCount(prevCount => {
          const newCount = prevCount + increment;
          if (newCount >= end) {
            clearInterval(interval);
            return end;
          }
          return newCount;
        });
      }, 1000 / 60);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [end, duration, isVisible, delay]);

  return (
    <CounterContainer
      fontSize={fontSize}
      color={color}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay }}
      onViewportEnter={() => setIsVisible(true)}
      viewport={{ once: true }}
    >
      <motion.div
        key={count}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {prefix}{Math.floor(count)}{suffix}
      </motion.div>
      {label && <CounterLabel>{label}</CounterLabel>}
    </CounterContainer>
  );
};

export default AnimatedCounter;