import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const GlassCardContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: ${props => props.padding || '2rem'};
  margin: ${props => props.margin || '0'};
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
  }
`;

const GlassCard = ({ 
  children, 
  padding, 
  margin, 
  width, 
  height, 
  animate = true,
  ...props 
}) => {
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  } : {};

  return (
    <GlassCardContainer
      padding={padding}
      margin={margin}
      width={width}
      height={height}
      {...animationProps}
      {...props}
    >
      {children}
    </GlassCardContainer>
  );
};

export default GlassCard;