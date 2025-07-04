import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaChartLine } from 'react-icons/fa';

const LoginContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem;
  color: #2a2a2a;
  margin-bottom: 3rem;
  text-align: center;
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const OptionCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 300px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #4CAF50;
`;

const OptionTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  color: #2a2a2a;
  margin-bottom: 1rem;
`;

const OptionDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const Button = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #4CAF50;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  margin: 0.5rem;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    background: #45a049;
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <LoginContainer>
      <Title>Welcome to Venture Vistar</Title>
      <OptionsContainer>
        <OptionCard
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOptionSelect('startup')}
          style={{ border: selectedOption === 'startup' ? '2px solid #4CAF50' : 'none' }}
        >
          <Icon>
            <FaBuilding />
          </Icon>
          <OptionTitle>Startup</OptionTitle>
          <OptionDescription>
            Looking for funding and mentorship? Join as a startup to connect with investors.
          </OptionDescription>
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login/startup')}
          >
            Login as Startup
          </Button>
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/signup/startup')}
            style={{ background: '#fff', color: '#4CAF50', border: '1px solid #4CAF50' }}
          >
            Sign Up as Startup
          </Button>
        </OptionCard>

        <OptionCard
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOptionSelect('investor')}
          style={{ border: selectedOption === 'investor' ? '2px solid #4CAF50' : 'none' }}
        >
          <Icon>
            <FaChartLine />
          </Icon>
          <OptionTitle>Investor</OptionTitle>
          <OptionDescription>
            Looking for promising startups? Join as an investor to discover new opportunities.
          </OptionDescription>
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login/investor')}
          >
            Login as Investor
          </Button>
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/signup/investor')}
            style={{ background: '#fff', color: '#4CAF50', border: '1px solid #4CAF50' }}
          >
            Sign Up as Investor
          </Button>
        </OptionCard>
      </OptionsContainer>
    </LoginContainer>
  );
};

export default LoginPage; 