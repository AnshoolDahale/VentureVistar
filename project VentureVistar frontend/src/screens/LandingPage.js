import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const LandingContainer = styled.div`
  height: 100vh;
  width: 100%;
  background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const BackgroundAnimation = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-family: 'Montserrat', sans-serif;
  font-size: 5rem;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  z-index: 2;
  text-shadow: 0 0 20px rgba(255,255,255,0.3);
`;

const NextButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: linear-gradient(45deg, #00b4d8, #0077b6);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
  box-shadow: 0 0 20px rgba(0,180,216,0.3);
  
  &:hover {
    background: linear-gradient(45deg, #0077b6, #00b4d8);
  }
`;

const LandingPage = () => {
  const history = useHistory();

  const backgroundVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const titleVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <LandingContainer>
      <BackgroundAnimation
        variants={backgroundVariants}
        animate="animate"
      />
      <Title
        variants={titleVariants}
        initial="initial"
        animate="animate"
      >
        WELCOME TO VENTURE VISTAR
      </Title>
      <NextButton
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onClick={() => history.push('/login')}
      >
        Get Started <FaArrowRight />
      </NextButton>
    </LandingContainer>
  );
};

export default LandingPage; 