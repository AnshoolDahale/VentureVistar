import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import AnimatedCounter from '../animations/AnimatedCounter';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%);
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  padding: 2rem;
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CTAButton = styled(motion.button)`
  padding: 1.5rem 3rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem;
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
`;

const FloatingCard = styled(motion.div)`
  position: absolute;
  width: 200px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 600;
`;

const StatsSection = styled.section`
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
`;

const StatCard = styled(GlassCard)`
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.1);
`;

const StatIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  background: rgba(0, 0, 0, 0.1);
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(GlassCard)`
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  text-align: center;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  }
`;

const FeatureIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 1.1rem;
`;

const TestimonialSection = styled.section`
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.05);
`;

const TestimonialContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const TestimonialCard = styled(GlassCard)`
  padding: 3rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
`;

const TestimonialText = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 2rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
`;

const TestimonialRole = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ModernLandingPage = () => {
  const floatingElements = [
    { id: 1, x: 10, y: 20, icon: '🚀', delay: 0 },
    { id: 2, x: 80, y: 10, icon: '💰', delay: 0.5 },
    { id: 3, x: 5, y: 70, icon: '🎯', delay: 1 },
    { id: 4, x: 85, y: 60, icon: '📈', delay: 1.5 },
    { id: 5, x: 15, y: 45, icon: '🤝', delay: 2 },
    { id: 6, x: 70, y: 35, icon: '💡', delay: 2.5 }
  ];

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Matching',
      description: 'Our advanced AI algorithm analyzes your profile and matches you with the most compatible investors or startups based on sector, stage, and strategic fit.'
    },
    {
      icon: '💬',
      title: 'Real-Time Communication',
      description: 'Connect instantly with potential partners through our integrated messaging system. No need for external communication tools.'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Get detailed insights into your profile performance, connection success rates, and market trends to optimize your outreach strategy.'
    },
    {
      icon: '🔍',
      title: 'Smart Discovery',
      description: 'Discover opportunities with intelligent search filters, sector-specific recommendations, and trending startup categories.'
    },
    {
      icon: '🎨',
      title: 'Professional Profiles',
      description: 'Create stunning, professional profiles that showcase your startup or investment thesis with rich media and interactive elements.'
    },
    {
      icon: '📈',
      title: 'Performance Tracking',
      description: 'Track your fundraising progress, monitor investor interactions, and measure the success of your outreach campaigns.'
    }
  ];

  return (
    <LandingContainer>
      <HeroSection>
        <FloatingElements>
          {floatingElements.map((element) => (
            <FloatingCard
              key={element.id}
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -20, 0]
              }}
              transition={{ 
                delay: element.delay,
                duration: 1,
                y: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }
              }}
            >
              {element.icon}
            </FloatingCard>
          ))}
        </FloatingElements>
        
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Connect. Invest. Succeed.
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            The most advanced platform for startups and investors to find perfect matches using AI-powered recommendations and real-time analytics.
          </HeroSubtitle>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <CTAButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 Join as Startup
            </CTAButton>
            <CTAButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💰 Join as Investor
            </CTAButton>
          </motion.div>
        </HeroContent>
      </HeroSection>

      <StatsSection>
        <StatsContainer>
          <StatCard>
            <StatIcon>🚀</StatIcon>
            <AnimatedCounter 
              end={2500} 
              duration={3} 
              label="Active Startups"
              fontSize="2.5rem"
              color="white"
            />
          </StatCard>
          <StatCard>
            <StatIcon>💰</StatIcon>
            <AnimatedCounter 
              end={850} 
              duration={3} 
              label="Registered Investors"
              fontSize="2.5rem"
              color="white"
            />
          </StatCard>
          <StatCard>
            <StatIcon>🤝</StatIcon>
            <AnimatedCounter 
              end={1200} 
              duration={3} 
              label="Successful Matches"
              fontSize="2.5rem"
              color="white"
            />
          </StatCard>
          <StatCard>
            <StatIcon>📈</StatIcon>
            <AnimatedCounter 
              end={45} 
              duration={3} 
              suffix="M"
              prefix="$"
              label="Total Funding Raised"
              fontSize="2.5rem"
              color="white"
            />
          </StatCard>
        </StatsContainer>
      </StatsSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>🎯 Platform Features</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <TestimonialSection>
        <TestimonialContainer>
          <SectionTitle>💬 What Our Users Say</SectionTitle>
          <TestimonialCard
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <TestimonialText>
              "This platform revolutionized how we connect with investors. The AI matching is incredibly accurate, and we secured our Series A funding within 3 months of joining!"
            </TestimonialText>
            <TestimonialAuthor>Sarah Chen</TestimonialAuthor>
            <TestimonialRole>CEO, TechStart AI</TestimonialRole>
          </TestimonialCard>
        </TestimonialContainer>
      </TestimonialSection>
    </LandingContainer>
  );
};

export default ModernLandingPage;