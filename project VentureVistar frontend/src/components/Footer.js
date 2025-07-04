import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import './Footer.css';

const FooterContainer = styled(motion.footer)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 1rem 1rem;
  margin-top: auto;
  text-align: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const CopyrightText = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
`;

const CreatorInfo = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
`;

const CreatorName = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 2rem;
  }
`;

const ContactItem = styled.a`
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    text-decoration: none;
    color: #fff;
  }
  
  i {
    font-size: 1.1rem;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 1.5rem 0 1rem 0;
`;

const FinalCopyright = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const VentureVistarBrand = styled.span`
  font-weight: 700;
  color: #ffd700;
`;

const Footer = () => {
  return (
    <FooterContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FooterContent>
        <CopyrightText>
          <VentureVistarBrand>VentureVistar</VentureVistarBrand> - Empowering Startups & Investors
        </CopyrightText>
        
        <CreatorInfo>
          <CreatorName>🚀 Created by Anshool Dahale</CreatorName>
          <ContactInfo>
            <ContactItem href="mailto:anshooldahale08@gmail.com">
              <i className="fas fa-envelope"></i>
              anshooldahale08@gmail.com
            </ContactItem>
            <ContactItem href="tel:+918328004134">
              <i className="fas fa-phone"></i>
              +91 8328004134
            </ContactItem>
          </ContactInfo>
        </CreatorInfo>

        <Divider />
        
        <FinalCopyright>
          © {new Date().getFullYear()} VentureVistar. All rights reserved. 
          Designed & Developed with ❤️ by <strong>Anshool Dahale</strong>
        </FinalCopyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;