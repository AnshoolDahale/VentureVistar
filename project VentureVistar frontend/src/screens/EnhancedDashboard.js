import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import DashboardNavbar from './DashboardNavbar';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import MatchingEngine from '../components/ai/MatchingEngine';
import ChatInterface from '../components/communication/ChatInterface';
import SmartSearch from '../components/search/SmartSearch';
import GlassCard from '../components/ui/GlassCard';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const DashboardContent = styled.div`
  padding: 2rem;
`;

const TabNavigation = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  flex-wrap: wrap;
  justify-content: center;
`;

const TabButton = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  ${props => props.active ? `
    background: rgba(255, 255, 255, 0.2);
    color: white;
    box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
  ` : `
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
  `}
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
  }
`;

const ContentArea = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
`;

const WelcomeSection = styled(GlassCard)`
  padding: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const QuickActionButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #4299E1, #667EEA);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(66, 153, 225, 0.4);
  }
`;

const EnhancedDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { userType, userInfo } = useSelector((state) => state.auth);

  const tabs = [
    { id: 'overview', label: '🏠 Overview', icon: '🏠' },
    { id: 'analytics', label: '📊 Analytics', icon: '📊' },
    { id: 'matching', label: '🤖 AI Matching', icon: '🤖' },
    { id: 'search', label: '🔍 Discovery', icon: '🔍' },
    { id: 'messages', label: '💬 Messages', icon: '💬' },
  ];

  const quickActions = userType === 'startup' ? [
    { icon: '📝', label: 'Update Profile', action: () => {} },
    { icon: '🎯', label: 'Find Investors', action: () => setActiveTab('matching') },
    { icon: '📊', label: 'View Analytics', action: () => setActiveTab('analytics') },
    { icon: '💬', label: 'Check Messages', action: () => setActiveTab('messages') },
  ] : [
    { icon: '🚀', label: 'Browse Startups', action: () => setActiveTab('search') },
    { icon: '💰', label: 'Portfolio View', action: () => setActiveTab('analytics') },
    { icon: '🤖', label: 'AI Recommendations', action: () => setActiveTab('matching') },
    { icon: '💬', label: 'Messages', action: () => setActiveTab('messages') },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard userType={userType} />;
      case 'matching':
        return <MatchingEngine userType={userType} />;
      case 'search':
        return <SmartSearch userType={userType} />;
      case 'messages':
        return <ChatInterface userType={userType} />;
      default:
        return (
          <WelcomeSection>
            <WelcomeTitle>
              Welcome back, {userInfo?.name || 'User'}! 👋
            </WelcomeTitle>
            <WelcomeSubtitle>
              {userType === 'startup' 
                ? 'Ready to connect with investors and grow your startup?' 
                : 'Discover your next investment opportunity with AI-powered matching.'}
            </WelcomeSubtitle>
            <QuickActions>
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={index}
                  onClick={action.action}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </QuickActionButton>
              ))}
            </QuickActions>
          </WelcomeSection>
        );
    }
  };

  return (
    <DashboardContainer>
      <DashboardNavbar />
      <DashboardContent>
        <TabNavigation>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabNavigation>

        <ContentArea
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderContent()}
        </ContentArea>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default EnhancedDashboard;