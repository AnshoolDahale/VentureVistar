import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FaRocket, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../redux/actions/authActions';

const Navbar = styled.nav`
  width: 100%;
  height: 60px;
  background: linear-gradient(90deg, #0077b6 60%, #00b4d8 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  gap: 0.5rem;
`;
const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 1rem;
`;
const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const NavbarButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DashboardNavbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userInfo, userType } = useSelector((state) => state.auth);

  const handleLogout = () => {
    // Confirm logout
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;

    try {
      // Clear any stored tokens/session data
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userType');
      sessionStorage.clear();
      
      // Dispatch logout action to clear Redux state
      dispatch(logout());
      
      // Redirect to landing page
      history.push('/');
      
      // Optional: Show success message
      console.log('✅ Logout successful - redirected to landing page');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still redirect even if there's an error
      history.push('/');
    }
  };

  return (
    <Navbar>
      <Logo>
        <FaRocket />
        Venture Vistar
      </Logo>
      <NavLinks>
        <span>Dashboard</span>
        <span>Connect</span>
        <span>Profile</span>
      </NavLinks>
      <Profile>
        <FaUserCircle size={28} />
        <NavbarButton 
          title="Logout" 
          onClick={handleLogout}
          onMouseOver={(e) => e.target.style.opacity = '0.8'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          <FaSignOutAlt /> Logout
        </NavbarButton>
      </Profile>
    </Navbar>
  );
};

export default DashboardNavbar; 