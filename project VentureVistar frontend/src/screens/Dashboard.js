import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
// import DashboardSidebar from './DashboardSidebar'; // Removed
import DashboardMain from './DashboardMain';
import InvestorDashboard from './InvestorDashboard';

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f4f8fb;
`;

const Dashboard = () => {
  const { userType, userInfo } = useSelector((state) => state.auth);
  const history = useHistory();

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
  }, [userInfo, history]);

  return (
    <div>
      <DashboardNavbar />
      <Layout>
        {userType === 'investor' ? (
          <InvestorDashboard />
        ) : (
          // <DashboardSidebar /> Removed
          <DashboardMain />
        )}
      </Layout>
    </div>
  );
};

export default Dashboard; 