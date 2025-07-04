import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import ProgressRing from '../charts/ProgressRing';

const MatchingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const MatchingHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2D3748;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #4299E1, #667EEA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
`;

const MatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const MatchCard = styled(GlassCard)`
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4299E1, #667EEA);
  }
`;

const MatchHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4299E1, #667EEA);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
`;

const MatchInfo = styled.div`
  flex: 1;
`;

const MatchName = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 0.2rem;
`;

const MatchType = styled.p`
  color: #718096;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const MatchScore = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ScoreLabel = styled.div`
  font-size: 0.9rem;
  color: #4A5568;
  font-weight: 500;
`;

const MatchDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  text-align: center;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DetailValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2D3748;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #4299E1, #667EEA);
    color: white;
    
    &:hover {
      box-shadow: 0 8px 25px rgba(66, 153, 225, 0.4);
    }
  ` : `
    background: rgba(255, 255, 255, 0.1);
    color: #4A5568;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `}
`;

const MatchingEngine = ({ userType = 'startup' }) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate AI matching algorithm
  useEffect(() => {
    const generateMatches = () => {
      const mockMatches = userType === 'startup' ? [
        {
          id: 1,
          name: 'Sarah Johnson',
          type: 'Angel Investor',
          matchScore: 89,
          sector: 'FinTech',
          tickets: '50K-250K',
          deals: 23,
          avatar: 'SJ',
          interests: ['AI', 'Blockchain', 'SaaS'],
          location: 'Silicon Valley'
        },
        {
          id: 2,
          name: 'Michael Chen',
          type: 'VC Partner',
          matchScore: 76,
          sector: 'Healthcare',
          tickets: '100K-1M',
          deals: 45,
          avatar: 'MC',
          interests: ['MedTech', 'Biotech', 'Digital Health'],
          location: 'New York'
        },
        {
          id: 3,
          name: 'Lisa Rodriguez',
          type: 'Corporate VC',
          matchScore: 82,
          sector: 'Enterprise',
          tickets: '250K-5M',
          deals: 12,
          avatar: 'LR',
          interests: ['B2B SaaS', 'Enterprise AI', 'Security'],
          location: 'Austin'
        }
      ] : [
        {
          id: 1,
          name: 'TechStart AI',
          type: 'AI Startup',
          matchScore: 92,
          sector: 'AI/ML',
          stage: 'Series A',
          funding: '2M',
          avatar: 'TA',
          description: 'AI-powered customer service automation',
          team: 15
        },
        {
          id: 2,
          name: 'GreenTech Solutions',
          type: 'CleanTech',
          matchScore: 78,
          sector: 'Sustainability',
          stage: 'Seed',
          funding: '500K',
          avatar: 'GT',
          description: 'Renewable energy management platform',
          team: 8
        }
      ];

      setTimeout(() => {
        setMatches(mockMatches);
        setIsLoading(false);
      }, 2000);
    };

    generateMatches();
  }, [userType]);

  const handleConnect = (matchId) => {
    // Simulate connection request
    console.log(`Connecting with match ID: ${matchId}`);
  };

  const handleViewProfile = (matchId) => {
    // Navigate to profile
    console.log(`Viewing profile for match ID: ${matchId}`);
  };

  if (isLoading) {
    return (
      <MatchingContainer>
        <MatchingHeader>
          <Title>🤖 AI-Powered Matching</Title>
          <Subtitle>Finding your perfect matches...</Subtitle>
        </MatchingHeader>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <ProgressRing percentage={100} size={80} label="Analyzing profiles..." />
        </div>
      </MatchingContainer>
    );
  }

  return (
    <MatchingContainer>
      <MatchingHeader>
        <Title>🎯 Smart Matches</Title>
        <Subtitle>
          AI-curated {userType === 'startup' ? 'investors' : 'startups'} based on your profile and preferences
        </Subtitle>
      </MatchingHeader>

      <MatchGrid>
        {matches.map((match, index) => (
          <MatchCard
            key={match.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <MatchHeader>
              <Avatar>{match.avatar}</Avatar>
              <MatchInfo>
                <MatchName>{match.name}</MatchName>
                <MatchType>{match.type}</MatchType>
              </MatchInfo>
            </MatchHeader>

            <MatchScore>
              <ProgressRing 
                percentage={match.matchScore} 
                size={60} 
                strokeWidth={4}
                color="#4299E1"
                label="Match"
              />
              <ScoreLabel>
                {match.matchScore}% compatibility based on AI analysis
              </ScoreLabel>
            </MatchScore>

            <MatchDetails>
              <DetailItem>
                <DetailValue>{match.sector}</DetailValue>
                <DetailLabel>Sector</DetailLabel>
              </DetailItem>
              <DetailItem>
                <DetailValue>{match.tickets || match.stage}</DetailValue>
                <DetailLabel>{userType === 'startup' ? 'Ticket Size' : 'Stage'}</DetailLabel>
              </DetailItem>
              <DetailItem>
                <DetailValue>{match.deals || match.team}</DetailValue>
                <DetailLabel>{userType === 'startup' ? 'Deals' : 'Team Size'}</DetailLabel>
              </DetailItem>
              <DetailItem>
                <DetailValue>{match.location || match.funding}</DetailValue>
                <DetailLabel>{userType === 'startup' ? 'Location' : 'Funding'}</DetailLabel>
              </DetailItem>
            </MatchDetails>

            <ActionButtons>
              <ActionButton
                primary
                onClick={() => handleConnect(match.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Connect
              </ActionButton>
              <ActionButton
                onClick={() => handleViewProfile(match.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Profile
              </ActionButton>
            </ActionButtons>
          </MatchCard>
        ))}
      </MatchGrid>
    </MatchingContainer>
  );
};

export default MatchingEngine;