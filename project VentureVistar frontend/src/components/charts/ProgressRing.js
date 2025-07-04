import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SVGContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #2D3748;
  font-weight: 600;
`;

const ProgressValue = styled.div`
  font-size: 1.5rem;
  line-height: 1.2;
`;

const ProgressLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.2rem;
`;

const ProgressRing = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8,
  color = '#4299E1',
  backgroundColor = '#E2E8F0',
  label,
  showPercentage = true,
  duration = 2,
  delay = 0
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const increment = percentage / (duration * 60); // 60 FPS
      const interval = setInterval(() => {
        setAnimatedPercentage(prevPercentage => {
          const newPercentage = prevPercentage + increment;
          if (newPercentage >= percentage) {
            clearInterval(interval);
            return percentage;
          }
          return newPercentage;
        });
      }, 1000 / 60);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [percentage, duration, isVisible, delay]);

  return (
    <SVGContainer>
      <motion.svg
        width={size}
        height={size}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay }}
        onViewportEnter={() => setIsVisible(true)}
        viewport={{ once: true }}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={{ duration: duration, delay: delay, ease: "easeOut" }}
        />
      </motion.svg>
      
      <ProgressText>
        {showPercentage && (
          <ProgressValue>{Math.round(animatedPercentage)}%</ProgressValue>
        )}
        {label && <ProgressLabel>{label}</ProgressLabel>}
      </ProgressText>
    </SVGContainer>
  );
};

export default ProgressRing;