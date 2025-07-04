import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SearchHeader = styled.div`
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

const SearchBox = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.5rem 2rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #2D3748;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #A0AEC0;
  }
  
  &:focus {
    outline: none;
    border-color: #4299E1;
    box-shadow: 0 0 0 5px rgba(66, 153, 225, 0.1);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4299E1;
  font-size: 1.5rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
`;

const FilterChip = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  border: none;
  background: ${props => props.active ? 
    'linear-gradient(135deg, #4299E1, #667EEA)' : 
    'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? 'white' : '#4A5568'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(66, 153, 225, 0.3);
  }
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ResultCard = styled(GlassCard)`
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(66, 153, 225, 0.3);
  }
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ResultAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4299E1, #667EEA);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
`;

const ResultInfo = styled.div`
  flex: 1;
`;

const ResultName = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 0.3rem;
`;

const ResultType = styled.p`
  color: #4299E1;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ResultDescription = styled.p`
  color: #4A5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ResultTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Tag = styled.span`
  padding: 0.4rem 0.8rem;
  background: rgba(66, 153, 225, 0.1);
  color: #4299E1;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ResultStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2D3748;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4299E1, #667EEA);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(66, 153, 225, 0.4);
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
  font-size: 1.1rem;
`;

const SmartSearch = ({ userType = 'startup' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(['all']);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const filters = userType === 'startup' ? [
    { id: 'all', label: 'All Investors' },
    { id: 'angel', label: 'Angel Investors' },
    { id: 'vc', label: 'VCs' },
    { id: 'corporate', label: 'Corporate VCs' },
    { id: 'government', label: 'Government' }
  ] : [
    { id: 'all', label: 'All Startups' },
    { id: 'early', label: 'Early Stage' },
    { id: 'growth', label: 'Growth Stage' },
    { id: 'ai', label: 'AI/ML' },
    { id: 'fintech', label: 'FinTech' },
    { id: 'healthcare', label: 'Healthcare' }
  ];

  const mockResults = userType === 'startup' ? [
    {
      id: 1,
      name: 'Sarah Johnson',
      type: 'Angel Investor',
      avatar: 'SJ',
      description: 'Experienced angel investor focusing on early-stage B2B SaaS companies. Former VP of Product at TechCorp.',
      tags: ['SaaS', 'B2B', 'Product', 'Growth'],
      stats: {
        investments: 23,
        portfolio: 15,
        exits: 4
      },
      matchScore: 89
    },
    {
      id: 2,
      name: 'TechVentures Fund',
      type: 'Venture Capital',
      avatar: 'TV',
      description: 'Leading VC fund specializing in AI and machine learning startups. $100M+ AUM with focus on Series A/B.',
      tags: ['AI', 'ML', 'Series A', 'Series B'],
      stats: {
        investments: 45,
        portfolio: 32,
        exits: 8
      },
      matchScore: 76
    },
    {
      id: 3,
      name: 'Innovation Labs',
      type: 'Corporate VC',
      avatar: 'IL',
      description: 'Corporate venture arm focused on strategic investments in emerging technologies and digital transformation.',
      tags: ['Strategic', 'Digital', 'Enterprise', 'Innovation'],
      stats: {
        investments: 12,
        portfolio: 8,
        exits: 2
      },
      matchScore: 82
    }
  ] : [
    {
      id: 1,
      name: 'TechStart AI',
      type: 'AI Startup',
      avatar: 'TA',
      description: 'AI-powered customer service automation platform helping businesses reduce response time by 80%.',
      tags: ['AI', 'Customer Service', 'Automation', 'B2B'],
      stats: {
        funding: '2M',
        team: 15,
        customers: 150
      },
      matchScore: 92
    },
    {
      id: 2,
      name: 'GreenTech Solutions',
      type: 'CleanTech',
      avatar: 'GT',
      description: 'Renewable energy management platform for commercial buildings. Reduces energy costs by 30%.',
      tags: ['CleanTech', 'Energy', 'IoT', 'Sustainability'],
      stats: {
        funding: '500K',
        team: 8,
        customers: 50
      },
      matchScore: 78
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    // Simulate search delay
    const timer = setTimeout(() => {
      let filteredResults = mockResults;
      
      if (searchTerm) {
        filteredResults = mockResults.filter(result =>
          result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      if (!activeFilters.includes('all')) {
        filteredResults = filteredResults.filter(result => {
          return activeFilters.some(filter => 
            result.type.toLowerCase().includes(filter.toLowerCase()) ||
            result.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
          );
        });
      }
      
      setResults(filteredResults);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, activeFilters]);

  const handleFilterToggle = (filterId) => {
    if (filterId === 'all') {
      setActiveFilters(['all']);
    } else {
      const newFilters = activeFilters.includes(filterId)
        ? activeFilters.filter(id => id !== filterId)
        : [...activeFilters.filter(id => id !== 'all'), filterId];
      
      setActiveFilters(newFilters.length === 0 ? ['all'] : newFilters);
    }
  };

  const handleConnect = (resultId) => {
    console.log(`Connecting with ${resultId}`);
  };

  return (
    <SearchContainer>
      <SearchHeader>
        <Title>🔍 Smart Discovery</Title>
        <SearchBox>
          <SearchInput
            type="text"
            placeholder={`Search for ${userType === 'startup' ? 'investors' : 'startups'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon>🔍</SearchIcon>
        </SearchBox>
      </SearchHeader>

      <FiltersContainer>
        {filters.map((filter) => (
          <FilterChip
            key={filter.id}
            active={activeFilters.includes(filter.id)}
            onClick={() => handleFilterToggle(filter.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.label}
          </FilterChip>
        ))}
      </FiltersContainer>

      <ResultsContainer>
        <AnimatePresence>
          {isLoading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
              <p>Searching for matches...</p>
            </div>
          ) : results.length === 0 ? (
            <NoResults>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p>No results found. Try adjusting your search terms or filters.</p>
            </NoResults>
          ) : (
            results.map((result, index) => (
              <ResultCard
                key={result.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ delay: index * 0.1 }}
              >
                <ResultHeader>
                  <ResultAvatar>{result.avatar}</ResultAvatar>
                  <ResultInfo>
                    <ResultName>{result.name}</ResultName>
                    <ResultType>{result.type}</ResultType>
                  </ResultInfo>
                  <div style={{ 
                    background: 'linear-gradient(135deg, #48BB78, #38A169)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {result.matchScore}% Match
                  </div>
                </ResultHeader>

                <ResultDescription>{result.description}</ResultDescription>

                <ResultTags>
                  {result.tags.map((tag, tagIndex) => (
                    <Tag key={tagIndex}>{tag}</Tag>
                  ))}
                </ResultTags>

                <ResultStats>
                  {Object.entries(result.stats).map(([key, value]) => (
                    <Stat key={key}>
                      <StatValue>{value}</StatValue>
                      <StatLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</StatLabel>
                    </Stat>
                  ))}
                </ResultStats>

                <ActionButton
                  onClick={() => handleConnect(result.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Connect Now
                </ActionButton>
              </ResultCard>
            ))
          )}
        </AnimatePresence>
      </ResultsContainer>
    </SearchContainer>
  );
};

export default SmartSearch;