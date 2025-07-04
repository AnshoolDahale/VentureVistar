import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import AnimatedCounter from '../animations/AnimatedCounter';
import ProgressRing from '../charts/ProgressRing';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2D3748;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #4299E1, #667EEA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const MetricCard = styled(GlassCard)`
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.gradient || 'linear-gradient(90deg, #4299E1, #667EEA)'};
  }
`;

const MetricIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(GlassCard)`
  padding: 2rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ProgressContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
`;

const ActivityFeed = styled(GlassCard)`
  padding: 2rem;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(66, 153, 225, 0.5);
    border-radius: 10px;
    
    &:hover {
      background: rgba(66, 153, 225, 0.7);
    }
  }
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.bg || 'linear-gradient(135deg, #4299E1, #667EEA)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.p`
  color: #2D3748;
  font-weight: 500;
  margin-bottom: 0.2rem;
`;

const ActivityTime = styled.p`
  color: #718096;
  font-size: 0.8rem;
`;

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const InsightCard = styled(GlassCard)`
  padding: 2rem;
  border-left: 4px solid #4299E1;
`;

const InsightTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 1rem;
`;

const InsightText = styled.p`
  color: #4A5568;
  line-height: 1.6;
`;

const InsightValue = styled.span`
  font-weight: 700;
  color: #4299E1;
`;

const AnalyticsDashboard = ({ userType = 'startup' }) => {
  const [metrics, setMetrics] = useState({});
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time data fetching
    const fetchData = () => {
      const mockMetrics = userType === 'startup' ? {
        profileViews: 1247,
        investorMatches: 23,
        connectionsRequests: 8,
        responseRate: 67
      } : {
        startupViews: 892,
        portfolioSize: 15,
        activeDeals: 4,
        returnRate: 34
      };

      const mockActivities = userType === 'startup' ? [
        { id: 1, icon: '👀', text: 'Profile viewed by TechVentures VC', time: '2 minutes ago', bg: 'linear-gradient(135deg, #48BB78, #38A169)' },
        { id: 2, icon: '🤝', text: 'New connection request from Sarah Johnson', time: '15 minutes ago', bg: 'linear-gradient(135deg, #4299E1, #667EEA)' },
        { id: 3, icon: '📊', text: 'Pitch deck downloaded by InnovateFund', time: '1 hour ago', bg: 'linear-gradient(135deg, #ED8936, #DD6B20)' },
        { id: 4, icon: '⭐', text: 'Profile featured in AI recommendations', time: '2 hours ago', bg: 'linear-gradient(135deg, #9F7AEA, #805AD5)' },
        { id: 5, icon: '💬', text: 'New message from Michael Chen', time: '3 hours ago', bg: 'linear-gradient(135deg, #38B2AC, #319795)' }
      ] : [
        { id: 1, icon: '🚀', text: 'New startup TechStart AI added to watchlist', time: '5 minutes ago', bg: 'linear-gradient(135deg, #4299E1, #667EEA)' },
        { id: 2, icon: '📈', text: 'Portfolio company GreenTech raised Series B', time: '30 minutes ago', bg: 'linear-gradient(135deg, #48BB78, #38A169)' },
        { id: 3, icon: '🎯', text: 'Match score updated for 5 startups', time: '1 hour ago', bg: 'linear-gradient(135deg, #ED8936, #DD6B20)' },
        { id: 4, icon: '📑', text: 'Due diligence completed for DataCorp', time: '2 hours ago', bg: 'linear-gradient(135deg, #9F7AEA, #805AD5)' },
        { id: 5, icon: '💰', text: 'Investment approved for $500K in HealthTech', time: '4 hours ago', bg: 'linear-gradient(135deg, #38B2AC, #319795)' }
      ];

      setTimeout(() => {
        setMetrics(mockMetrics);
        setActivities(mockActivities);
        setIsLoading(false);
      }, 1500);
    };

    fetchData();
  }, [userType]);

  const insights = userType === 'startup' ? [
    {
      title: "🎯 Profile Optimization",
      text: "Your profile is performing well with a 67% response rate. Consider adding more technical details to attract tech-focused investors.",
      value: "67%"
    },
    {
      title: "📈 Growth Trend",
      text: "Profile views increased by 34% this week. Your recent updates are attracting more attention from investors.",
      value: "34%"
    },
    {
      title: "🎪 Best Match Sectors",
      text: "AI/ML and FinTech investors show the highest interest in your profile. Focus on these sectors for better matches.",
      value: "AI/ML, FinTech"
    }
  ] : [
    {
      title: "🏆 Portfolio Performance",
      text: "Your portfolio companies are showing strong growth with an average 34% return rate this quarter.",
      value: "34%"
    },
    {
      title: "🔍 Deal Flow Analysis",
      text: "You're reviewing 15% more deals than similar investors. Quality over quantity approach is recommended.",
      value: "15%"
    },
    {
      title: "🎯 Sector Focus",
      text: "Your most successful investments are in Healthcare and AI sectors. Consider doubling down on these areas.",
      value: "Healthcare, AI"
    }
  ];

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>📊 Analytics Dashboard</Title>
        <Subtitle>
          Real-time insights into your {userType === 'startup' ? 'startup' : 'investment'} performance
        </Subtitle>
      </DashboardHeader>

      <MetricsGrid>
        {Object.entries(metrics).map(([key, value], index) => (
          <MetricCard key={key} delay={index * 0.1}>
            <MetricIcon>
              {key.includes('views') ? '👀' : 
               key.includes('matches') || key.includes('Size') ? '🎯' : 
               key.includes('requests') || key.includes('Deals') ? '🤝' : '📈'}
            </MetricIcon>
            <AnimatedCounter
              end={value}
              duration={2}
              suffix={key.includes('Rate') ? '%' : ''}
              fontSize="2.5rem"
              color="#2D3748"
              delay={index * 0.2}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            />
          </MetricCard>
        ))}
      </MetricsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Performance Metrics</ChartTitle>
          <ProgressContainer>
            <ProgressRing 
              percentage={metrics.responseRate || metrics.returnRate || 0}
              size={100}
              color="#4299E1"
              label="Success Rate"
            />
            <ProgressRing 
              percentage={75}
              size={100}
              color="#48BB78"
              label="Profile Score"
            />
            <ProgressRing 
              percentage={60}
              size={100}
              color="#ED8936"
              label="Activity Level"
            />
          </ProgressContainer>
        </ChartCard>

        <ActivityFeed>
          <ChartTitle>Recent Activity</ChartTitle>
          {activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ActivityIcon bg={activity.bg}>
                {activity.icon}
              </ActivityIcon>
              <ActivityContent>
                <ActivityText>{activity.text}</ActivityText>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))}
        </ActivityFeed>
      </ChartsGrid>

      <InsightsGrid>
        {insights.map((insight, index) => (
          <InsightCard key={index}>
            <InsightTitle>{insight.title}</InsightTitle>
            <InsightText>
              {insight.text.split(insight.value)[0]}
              <InsightValue>{insight.value}</InsightValue>
              {insight.text.split(insight.value)[1]}
            </InsightText>
          </InsightCard>
        ))}
      </InsightsGrid>
    </DashboardContainer>
  );
};

export default AnalyticsDashboard;