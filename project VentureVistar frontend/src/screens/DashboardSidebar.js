import React from 'react';
import styled from 'styled-components';
import { FaUser, FaMoneyBill, FaHandshake, FaFileAlt, FaChartBar, FaBullhorn, FaLightbulb } from 'react-icons/fa';

const Sidebar = styled.aside`
  width: 220px;
  background: #f7fafd;
  height: calc(100vh - 60px);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 2px 0 8px rgba(0,0,0,0.03);
`;
const SidebarLink = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  color: #0077b6;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #e0f7fa;
  }
`;

const DashboardSidebar = () => (
  <Sidebar>
    <SidebarLink><FaUser /> Profile</SidebarLink>
    <SidebarLink><FaMoneyBill /> Fundraising</SidebarLink>
    <SidebarLink><FaHandshake /> Meetings</SidebarLink>
    <SidebarLink><FaFileAlt /> Documents</SidebarLink>
    <SidebarLink><FaChartBar /> Analytics</SidebarLink>
    <SidebarLink><FaBullhorn /> Announcements</SidebarLink>
    <SidebarLink><FaLightbulb /> Resources</SidebarLink>
  </Sidebar>
);

export default DashboardSidebar; 