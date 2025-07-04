import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SpinnerRing = styled(motion.div)`
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  border: 3px solid rgba(66, 153, 225, 0.1);
  border-top: 3px solid #4299E1;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const LoadingText = styled(motion.div)`
  color: #4A5568;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 0.3rem;
  margin-top: 0.5rem;
`;

const Dot = styled(motion.div)`
  width: 6px;
  height: 6px;
  background: #4299E1;
  border-radius: 50%;
`;

const LoadingSpinner = ({ 
  size = '50px', 
  message = 'Loading...', 
  showDots = true 
}) => {
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  const dotAnimation = {
    scale: [1, 1.5, 1],
    opacity: [0.5, 1, 0.5],
  };

  const dotTransition = {
    repeat: Infinity,
    duration: 1.5,
    ease: "easeInOut"
  };

  return (
    <SpinnerContainer>
      <SpinnerRing
        size={size}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
      
      <LoadingText
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </LoadingText>
      
      {showDots && (
        <DotsContainer>
          {[0, 1, 2].map((index) => (
            <Dot
              key={index}
              animate={dotAnimation}
              transition={{ ...dotTransition, delay: index * 0.2 }}
            />
          ))}
        </DotsContainer>
      )}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;