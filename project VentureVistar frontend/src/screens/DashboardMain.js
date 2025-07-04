import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaMoneyBill, FaChartLine, FaHandshake, FaFileAlt, FaBullhorn, FaLightbulb, FaChartBar, FaEdit, FaPlus, FaPaperPlane, FaCalendarPlus, FaUpload } from 'react-icons/fa';
import { Api } from '../utils/Api';

const Main = styled.main`
  flex: 1;
  padding: 2rem 3rem;
  background: #f4f8fb;
  min-height: calc(100vh - 60px);
  overflow-y: auto;
`;
const Section = styled.section`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 2rem;
  padding: 2rem;
`;
const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.3rem;
  color: #0077b6;
  margin-bottom: 1.2rem;
`;
const ProgressBar = styled.div`
  background: #e0f7fa;
  border-radius: 8px;
  height: 18px;
  width: 100%;
  margin-bottom: 0.5rem;
  overflow: hidden;
`;
const Progress = styled.div`
  background: linear-gradient(90deg, #00b4d8, #0077b6);
  height: 100%;
  width: ${props => props.value || 0}%;
  border-radius: 8px;
  transition: width 0.5s;
`;
const EditButton = styled.button`
  background: #00b4d8;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const FileInput = styled.input`
  margin-top: 0.5rem;
`;
const InvestorCard = styled.div`
  background: #f7fafd;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const MeetingCard = styled.div`
  background: #f7fafd;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  min-width: 350px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
`;
const ModalTitle = styled.h3`
  margin-bottom: 1rem;
`;
const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const ModalInput = styled.input`
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
`;
const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Sidebar = styled.div`
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
  color: ${props => (props.active ? '#0077b6' : '#333')};
  padding: 0.7rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  background: ${props => (props.active ? '#e0f7fa' : 'transparent')};
  transition: background 0.2s;
  &:hover {
    background: #e0f7fa;
  }
`;
const Container = styled.div`
  display: flex;
`;

function calcProfileProgress(profile) {
  if (!profile) return 0;
  const fields = [
    'logo', 'tagline', 'industry', 'stage', 'team', 'location', 'website',
  ];
  let filled = 0;
  fields.forEach(f => {
    if (Array.isArray(profile[f])) {
      if (profile[f].length > 0) filled++;
    } else if (profile[f]) filled++;
  });
  return Math.round((filled / fields.length) * 100);
}

const DashboardMain = () => {
  // Profile
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Fundraising
  const [campaigns, setCampaigns] = useState([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignData, setCampaignData] = useState({ round: '', amountSought: '', pitchDeck: '', businessModelCanvas: '' });
  const [campaignSaving, setCampaignSaving] = useState(false);

  // File upload states for fundraising documents
  const [pitchDeckMethod, setPitchDeckMethod] = useState('url'); // 'url' or 'file'
  const [businessCanvasMethod, setBusinessCanvasMethod] = useState('url'); // 'url' or 'file'
  const [pitchDeckFile, setPitchDeckFile] = useState(null);
  const [businessCanvasFile, setBusinessCanvasFile] = useState(null);
  const [pitchDeckUploadProgress, setPitchDeckUploadProgress] = useState(0);
  const [businessCanvasUploadProgress, setBusinessCanvasUploadProgress] = useState(0);
  const [pitchDeckUploading, setPitchDeckUploading] = useState(false);
  const [businessCanvasUploading, setBusinessCanvasUploading] = useState(false);
  const [pitchDeckError, setPitchDeckError] = useState('');
  const [businessCanvasError, setBusinessCanvasError] = useState('');

  // Enhanced Milestones - Initialize as empty array
  const [milestones, setMilestones] = useState([]);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestoneData, setMilestoneData] = useState({ 
    title: '', 
    description: '', 
    percentComplete: 0, 
    dueDate: '', 
    category: 'product',
    priority: 'medium',
    assignedTo: '',
    status: 'not_started',
    dependencies: [],
    tags: []
  });
  const [milestoneSaving, setMilestoneSaving] = useState(false);
  const [milestoneView, setMilestoneView] = useState('grid'); // 'grid', 'timeline', 'analytics'
  const [milestoneFilter, setMilestoneFilter] = useState('all'); // 'all', 'product', 'business', 'funding', etc.
  const [showMilestoneTemplates, setShowMilestoneTemplates] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  // Investors
  const [investors, setInvestors] = useState([]);
  const [showInvestorProfileModal, setShowInvestorProfileModal] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [investorProfileLoading, setInvestorProfileLoading] = useState(false);

  // Enhanced Meetings System
  const [meetings, setMeetings] = useState([]);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingData, setMeetingData] = useState({
    title: '',
    description: '',
    type: 'team',
    dateTime: '',
    duration: 60,
    location: '',
    isVirtual: true,
    meetingLink: '',
    attendees: [],
    agenda: [],
    notes: '',
    actionItems: [],
    status: 'scheduled',
    recurring: false,
    recurringPattern: 'weekly'
  });
  const [meetingSaving, setMeetingSaving] = useState(false);
  const [meetingView, setMeetingView] = useState('upcoming'); // 'upcoming', 'calendar', 'past', 'analytics'
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [showMeetingTemplates, setShowMeetingTemplates] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);

  // Enhanced Document Management System
  const [documents, setDocuments] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [docData, setDocData] = useState({
    name: '',
    description: '',
    category: 'general',
    subcategory: '',
    file: null,
    tags: [],
    isPublic: false,
    permissions: [],
    version: '1.0',
    folderId: null
  });
  const [docSaving, setDocSaving] = useState(false);
  const [docView, setDocView] = useState('grid'); // 'grid', 'list', 'folders'
  const [docFilter, setDocFilter] = useState('all'); // 'all', 'recent', 'shared', 'favorites'
  const [docCategory, setDocCategory] = useState('all');
  const [docSearchTerm, setDocSearchTerm] = useState('');
  const [editingDoc, setEditingDoc] = useState(null);
  const [showDocTemplates, setShowDocTemplates] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showDocDetails, setShowDocDetails] = useState(false);
  const [showDocPreview, setShowDocPreview] = useState(false);
  const [draggedDoc, setDraggedDoc] = useState(null);
  const [folders, setFolders] = useState([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderData, setFolderData] = useState({ name: '', description: '', parentId: null });

  // Enhanced Announcements Management System
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'medium',
    category: 'company',
    tags: [],
    scheduledDate: '',
    expiryDate: '',
    isUrgent: false,
    isPinned: false,
    isPublic: true,
    targetAudience: 'all',
    attachments: [],
    reactions: { likes: 0, dislikes: 0, heart: 0, clap: 0 },
    comments: [],
    views: 0,
    readBy: []
  });
  const [announcementSaving, setAnnouncementSaving] = useState(false);
  const [announcementView, setAnnouncementView] = useState('all'); // 'all', 'urgent', 'pinned', 'recent'
  const [announcementFilter, setAnnouncementFilter] = useState('all'); // 'all', 'company', 'product', 'team', 'hr'
  const [announcementSearchTerm, setAnnouncementSearchTerm] = useState('');
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showAnnouncementDetails, setShowAnnouncementDetails] = useState(false);
  const [showAnnouncementTemplates, setShowAnnouncementTemplates] = useState(false);

  // Selected section
  const [selectedSection, setSelectedSection] = useState('profile');

  // Fetch all data on mount
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const [profileRes, campaignsRes, milestonesRes, meetingsRes, docsRes, annRes, invRes] = await Promise.all([
        Api.getRequest('/api/startup/profile'),
        Api.getRequest('/api/startup/fundraising'),
        Api.getRequest('/api/startup/milestones'),
        Api.getRequest('/api/startup/meetings'),
        Api.getRequest('/api/startup/documents'),
        Api.getRequest('/api/announcements'),
        Api.getRequest('/api/investors/suggestions'),
      ]);
      // Handle profile data with fallback
      let profileData = profileRes.data && typeof profileRes.data === 'string' ? JSON.parse(profileRes.data) : profileRes.data;
      
      // If no profile data, set some default structure
      if (!profileData || Object.keys(profileData).length === 0) {
        profileData = {
          tagline: '',
          industry: '',
          stage: '',
          team: [],
          location: '',
          website: '',
          whatsapp: '',
          email: '',
          description: '',
          logo: '',
          fundingAsk: '',
          foundedYear: '',
          employees: ''
        };
      }
      
      setProfile(profileData);
      setCampaigns(campaignsRes.data && typeof campaignsRes.data === 'string' ? JSON.parse(campaignsRes.data) : campaignsRes.data || []);
      // Handle milestones data with sample data
      let milestonesData = milestonesRes.data && typeof milestonesRes.data === 'string' ? JSON.parse(milestonesRes.data) : milestonesRes.data;
      
      // If no milestones data, provide sample milestones for demonstration
      if (!milestonesData || milestonesData.length === 0) {
        milestonesData = [
          {
            id: 1,
            title: 'Complete MVP Development',
            description: 'Finish building the minimum viable product with core features including user authentication, main dashboard, and basic functionality.',
            percentComplete: 75,
            dueDate: '2024-03-15',
            category: 'product',
            priority: 'high',
            assignedTo: 'Development Team',
            status: 'in_progress',
            tags: ['mvp', 'development', 'core-features'],
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-02-10T14:30:00Z'
          },
          {
            id: 2,
            title: 'Secure Seed Funding',
            description: 'Raise initial seed funding of ₹25 lakhs to support product development and early team expansion.',
            percentComplete: 30,
            dueDate: '2024-04-30',
            category: 'funding',
            priority: 'high',
            assignedTo: 'Founder',
            status: 'in_progress',
            tags: ['funding', 'seed', 'investors'],
            createdAt: '2024-01-10T09:00:00Z',
            updatedAt: '2024-02-05T16:45:00Z'
          },
          {
            id: 3,
            title: 'Launch Beta Testing Program',
            description: 'Recruit 100 beta users and gather feedback on product usability and feature requirements.',
            percentComplete: 0,
            dueDate: '2024-03-30',
            category: 'product',
            priority: 'medium',
            assignedTo: 'Product Manager',
            status: 'not_started',
            tags: ['beta', 'testing', 'user-feedback'],
            createdAt: '2024-02-01T11:00:00Z',
            updatedAt: '2024-02-01T11:00:00Z'
          },
          {
            id: 4,
            title: 'Company Incorporation',
            description: 'Complete legal incorporation process including trademark registration and business licenses.',
            percentComplete: 100,
            dueDate: '2024-01-31',
            category: 'legal',
            priority: 'high',
            assignedTo: 'Legal Team',
            status: 'completed',
            tags: ['legal', 'incorporation', 'compliance'],
            createdAt: '2024-01-05T08:00:00Z',
            updatedAt: '2024-01-28T17:00:00Z'
          },
          {
            id: 5,
            title: 'Build Marketing Website',
            description: 'Design and develop company website with product information, team details, and contact forms.',
            percentComplete: 60,
            dueDate: '2024-03-10',
            category: 'marketing',
            priority: 'medium',
            assignedTo: 'Marketing Team',
            status: 'in_progress',
            tags: ['website', 'marketing', 'branding'],
            createdAt: '2024-01-20T12:00:00Z',
            updatedAt: '2024-02-08T10:15:00Z'
          },
          {
            id: 6,
            title: 'Hire Senior Developer',
            description: 'Recruit and onboard a senior full-stack developer to accelerate product development.',
            percentComplete: 40,
            dueDate: '2024-04-15',
            category: 'team',
            priority: 'medium',
            assignedTo: 'HR Team',
            status: 'in_progress',
            tags: ['hiring', 'developer', 'team-expansion'],
            createdAt: '2024-02-05T14:00:00Z',
            updatedAt: '2024-02-12T09:30:00Z'
          }
        ];
      }
      
      setMilestones(milestonesData);
      // Handle meetings data with sample data
      let meetingsData = meetingsRes.data && typeof meetingsRes.data === 'string' ? JSON.parse(meetingsRes.data) : meetingsRes.data;
      
      // If no meetings data, provide sample meetings for demonstration
      if (!meetingsData || meetingsData.length === 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);

        meetingsData = [
          {
            id: 1,
            title: 'Daily Standup',
            description: 'Daily team synchronization meeting',
            type: 'team',
            dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0).toISOString(),
            duration: 15,
            location: 'Conference Room A',
            isVirtual: false,
            meetingLink: '',
            attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
            agenda: ['What did you work on yesterday?', 'What will you work on today?', 'Any blockers or challenges?'],
            notes: 'Discussed MVP progress and identified key blockers.',
            actionItems: ['John to fix authentication bug', 'Jane to complete UI mockups'],
            status: 'completed',
            recurring: true,
            recurringPattern: 'daily',
            createdAt: lastWeek.toISOString(),
            updatedAt: today.toISOString()
          },
          {
            id: 2,
            title: 'Investor Pitch Meeting',
            description: 'Present startup pitch to Angel Investors Group',
            type: 'investor',
            dateTime: tomorrow.toISOString().slice(0, 16) + ':00.000Z',
            duration: 45,
            location: 'Virtual Meeting',
            isVirtual: true,
            meetingLink: 'https://zoom.us/j/123456789',
            attendees: ['Sarah Wilson (Lead Investor)', 'Robert Chen', 'Lisa Park'],
            agenda: [
              'Company overview and team introduction',
              'Problem and solution presentation',
              'Market opportunity analysis',
              'Business model and revenue streams',
              'Financial projections and funding ask',
              'Q&A session'
            ],
            notes: '',
            actionItems: [],
            status: 'scheduled',
            recurring: false,
            recurringPattern: 'weekly',
            createdAt: today.toISOString(),
            updatedAt: today.toISOString()
          },
          {
            id: 3,
            title: 'Customer Discovery Interview',
            description: 'Interview with potential enterprise client',
            type: 'client',
            dateTime: nextWeek.toISOString().slice(0, 16) + ':00.000Z',
            duration: 30,
            location: 'Client Office',
            isVirtual: false,
            meetingLink: '',
            attendees: ['David Brown (CTO)', 'Emma Taylor (Product Manager)'],
            agenda: [
              'Current pain points discussion',
              'Existing solution analysis',
              'Feature requirements gathering',
              'Integration possibilities',
              'Pricing expectations'
            ],
            notes: '',
            actionItems: [],
            status: 'scheduled',
            recurring: false,
            recurringPattern: 'weekly',
            createdAt: today.toISOString(),
            updatedAt: today.toISOString()
          },
          {
            id: 4,
            title: 'Weekly Team Review',
            description: 'Weekly team progress review and planning',
            type: 'team',
            dateTime: lastWeek.toISOString().slice(0, 16) + ':00.000Z',
            duration: 60,
            location: 'Conference Room B',
            isVirtual: false,
            meetingLink: '',
            attendees: ['All Team Members'],
            agenda: [
              'Review last week\'s achievements',
              'Discuss current challenges',
              'Plan next week priorities',
              'Resource allocation',
              'Team announcements'
            ],
            notes: 'Great progress on MVP development. Need to focus on user testing next week.',
            actionItems: [
              'Prepare beta testing plan',
              'Update project timeline',
              'Schedule user interviews'
            ],
            status: 'completed',
            recurring: true,
            recurringPattern: 'weekly',
            createdAt: lastWeek.toISOString(),
            updatedAt: lastWeek.toISOString()
          },
          {
            id: 5,
            title: 'Board Meeting Q1 Review',
            description: 'Quarterly board meeting with directors and advisors',
            type: 'board',
            dateTime: new Date(today.getFullYear(), today.getMonth() + 1, 15, 14, 0).toISOString(),
            duration: 120,
            location: 'Boardroom',
            isVirtual: false,
            meetingLink: '',
            attendees: ['Board of Directors', 'Key Advisors', 'Executive Team'],
            agenda: [
              'CEO quarterly report',
              'Financial performance review',
              'Strategic initiatives update',
              'Risk assessment and mitigation',
              'Funding status and future plans',
              'Executive session'
            ],
            notes: '',
            actionItems: [],
            status: 'scheduled',
            recurring: true,
            recurringPattern: 'quarterly',
            createdAt: today.toISOString(),
            updatedAt: today.toISOString()
          }
        ];
      }
      
      setMeetings(meetingsData);
      
      // Handle documents data with sample data
      let documentsData = docsRes.data && typeof docsRes.data === 'string' ? JSON.parse(docsRes.data) : docsRes.data;
      
      // If no documents data, provide sample documents for demonstration
      if (!documentsData || documentsData.length === 0) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);

        documentsData = [
          {
            id: 1,
            name: 'Business Plan 2024',
            description: 'Comprehensive business plan outlining our strategy for 2024 growth',
            category: 'business',
            subcategory: 'Business Plan',
            filename: 'business-plan-2024.pdf',
            fileType: 'application/pdf',
            size: 2547892,
            uploadDate: lastWeek.toISOString(),
            lastModified: today.toISOString(),
            uploadedBy: 'Sarah Johnson (CEO)',
            downloads: 15,
            views: 47,
            tags: ['business plan', 'strategy', '2024', 'growth'],
            isPublic: false,
            permissions: ['team@startup.com', 'board@startup.com'],
            version: '2.1',
            isFavorite: true,
            folderId: null
          },
          {
            id: 2,
            name: 'Financial Projections Q1-Q4',
            description: 'Detailed financial projections and revenue forecasts for the upcoming year',
            category: 'financial',
            subcategory: 'Projections',
            filename: 'financial-projections-2024.xlsx',
            fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: 1245670,
            uploadDate: lastWeek.toISOString(),
            lastModified: yesterday.toISOString(),
            uploadedBy: 'Michael Chen (CFO)',
            downloads: 8,
            views: 23,
            tags: ['finance', 'projections', 'revenue', 'forecasting'],
            isPublic: false,
            permissions: ['finance@startup.com', 'executives@startup.com'],
            version: '1.3',
            isFavorite: false,
            folderId: null
          },
          {
            id: 3,
            name: 'Investor Pitch Deck',
            description: 'Series A funding pitch presentation with market analysis and growth projections',
            category: 'business',
            subcategory: 'Strategy',
            filename: 'series-a-pitch-deck.pptx',
            fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            size: 8934521,
            uploadDate: lastMonth.toISOString(),
            lastModified: lastWeek.toISOString(),
            uploadedBy: 'Sarah Johnson (CEO)',
            downloads: 32,
            views: 89,
            tags: ['pitch deck', 'series a', 'funding', 'investors'],
            isPublic: true,
            permissions: ['investors@startup.com'],
            version: '3.0',
            isFavorite: true,
            folderId: null
          },
          {
            id: 4,
            name: 'Privacy Policy',
            description: 'GDPR compliant privacy policy for our web application',
            category: 'legal',
            subcategory: 'Compliance',
            filename: 'privacy-policy.pdf',
            fileType: 'application/pdf',
            size: 456789,
            uploadDate: lastMonth.toISOString(),
            lastModified: lastMonth.toISOString(),
            uploadedBy: 'Legal Team',
            downloads: 5,
            views: 15,
            tags: ['legal', 'privacy', 'gdpr', 'compliance'],
            isPublic: true,
            permissions: ['public'],
            version: '1.0',
            isFavorite: false,
            folderId: null
          },
          {
            id: 5,
            name: 'API Documentation v2.0',
            description: 'Complete REST API documentation with endpoints, examples, and authentication',
            category: 'technical',
            subcategory: 'API Documentation',
            filename: 'api-docs-v2.pdf',
            fileType: 'application/pdf',
            size: 1876543,
            uploadDate: yesterday.toISOString(),
            lastModified: today.toISOString(),
            uploadedBy: 'Development Team',
            downloads: 12,
            views: 34,
            tags: ['api', 'documentation', 'development', 'rest'],
            isPublic: false,
            permissions: ['developers@startup.com', 'partners@startup.com'],
            version: '2.0',
            isFavorite: true,
            folderId: null
          },
          {
            id: 6,
            name: 'Brand Guidelines 2024',
            description: 'Updated brand identity guidelines including logos, colors, and usage standards',
            category: 'marketing',
            subcategory: 'Brand Guidelines',
            filename: 'brand-guidelines-2024.pdf',
            fileType: 'application/pdf',
            size: 12456789,
            uploadDate: lastWeek.toISOString(),
            lastModified: lastWeek.toISOString(),
            uploadedBy: 'Design Team',
            downloads: 18,
            views: 56,
            tags: ['brand', 'design', 'guidelines', 'identity'],
            isPublic: false,
            permissions: ['marketing@startup.com', 'design@startup.com'],
            version: '2024.1',
            isFavorite: false,
            folderId: null
          },
          {
            id: 7,
            name: 'Employee Handbook',
            description: 'Comprehensive employee handbook with policies, procedures, and benefits',
            category: 'hr',
            subcategory: 'Handbooks',
            filename: 'employee-handbook.pdf',
            fileType: 'application/pdf',
            size: 3456789,
            uploadDate: lastMonth.toISOString(),
            lastModified: lastWeek.toISOString(),
            uploadedBy: 'HR Department',
            downloads: 25,
            views: 67,
            tags: ['hr', 'handbook', 'policies', 'employees'],
            isPublic: false,
            permissions: ['all-employees@startup.com'],
            version: '1.2',
            isFavorite: false,
            folderId: null
          },
          {
            id: 8,
            name: 'Product Roadmap 2024',
            description: 'Detailed product development roadmap with features, timelines, and priorities',
            category: 'business',
            subcategory: 'Strategy',
            filename: 'product-roadmap-2024.pdf',
            fileType: 'application/pdf',
            size: 1234567,
            uploadDate: today.toISOString(),
            lastModified: today.toISOString(),
            uploadedBy: 'Product Team',
            downloads: 3,
            views: 8,
            tags: ['product', 'roadmap', 'development', 'features'],
            isPublic: false,
            permissions: ['product@startup.com', 'development@startup.com'],
            version: '1.0',
            isFavorite: true,
            folderId: null
          },
          {
            id: 9,
            name: 'Market Research Report',
            description: 'Comprehensive market analysis and competitor research for our target market',
            category: 'business',
            subcategory: 'Market Research',
            filename: 'market-research-report.docx',
            fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: 2345678,
            uploadDate: lastWeek.toISOString(),
            lastModified: lastWeek.toISOString(),
            uploadedBy: 'Research Team',
            downloads: 9,
            views: 28,
            tags: ['market research', 'competitors', 'analysis', 'strategy'],
            isPublic: false,
            permissions: ['strategy@startup.com', 'executives@startup.com'],
            version: '1.0',
            isFavorite: false,
            folderId: null
          },
          {
            id: 10,
            name: 'Terms of Service',
            description: 'Legal terms of service for our platform and services',
            category: 'legal',
            subcategory: 'Terms & Conditions',
            filename: 'terms-of-service.pdf',
            fileType: 'application/pdf',
            size: 678901,
            uploadDate: lastMonth.toISOString(),
            lastModified: lastMonth.toISOString(),
            uploadedBy: 'Legal Team',
            downloads: 7,
            views: 19,
            tags: ['legal', 'terms', 'service', 'platform'],
            isPublic: true,
            permissions: ['public'],
            version: '1.1',
            isFavorite: false,
            folderId: null
          }
        ];
      }
      
      setDocuments(documentsData);
      
      // Handle announcements data with sample data
      let announcementsData = annRes.data && typeof annRes.data === 'string' ? JSON.parse(annRes.data) : annRes.data;
      
      // If no announcements data, provide sample announcements for demonstration
      if (!announcementsData || announcementsData.length === 0) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);

        announcementsData = [
          {
            id: 1,
            title: '🚨 System Maintenance Alert',
            content: 'Scheduled maintenance for our development servers will take place this Saturday from 2:00 AM to 6:00 AM EST. During this time, some services may be temporarily unavailable. We appreciate your patience.',
            type: 'maintenance',
            priority: 'urgent',
            category: 'general',
            tags: ['maintenance', 'servers', 'downtime'],
            scheduledDate: '',
            expiryDate: '',
            isUrgent: true,
            isPinned: true,
            isPublic: true,
            targetAudience: 'all',
            attachments: [],
            reactions: { likes: 8, dislikes: 0, heart: 2, clap: 5 },
            comments: [],
            views: 45,
            readBy: ['user1', 'user2', 'user3'],
            createdAt: today.toISOString(),
            updatedAt: today.toISOString(),
            author: 'IT Team',
            isActive: true
          },
          {
            id: 2,
            title: '🎉 New Team Member Welcome',
            content: 'We are excited to welcome Sarah Johnson to our Product Management team! Sarah brings 8 years of experience in fintech product development and will be leading our mobile app initiatives. Please join us in welcoming Sarah to the team.',
            type: 'team',
            priority: 'high',
            category: 'team',
            tags: ['new hire', 'product', 'team'],
            scheduledDate: '',
            expiryDate: '',
            isUrgent: false,
            isPinned: true,
            isPublic: true,
            targetAudience: 'all',
            attachments: [],
            reactions: { likes: 15, dislikes: 0, heart: 12, clap: 8 },
            comments: [],
            views: 67,
            readBy: ['user1', 'user2', 'user3', 'user4'],
            createdAt: yesterday.toISOString(),
            updatedAt: yesterday.toISOString(),
            author: 'HR Department',
            isActive: true
          },
          {
            id: 3,
            title: '🚀 Product Feature Launch',
            content: 'We are thrilled to announce the launch of our new AI-powered analytics dashboard! This feature provides real-time insights into user behavior and helps optimize product performance. Available now for all Pro users.',
            type: 'feature',
            priority: 'high',
            category: 'product',
            tags: ['feature launch', 'ai', 'analytics', 'dashboard'],
            scheduledDate: '',
            expiryDate: '',
            isUrgent: false,
            isPinned: false,
            isPublic: true,
            targetAudience: 'customers',
            attachments: [],
            reactions: { likes: 23, dislikes: 1, heart: 18, clap: 15 },
            comments: [],
            views: 156,
            readBy: ['user1', 'user2', 'user3', 'user4', 'user5'],
            createdAt: lastWeek.toISOString(),
            updatedAt: lastWeek.toISOString(),
            author: 'Product Team',
            isActive: true
          },
          {
            id: 4,
            title: '💰 Series A Funding Success',
            content: 'We are proud to announce that we have successfully raised $5M in Series A funding led by TechVentures Capital. This milestone will accelerate our growth plans and expand our engineering team. Thank you to everyone who made this possible!',
            type: 'milestone',
            priority: 'high',
            category: 'company',
            tags: ['funding', 'series a', 'milestone', 'growth'],
            scheduledDate: '',
            expiryDate: '',
            isUrgent: false,
            isPinned: true,
            isPublic: true,
            targetAudience: 'all',
            attachments: [],
            reactions: { likes: 45, dislikes: 0, heart: 38, clap: 42 },
            comments: [],
            views: 234,
            readBy: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'],
            createdAt: lastWeek.toISOString(),
            updatedAt: lastWeek.toISOString(),
            author: 'CEO',
            isActive: true
          },
          {
            id: 5,
            title: '📋 Updated Remote Work Policy',
            content: 'We have updated our remote work policy to provide more flexibility for our team. Key changes include hybrid work options, flexible hours, and improved equipment allowances. Please review the updated policy in the employee handbook.',
            type: 'policy',
            priority: 'medium',
            category: 'hr',
            tags: ['policy', 'remote work', 'hybrid', 'flexibility'],
            scheduledDate: '',
            expiryDate: '',
            isUrgent: false,
            isPinned: false,
            isPublic: false,
            targetAudience: 'employees',
            attachments: [],
            reactions: { likes: 28, dislikes: 2, heart: 5, clap: 12 },
            comments: [],
            views: 89,
            readBy: ['user1', 'user2', 'user3'],
            createdAt: lastWeek.toISOString(),
            updatedAt: lastWeek.toISOString(),
            author: 'HR Department',
            isActive: true
          },
          {
            id: 6,
            title: '🎊 Q1 Goals Achievement',
            content: 'Congratulations team! We have successfully achieved 110% of our Q1 revenue goals and exceeded our user acquisition targets by 25%. This outstanding performance sets us up perfectly for Q2. Keep up the excellent work!',
            type: 'celebration',
            priority: 'medium',
            category: 'company',
            tags: ['achievement', 'q1', 'goals', 'revenue', 'success'],
            scheduledDate: '',
            expiryDate: '',
            isUrgent: false,
            isPinned: false,
            isPublic: true,
            targetAudience: 'all',
            attachments: [],
            reactions: { likes: 34, dislikes: 0, heart: 28, clap: 31 },
            comments: [],
            views: 145,
            readBy: ['user1', 'user2', 'user3', 'user4'],
            createdAt: lastMonth.toISOString(),
            updatedAt: lastMonth.toISOString(),
            author: 'Leadership Team',
            isActive: true
          },
          {
            id: 7,
            title: '📚 Tech Talk Series',
            content: 'Join us for our monthly Tech Talk series! This month, our senior engineer will present "Scaling Microservices Architecture" on Friday at 3 PM in the main conference room. Pizza and drinks will be provided.',
            type: 'training',
            priority: 'low',
            category: 'events',
            tags: ['tech talk', 'training', 'microservices', 'learning'],
            scheduledDate: '',
            expiryDate: '',
            isUrgent: false,
            isPinned: false,
            isPublic: false,
            targetAudience: 'engineers',
            attachments: [],
            reactions: { likes: 12, dislikes: 0, heart: 3, clap: 8 },
            comments: [],
            views: 56,
            readBy: ['user1', 'user2'],
            createdAt: yesterday.toISOString(),
            updatedAt: yesterday.toISOString(),
            author: 'Engineering Team',
            isActive: true
          },
          {
            id: 8,
            title: '💻 Customer Feedback Survey',
            content: 'We value your input! Please take 5 minutes to complete our quarterly customer satisfaction survey. Your feedback helps us improve our product and services. Survey link: [survey-link]. First 100 responses get a $10 gift card!',
            type: 'feedback',
            priority: 'medium',
            category: 'general',
            tags: ['survey', 'feedback', 'customer', 'improvement'],
            scheduledDate: '',
            expiryDate: '',
            isUrgent: false,
            isPinned: false,
            isPublic: true,
            targetAudience: 'customers',
            attachments: [],
            reactions: { likes: 18, dislikes: 1, heart: 4, clap: 7 },
            comments: [],
            views: 203,
            readBy: ['user1', 'user2', 'user3', 'user4', 'user5'],
            createdAt: lastWeek.toISOString(),
            updatedAt: lastWeek.toISOString(),
            author: 'Customer Success',
            isActive: true
          }
        ];
      }
      
      setAnnouncements(announcementsData);
      setInvestors(invRes.data && typeof invRes.data === 'string' ? JSON.parse(invRes.data) : invRes.data || []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  // Enhanced Profile handlers
  const handleEdit = () => {
    setEditData({ 
      ...profile,
      // Ensure all fields have default values
      logo: profile?.logo || '',
      tagline: profile?.tagline || '',
      industry: profile?.industry || '',
      stage: profile?.stage || '',
      team: profile?.team || [],
      location: profile?.location || '',
      website: profile?.website || '',
      whatsapp: profile?.whatsapp || '',
      email: profile?.email || '',
      description: profile?.description || '',
      fundingAsk: profile?.fundingAsk || '',
      foundedYear: profile?.foundedYear || '',
      employees: profile?.employees || ''
    });
    setShowEdit(true);
    setEditError('');
    setEditSuccess('');
  };

  const handleEditChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
    setEditError(''); // Clear error when user starts typing
  };

  const handleTeamChange = (e) => {
    const teamArray = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setEditData({ ...editData, team: teamArray });
  };

  const validateForm = () => {
    if (!editData.tagline || editData.tagline.trim() === '') {
      setEditError('Company name/tagline is required');
      return false;
    }
    if (!editData.industry || editData.industry.trim() === '') {
      setEditError('Industry is required');
      return false;
    }
    if (editData.website && !editData.website.match(/^https?:\/\/.+/)) {
      setEditError('Website must be a valid URL (starting with http:// or https://)');
      return false;
    }
    if (editData.email && !editData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEditError('Please enter a valid email address');
      return false;
    }
    if (editData.fundingAsk && isNaN(Number(editData.fundingAsk))) {
      setEditError('Funding ask must be a valid number');
      return false;
    }
    if (editData.foundedYear && (isNaN(Number(editData.foundedYear)) || Number(editData.foundedYear) < 1900 || Number(editData.foundedYear) > new Date().getFullYear())) {
      setEditError('Please enter a valid founded year');
      return false;
    }
    return true;
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setEditError('');
    
    try {
      console.log('Submitting profile update:', editData);
      
      // Prepare data for submission
      const submitData = {
        ...editData,
        fundingAsk: editData.fundingAsk ? Number(editData.fundingAsk) : undefined,
        foundedYear: editData.foundedYear ? Number(editData.foundedYear) : undefined,
        employees: editData.employees ? Number(editData.employees) : undefined
      };

      const response = await Api.putRequest('/api/startup/profile', submitData);
      
      if (response && response.statusCode === 200 && response.data) {
        const updatedProfile = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        setProfile(updatedProfile);
        setEditSuccess('Profile updated successfully!');
        setTimeout(() => {
          setShowEdit(false);
          setEditSuccess('');
        }, 1500);
      } else {
        // Any non-success response - update local state for demo
        console.warn('Backend response:', response);
        const updatedProfileData = {
          ...profile,
          ...submitData
        };
        setProfile(updatedProfileData);
        setEditSuccess('Profile updated successfully! (Demo mode - changes saved locally)');
        setTimeout(() => {
          setShowEdit(false);
          setEditSuccess('');
        }, 1500);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Fallback: Always update local state when backend is not available
      console.warn('Backend error, updating local state for demonstration');
      const submitData = {
        ...editData,
        fundingAsk: editData.fundingAsk ? Number(editData.fundingAsk) : undefined,
        foundedYear: editData.foundedYear ? Number(editData.foundedYear) : undefined,
        employees: editData.employees ? Number(editData.employees) : undefined
      };
      const updatedProfileData = {
        ...profile,
        ...submitData
      };
      setProfile(updatedProfileData);
      setEditSuccess('Profile updated successfully! (Demo mode - changes saved locally)');
      setTimeout(() => {
        setShowEdit(false);
        setEditSuccess('');
      }, 1500);
    }
    
    setSaving(false);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setEditError('');
    setEditSuccess('');
  };

  // Handle ESC key to close edit modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showEdit) {
        handleCloseEdit();
      }
    };

    if (showEdit) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showEdit]);
  const progress = calcProfileProgress(profile);

  // Fundraising handlers (same as before)
  const fundraisingProgress = campaigns && Array.isArray(campaigns) && campaigns.length > 0 
    ? Math.round((campaigns[0].amountRaised / campaigns[0].amountSought) * 100) 
    : 0;
  const handleNewCampaign = () => {
    setCampaignData({ round: '', amountSought: '', pitchDeck: '', businessModelCanvas: '' });
    setShowCampaignModal(true);
  };
  const handleCampaignChange = e => {
    setCampaignData({ ...campaignData, [e.target.name]: e.target.value });
  };
  const handleCampaignSubmit = async e => {
    e.preventDefault();
    setCampaignSaving(true);
    const { statusCode, data } = await Api.postRequest('/api/startup/fundraising', {
      ...campaignData,
      amountSought: Number(campaignData.amountSought),
    });
    if (statusCode === 201 && data) {
      setCampaigns([...(typeof data === 'string' ? [JSON.parse(data)] : [data]), ...campaigns]);
      setShowCampaignModal(false);
    }
    setCampaignSaving(false);
  };

  // Enhanced Milestone handlers - ensure milestones is always an array
  const milestonesArray = Array.isArray(milestones) ? milestones : [];
  const milestoneProgress = milestonesArray.length > 0 
    ? Math.round(milestonesArray.reduce((a, m) => a + (m.percentComplete || 0), 0) / milestonesArray.length) 
    : 0;

  // Milestone templates for common startup goals
  const milestoneTemplates = [
    {
      category: 'product',
      templates: [
        { title: 'Complete MVP Development', description: 'Build minimum viable product with core features', priority: 'high', estimatedDays: 90 },
        { title: 'Beta Testing Launch', description: 'Release product to selected beta users for feedback', priority: 'high', estimatedDays: 30 },
        { title: 'Product-Market Fit Validation', description: 'Validate product meets market needs through metrics', priority: 'high', estimatedDays: 60 },
        { title: 'Feature Roadmap Planning', description: 'Plan next 6 months of product development', priority: 'medium', estimatedDays: 14 }
      ]
    },
    {
      category: 'business',
      templates: [
        { title: 'Business Model Validation', description: 'Validate revenue model and unit economics', priority: 'high', estimatedDays: 45 },
        { title: 'Legal Structure Setup', description: 'Incorporate company and set up legal framework', priority: 'high', estimatedDays: 30 },
        { title: 'Team Hiring Plan', description: 'Define hiring strategy and recruit key positions', priority: 'medium', estimatedDays: 60 },
        { title: 'Financial Projections', description: 'Create 3-year financial forecasts and budgets', priority: 'medium', estimatedDays: 21 }
      ]
    },
    {
      category: 'funding',
      templates: [
        { title: 'Pitch Deck Creation', description: 'Develop compelling investor presentation', priority: 'high', estimatedDays: 21 },
        { title: 'Due Diligence Preparation', description: 'Prepare all documents for investor review', priority: 'high', estimatedDays: 30 },
        { title: 'Investor Outreach Campaign', description: 'Reach out to potential investors and VCs', priority: 'medium', estimatedDays: 45 },
        { title: 'Terms Negotiation', description: 'Negotiate investment terms and close funding', priority: 'high', estimatedDays: 30 }
      ]
    },
    {
      category: 'marketing',
      templates: [
        { title: 'Brand Identity Development', description: 'Create logo, colors, and brand guidelines', priority: 'medium', estimatedDays: 30 },
        { title: 'Website Launch', description: 'Design and launch company website', priority: 'medium', estimatedDays: 45 },
        { title: 'Content Marketing Strategy', description: 'Develop blog and social media content plan', priority: 'low', estimatedDays: 21 },
        { title: 'Customer Acquisition Strategy', description: 'Define and implement customer acquisition channels', priority: 'high', estimatedDays: 60 }
      ]
    }
  ];

  const getMilestoneStatus = (milestone) => {
    if (!milestone.dueDate) return milestone.status || 'not_started';
    
    const today = new Date();
    const dueDate = new Date(milestone.dueDate);
    
    if (milestone.percentComplete === 100) return 'completed';
    if (today > dueDate) return 'overdue';
    if (milestone.percentComplete > 0) return 'in_progress';
    return 'not_started';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'in_progress': return '#007bff';
      case 'overdue': return '#dc3545';
      case 'not_started': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: '#dc3545',
      high: '#dc3545', // High and urgent use same color
      medium: '#ffc107',
      low: '#28a745'
    };
    return colors[priority] || '#6c757d';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'product': return '🚀';
      case 'business': return '💼';
      case 'funding': return '💰';
      case 'marketing': return '📢';
      case 'legal': return '⚖️';
      case 'team': return '👥';
      default: return '📋';
    }
  };

  const handleNewMilestone = () => {
    setMilestoneData({ 
      title: '', 
      description: '', 
      percentComplete: 0, 
      dueDate: '', 
      category: 'product',
      priority: 'medium',
      assignedTo: '',
      status: 'not_started',
      dependencies: [],
      tags: []
    });
    setEditingMilestone(null);
    setShowMilestoneModal(true);
  };

  const handleEditMilestone = (milestone) => {
    setMilestoneData({ ...milestone });
    setEditingMilestone(milestone);
    setShowMilestoneModal(true);
  };

  const handleMilestoneFromTemplate = (template, category) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + template.estimatedDays);
    
    setMilestoneData({
      title: template.title,
      description: template.description,
      percentComplete: 0,
      dueDate: dueDate.toISOString().split('T')[0],
      category: category,
      priority: template.priority,
      assignedTo: '',
      status: 'not_started',
      dependencies: [],
      tags: []
    });
    setEditingMilestone(null);
    setShowMilestoneTemplates(false);
    setShowMilestoneModal(true);
  };

  const handleMilestoneChange = e => {
    setMilestoneData({ ...milestoneData, [e.target.name]: e.target.value });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setMilestoneData({ ...milestoneData, tags });
  };

  const handleMilestoneSubmit = async e => {
    e.preventDefault();
    setMilestoneSaving(true);
    
    try {
      const submitData = {
        ...milestoneData,
        percentComplete: Number(milestoneData.percentComplete),
        id: editingMilestone ? editingMilestone.id : Date.now(),
        createdAt: editingMilestone ? editingMilestone.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingMilestone) {
        // Update existing milestone
        const { statusCode, data } = await Api.putRequest(`/api/startup/milestones/${editingMilestone.id}`, submitData);
        if (statusCode === 200 && data) {
          setMilestones(prev => prev.map(m => m.id === editingMilestone.id ? submitData : m));
        } else {
          // Fallback: update local state
          setMilestones(prev => prev.map(m => m.id === editingMilestone.id ? submitData : m));
        }
      } else {
        // Create new milestone
        const { statusCode, data } = await Api.postRequest('/api/startup/milestones', submitData);
        if (statusCode === 201 && data) {
          setMilestones(prev => [submitData, ...prev]);
        } else {
          // Fallback: add to local state
          setMilestones(prev => [submitData, ...prev]);
        }
      }
      
      setShowMilestoneModal(false);
      alert(editingMilestone ? 'Milestone updated successfully!' : 'Milestone created successfully!');
    } catch (error) {
      console.error('Milestone save error:', error);
      // Fallback for demo
      const submitData = {
        ...milestoneData,
        percentComplete: Number(milestoneData.percentComplete),
        id: editingMilestone ? editingMilestone.id : Date.now(),
        createdAt: editingMilestone ? editingMilestone.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (editingMilestone) {
        setMilestones(prev => prev.map(m => m.id === editingMilestone.id ? submitData : m));
      } else {
        setMilestones(prev => [submitData, ...prev]);
      }
      
      setShowMilestoneModal(false);
      alert(editingMilestone ? 'Milestone updated successfully! (Demo mode)' : 'Milestone created successfully! (Demo mode)');
    }
    
    setMilestoneSaving(false);
  };

  const handleQuickProgressUpdate = async (milestoneId, newProgress) => {
    try {
      const milestone = milestonesArray.find(m => m.id === milestoneId);
      const updatedMilestone = { 
        ...milestone, 
        percentComplete: newProgress,
        status: newProgress === 100 ? 'completed' : newProgress > 0 ? 'in_progress' : 'not_started',
        updatedAt: new Date().toISOString()
      };
      
      setMilestones(prev => Array.isArray(prev) ? prev.map(m => m.id === milestoneId ? updatedMilestone : m) : [updatedMilestone]);
      
      // Try to save to backend
      await Api.putRequest(`/api/startup/milestones/${milestoneId}`, updatedMilestone);
      
      if (newProgress === 100) {
        // Celebration for completed milestone
        setTimeout(() => {
          alert(`🎉 Congratulations! "${milestone.title}" has been completed!`);
        }, 500);
      }
    } catch (error) {
      console.log('Quick update saved locally');
    }
  };

  const deleteMilestone = async (milestoneId) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      try {
        await Api.deleteRequest(`/api/startup/milestones/${milestoneId}`);
        setMilestones(prev => Array.isArray(prev) ? prev.filter(m => m.id !== milestoneId) : []);
        alert('Milestone deleted successfully!');
      } catch (error) {
        // Fallback
        setMilestones(prev => Array.isArray(prev) ? prev.filter(m => m.id !== milestoneId) : []);
        alert('Milestone deleted successfully! (Demo mode)');
      }
    }
  };

  const getFilteredMilestones = () => {
    let filtered = milestonesArray;
    
    if (milestoneFilter !== 'all') {
      filtered = filtered.filter(m => m.category === milestoneFilter);
    }
    
    return filtered.sort((a, b) => {
      // Sort by priority and due date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      const aDate = new Date(a.dueDate || '2099-12-31');
      const bDate = new Date(b.dueDate || '2099-12-31');
      return aDate - bDate;
    });
  };

  // Old meeting handlers removed - using enhanced version below

  // Enhanced Document handlers
  const handleNewDoc = () => {
    setDocData({
      name: '',
      description: '',
      category: 'general',
      subcategory: '',
      file: null,
      tags: [],
      isPublic: false,
      permissions: [],
      version: '1.0',
      folderId: null
    });
    setEditingDoc(null);
    setShowDocModal(true);
  };

  const handleEditDoc = (doc) => {
    setDocData({
      ...doc,
      tags: doc.tags || [],
      permissions: doc.permissions || []
    });
    setEditingDoc(doc);
    setShowDocModal(true);
  };

  const handleDocFromTemplate = (template, category) => {
    setDocData({
      name: template.name,
      description: template.description,
      category: category,
      subcategory: '',
      file: null,
      tags: ['template'],
      isPublic: false,
      permissions: [],
      version: '1.0',
      folderId: null
    });
    setEditingDoc(null);
    setShowDocTemplates(false);
    setShowDocModal(true);
  };

  const handleDocChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDocData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocData(prev => ({
        ...prev,
        file: file,
        name: prev.name || file.name.split('.')[0],
        fileSize: file.size,
        fileType: file.type,
        filename: file.name
      }));
    }
  };

  const handleDocTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setDocData(prev => ({ ...prev, tags }));
  };

  const handlePermissionsChange = (e) => {
    const permissions = e.target.value.split(',').map(perm => perm.trim()).filter(perm => perm.length > 0);
    setDocData(prev => ({ ...prev, permissions }));
  };

  const handleDocSubmit = async (e) => {
    e.preventDefault();
    setDocSaving(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(docData).forEach(key => {
        if (key === 'tags' || key === 'permissions') {
          formData.append(key, JSON.stringify(docData[key]));
        } else if (key === 'file' && docData[key]) {
          formData.append('file', docData[key]);
        } else if (docData[key] !== null && docData[key] !== undefined) {
          formData.append(key, docData[key]);
        }
      });

      const submitData = {
        ...docData,
        id: editingDoc ? editingDoc.id : Date.now(),
        uploadDate: editingDoc ? editingDoc.uploadDate : new Date().toISOString(),
        lastModified: new Date().toISOString(),
        uploadedBy: 'Current User', // Would be actual user in real app
        size: docData.file ? docData.file.size : editingDoc?.size || 0,
        downloads: editingDoc?.downloads || 0,
        views: editingDoc?.views || 0
      };

      if (editingDoc) {
        const { statusCode, data } = await Api.putRequest(`/api/startup/documents/${editingDoc.id}`, submitData);
        if (statusCode === 200 && data) {
          setDocuments(prev => Array.isArray(prev) ? prev.map(d => d.id === editingDoc.id ? submitData : d) : [submitData]);
        } else {
          setDocuments(prev => Array.isArray(prev) ? prev.map(d => d.id === editingDoc.id ? submitData : d) : [submitData]);
        }
      } else {
        const { statusCode, data } = await Api.postRequest('/api/startup/documents', submitData);
        if (statusCode === 201 && data) {
          setDocuments(prev => Array.isArray(prev) ? [submitData, ...prev] : [submitData]);
        } else {
          setDocuments(prev => Array.isArray(prev) ? [submitData, ...prev] : [submitData]);
        }
      }

      setShowDocModal(false);
      alert(editingDoc ? 'Document updated successfully!' : 'Document uploaded successfully!');
    } catch (error) {
      console.error('Document save error:', error);
      
      const submitData = {
        ...docData,
        id: editingDoc ? editingDoc.id : Date.now(),
        uploadDate: editingDoc ? editingDoc.uploadDate : new Date().toISOString(),
        lastModified: new Date().toISOString(),
        uploadedBy: 'Current User',
        size: docData.file ? docData.file.size : editingDoc?.size || 0,
        downloads: editingDoc?.downloads || 0,
        views: editingDoc?.views || 0
      };

      if (editingDoc) {
        setDocuments(prev => Array.isArray(prev) ? prev.map(d => d.id === editingDoc.id ? submitData : d) : [submitData]);
      } else {
        setDocuments(prev => Array.isArray(prev) ? [submitData, ...prev] : [submitData]);
      }

      setShowDocModal(false);
      alert(editingDoc ? 'Document updated successfully! (Demo mode)' : 'Document uploaded successfully! (Demo mode)');
    }

    setDocSaving(false);
  };

  const deleteDocument = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await Api.deleteRequest(`/api/startup/documents/${docId}`);
        setDocuments(prev => Array.isArray(prev) ? prev.filter(d => d.id !== docId) : []);
        alert('Document deleted successfully!');
      } catch (error) {
        setDocuments(prev => Array.isArray(prev) ? prev.filter(d => d.id !== docId) : []);
        alert('Document deleted successfully! (Demo mode)');
      }
    }
  };

  const downloadDocument = (doc) => {
    if (doc.file && typeof doc.file === 'object') {
      // Handle file object
      const url = URL.createObjectURL(doc.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.filename || doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (doc.url) {
      // Handle URL
      window.open(doc.url, '_blank');
    }
    
    // Update download count
    setDocuments(prev => Array.isArray(prev) ? prev.map(d => 
      d.id === doc.id ? { ...d, downloads: (d.downloads || 0) + 1 } : d
    ) : []);
  };

  const shareDocument = (doc) => {
    const shareUrl = `${window.location.origin}/documents/${doc.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    }).catch(() => {
      alert(`Share this link: ${shareUrl}`);
    });
  };

  const favoriteDocument = (docId) => {
    setDocuments(prev => Array.isArray(prev) ? prev.map(d => 
      d.id === docId ? { ...d, isFavorite: !d.isFavorite } : d
    ) : []);
  };

  const getFilteredDocuments = () => {
    let filtered = documentsArray;

    // Apply search filter
    if (docSearchTerm) {
      filtered = filtered.filter(doc => 
        doc.name?.toLowerCase().includes(docSearchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(docSearchTerm.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(docSearchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (docCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === docCategory);
    }

    // Apply view filter
    switch (docFilter) {
      case 'recent':
        filtered = filtered.filter(doc => {
          const uploadDate = new Date(doc.uploadDate);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return uploadDate > weekAgo;
        });
        break;
      case 'shared':
        filtered = filtered.filter(doc => doc.isPublic || doc.permissions?.length > 0);
        break;
      case 'favorites':
        filtered = filtered.filter(doc => doc.isFavorite);
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => new Date(b.lastModified || b.uploadDate) - new Date(a.lastModified || a.uploadDate));
  };

  // Folder management
  const handleNewFolder = () => {
    setFolderData({ name: '', description: '', parentId: null });
    setShowFolderModal(true);
  };

  const handleFolderSubmit = async (e) => {
    e.preventDefault();
    const newFolder = {
      ...folderData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      documents: []
    };
    
    setFolders(prev => [...prev, newFolder]);
    setShowFolderModal(false);
    alert('Folder created successfully!');
  };

  // Enhanced Announcements handlers
  const handleNewAnnouncement = () => {
    setAnnouncementData({
      title: '',
      content: '',
      type: 'general',
      priority: 'medium',
      category: 'company',
      tags: [],
      scheduledDate: '',
      expiryDate: '',
      isUrgent: false,
      isPinned: false,
      isPublic: true,
      targetAudience: 'all',
      attachments: [],
      reactions: { likes: 0, dislikes: 0, heart: 0, clap: 0 },
      comments: [],
      views: 0,
      readBy: []
    });
    setEditingAnnouncement(null);
    setShowAnnouncementModal(true);
  };

  const handleEditAnnouncement = (announcement) => {
    setAnnouncementData({
      ...announcement,
      tags: announcement.tags || [],
      attachments: announcement.attachments || [],
      reactions: announcement.reactions || { likes: 0, dislikes: 0, heart: 0, clap: 0 },
      comments: announcement.comments || [],
      readBy: announcement.readBy || []
    });
    setEditingAnnouncement(announcement);
    setShowAnnouncementModal(true);
  };

  const handleAnnouncementFromTemplate = (template, category) => {
    setAnnouncementData({
      title: template.title,
      content: template.content,
      type: template.type,
      priority: template.priority,
      category: category,
      tags: ['template'],
      scheduledDate: '',
      expiryDate: '',
      isUrgent: template.priority === 'urgent',
      isPinned: false,
      isPublic: true,
      targetAudience: 'all',
      attachments: [],
      reactions: { likes: 0, dislikes: 0, heart: 0, clap: 0 },
      comments: [],
      views: 0,
      readBy: []
    });
    setEditingAnnouncement(null);
    setShowAnnouncementTemplates(false);
    setShowAnnouncementModal(true);
  };

  const handleAnnouncementChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAnnouncementData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAnnouncementTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setAnnouncementData(prev => ({ ...prev, tags }));
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setAnnouncementSaving(true);

    try {
      const submitData = {
        ...announcementData,
        id: editingAnnouncement ? editingAnnouncement.id : Date.now(),
        createdAt: editingAnnouncement ? editingAnnouncement.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'Current User', // Would be actual user in real app
        isActive: true,
        views: editingAnnouncement?.views || 0
      };

      if (editingAnnouncement) {
        const { statusCode, data } = await Api.putRequest(`/api/startup/announcements/${editingAnnouncement.id}`, submitData);
        if (statusCode === 200 && data) {
          setAnnouncements(prev => Array.isArray(prev) ? prev.map(a => a.id === editingAnnouncement.id ? submitData : a) : [submitData]);
        } else {
          setAnnouncements(prev => Array.isArray(prev) ? prev.map(a => a.id === editingAnnouncement.id ? submitData : a) : [submitData]);
        }
      } else {
        const { statusCode, data } = await Api.postRequest('/api/startup/announcements', submitData);
        if (statusCode === 201 && data) {
          setAnnouncements(prev => Array.isArray(prev) ? [submitData, ...prev] : [submitData]);
        } else {
          setAnnouncements(prev => Array.isArray(prev) ? [submitData, ...prev] : [submitData]);
        }
      }

      setShowAnnouncementModal(false);
      alert(editingAnnouncement ? 'Announcement updated successfully!' : 'Announcement created successfully!');
    } catch (error) {
      console.error('Announcement save error:', error);
      
      const submitData = {
        ...announcementData,
        id: editingAnnouncement ? editingAnnouncement.id : Date.now(),
        createdAt: editingAnnouncement ? editingAnnouncement.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'Current User',
        isActive: true,
        views: editingAnnouncement?.views || 0
      };

      if (editingAnnouncement) {
        setAnnouncements(prev => Array.isArray(prev) ? prev.map(a => a.id === editingAnnouncement.id ? submitData : a) : [submitData]);
      } else {
        setAnnouncements(prev => Array.isArray(prev) ? [submitData, ...prev] : [submitData]);
      }

      setShowAnnouncementModal(false);
      alert(editingAnnouncement ? 'Announcement updated successfully! (Demo mode)' : 'Announcement created successfully! (Demo mode)');
    }

    setAnnouncementSaving(false);
  };

  const deleteAnnouncement = async (announcementId) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await Api.deleteRequest(`/api/startup/announcements/${announcementId}`);
        setAnnouncements(prev => Array.isArray(prev) ? prev.filter(a => a.id !== announcementId) : []);
        alert('Announcement deleted successfully!');
      } catch (error) {
        setAnnouncements(prev => Array.isArray(prev) ? prev.filter(a => a.id !== announcementId) : []);
        alert('Announcement deleted successfully! (Demo mode)');
      }
    }
  };

  const pinAnnouncement = (announcementId) => {
    setAnnouncements(prev => Array.isArray(prev) ? prev.map(a => 
      a.id === announcementId ? { ...a, isPinned: !a.isPinned } : a
    ) : []);
  };

  const markAsUrgent = (announcementId) => {
    setAnnouncements(prev => Array.isArray(prev) ? prev.map(a => 
      a.id === announcementId ? { ...a, isUrgent: !a.isUrgent, priority: a.isUrgent ? 'medium' : 'urgent' } : a
    ) : []);
  };

  const reactToAnnouncement = (announcementId, reactionType) => {
    setAnnouncements(prev => Array.isArray(prev) ? prev.map(a => 
      a.id === announcementId ? {
        ...a,
        reactions: {
          ...a.reactions,
          [reactionType]: a.reactions[reactionType] + 1
        }
      } : a
    ) : []);
  };

  const markAsRead = (announcementId) => {
    setAnnouncements(prev => Array.isArray(prev) ? prev.map(a => 
      a.id === announcementId ? {
        ...a,
        views: a.views + 1,
        readBy: [...(a.readBy || []), 'Current User']
      } : a
    ) : []);
  };

  const getFilteredAnnouncements = () => {
    let filtered = announcementsArray;

    // Apply search filter
    if (announcementSearchTerm) {
      filtered = filtered.filter(announcement => 
        announcement.title?.toLowerCase().includes(announcementSearchTerm.toLowerCase()) ||
        announcement.content?.toLowerCase().includes(announcementSearchTerm.toLowerCase()) ||
        announcement.tags?.some(tag => tag.toLowerCase().includes(announcementSearchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (announcementFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.category === announcementFilter);
    }

    // Apply view filter
    switch (announcementView) {
      case 'urgent':
        filtered = filtered.filter(announcement => announcement.isUrgent || announcement.priority === 'urgent');
        break;
      case 'pinned':
        filtered = filtered.filter(announcement => announcement.isPinned);
        break;
      case 'recent':
        filtered = filtered.filter(announcement => {
          const createdDate = new Date(announcement.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdDate > weekAgo;
        });
        break;
      default:
        break;
    }

    // Sort by pinned first, then by date
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // File upload handlers for fundraising documents
  const validateFile = (file, fileType) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Please upload PDF, Word, PowerPoint, or image files.`;
    }

    if (file.size > maxSize) {
      return `File size too large. Maximum size is 10MB.`;
    }

    return null;
  };

  const handlePitchDeckFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFile(file, 'pitchDeck');
      if (error) {
        setPitchDeckError(error);
        setPitchDeckFile(null);
        return;
      }
      setPitchDeckFile(file);
      setPitchDeckError('');
    }
  };

  const handleBusinessCanvasFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFile(file, 'businessCanvas');
      if (error) {
        setBusinessCanvasError(error);
        setBusinessCanvasFile(null);
        return;
      }
      setBusinessCanvasFile(file);
      setBusinessCanvasError('');
    }
  };

  const uploadFile = async (file, setProgress, setUploading, setError, fileType) => {
    setUploading(true);
    setProgress(0);
    setError('');

    try {
      // Simulate file processing
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          const fileData = e.target.result;
          
          // Simulate upload progress
          for (let i = 0; i <= 100; i += 10) {
            setProgress(i);
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          try {
            // Try API upload
            const uploadData = {
              filename: file.name,
              fileType: file.type,
              fileSize: file.size,
              documentType: fileType,
              fileData: fileData.split(',')[1], // Remove data:mime;base64, prefix
              uploadMethod: 'file'
            };

            const response = await Api.postRequest('/api/startup/documents', uploadData);
            
            if (response.statusCode === 201) {
              const fileUrl = response.data?.url || `https://demo-startup-files.com/${Date.now()}-${file.name}`;
              resolve(fileUrl);
            } else {
              throw new Error('Upload failed');
            }
          } catch (apiError) {
            console.warn('Backend not available, simulating upload');
            // Fallback: Generate demo URL
            const demoUrl = `https://demo-startup-files.com/${Date.now()}-${file.name}`;
            resolve(demoUrl);
          }
        };

        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
      });
    } catch (error) {
      setError('Upload failed. Please try again.');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handlePitchDeckUpload = async () => {
    if (!pitchDeckFile) return;
    
    try {
      const fileUrl = await uploadFile(
        pitchDeckFile, 
        setPitchDeckUploadProgress, 
        setPitchDeckUploading, 
        setPitchDeckError,
        'pitchDeck'
      );
      
      setCampaignData(prev => ({ ...prev, pitchDeck: fileUrl }));
      alert('Pitch deck uploaded successfully!');
    } catch (error) {
      console.error('Pitch deck upload failed:', error);
    }
  };

  const handleBusinessCanvasUpload = async () => {
    if (!businessCanvasFile) return;
    
    try {
      const fileUrl = await uploadFile(
        businessCanvasFile, 
        setBusinessCanvasUploadProgress, 
        setBusinessCanvasUploading, 
        setBusinessCanvasError,
        'businessCanvas'
      );
      
      setCampaignData(prev => ({ ...prev, businessModelCanvas: fileUrl }));
      alert('Business model canvas uploaded successfully!');
    } catch (error) {
      console.error('Business canvas upload failed:', error);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePitchDeckDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const fakeEvent = { target: { files: [file] } };
      handlePitchDeckFileSelect(fakeEvent);
    }
  };

  const handleBusinessCanvasDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const fakeEvent = { target: { files: [file] } };
      handleBusinessCanvasFileSelect(fakeEvent);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Meeting templates for different types
  const meetingTemplates = [
    {
      type: 'team',
      templates: [
        {
          title: 'Daily Standup',
          description: 'Daily team synchronization meeting',
          duration: 15,
          recurring: true,
          recurringPattern: 'daily',
          agenda: ['What did you work on yesterday?', 'What will you work on today?', 'Any blockers or challenges?']
        },
        {
          title: 'Weekly Team Meeting',
          description: 'Weekly team review and planning',
          duration: 60,
          recurring: true,
          recurringPattern: 'weekly',
          agenda: ['Review last week\'s progress', 'Plan this week\'s priorities', 'Discuss challenges and solutions', 'Team announcements']
        },
        {
          title: 'Sprint Planning',
          description: 'Agile sprint planning session',
          duration: 120,
          agenda: ['Review sprint goals', 'Estimate user stories', 'Assign tasks', 'Define definition of done']
        }
      ]
    },
    {
      type: 'investor',
      templates: [
        {
          title: 'Investor Pitch Meeting',
          description: 'Present startup pitch to potential investors',
          duration: 45,
          agenda: ['Company overview', 'Problem and solution', 'Market opportunity', 'Business model', 'Financial projections', 'Funding ask', 'Q&A session']
        },
        {
          title: 'Monthly Investor Update',
          description: 'Regular update meeting with existing investors',
          duration: 30,
          recurring: true,
          recurringPattern: 'monthly',
          agenda: ['Key metrics update', 'Progress on milestones', 'Challenges and risks', 'Financial update', 'Upcoming plans']
        },
        {
          title: 'Due Diligence Meeting',
          description: 'Detailed review session for investment process',
          duration: 90,
          agenda: ['Financial deep dive', 'Technology review', 'Legal documentation', 'Team background', 'Market analysis']
        }
      ]
    },
    {
      type: 'client',
      templates: [
        {
          title: 'Customer Discovery Interview',
          description: 'Interview potential customers to understand needs',
          duration: 30,
          agenda: ['Problem validation', 'Current solution analysis', 'Pain point identification', 'Feature prioritization', 'Pricing discussion']
        },
        {
          title: 'Sales Demo',
          description: 'Product demonstration for potential customers',
          duration: 45,
          agenda: ['Company introduction', 'Product demo', 'Use case examples', 'Pricing presentation', 'Next steps discussion']
        },
        {
          title: 'Client Check-in',
          description: 'Regular meeting with existing clients',
          duration: 30,
          recurring: true,
          recurringPattern: 'monthly',
          agenda: ['Account review', 'Success metrics', 'Feature requests', 'Support issues', 'Upselling opportunities']
        }
      ]
    },
    {
      type: 'board',
      templates: [
        {
          title: 'Board Meeting',
          description: 'Quarterly board of directors meeting',
          duration: 120,
          recurring: true,
          recurringPattern: 'quarterly',
          agenda: ['CEO report', 'Financial review', 'Strategic updates', 'Risk assessment', 'Board resolutions', 'Executive session']
        },
        {
          title: 'Advisory Board Meeting',
          description: 'Meeting with advisory board members',
          duration: 90,
          agenda: ['Company updates', 'Strategic challenges', 'Market insights', 'Network introductions', 'Action items']
        }
      ]
    }
  ];

  // Meeting helper functions
  const getMeetingTypeIcon = (type) => {
    switch (type) {
      case 'team': return '👥';
      case 'investor': return '💰';
      case 'client': return '🤝';
      case 'board': return '📋';
      case 'partner': return '🤝';
      default: return '📅';
    }
  };

  const getMeetingStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#007bff';
      case 'in_progress': return '#28a745';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUpcomingMeeting = (dateTime) => {
    return new Date(dateTime) > new Date();
  };

  const isPastMeeting = (dateTime) => {
    const meetingDate = new Date(dateTime);
    const now = new Date();
    return meetingDate < now;
  };

  const isCurrentMeeting = (dateTime, duration) => {
    const now = new Date();
    const meetingStart = new Date(dateTime);
    const meetingEnd = new Date(meetingStart.getTime() + duration * 60000);
    return now >= meetingStart && now <= meetingEnd;
  };

  // Enhanced Meeting handlers
  const handleNewMeeting = () => {
    setMeetingData({
      title: '',
      description: '',
      type: 'team',
      dateTime: '',
      duration: 60,
      location: '',
      isVirtual: true,
      meetingLink: '',
      attendees: [],
      agenda: [],
      notes: '',
      actionItems: [],
      status: 'scheduled',
      recurring: false,
      recurringPattern: 'weekly'
    });
    setEditingMeeting(null);
    setShowMeetingModal(true);
  };

  const handleEditMeeting = (meeting) => {
    setMeetingData({ ...meeting });
    setEditingMeeting(meeting);
    setShowMeetingModal(true);
  };

  const handleMeetingFromTemplate = (template, type) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    setMeetingData({
      title: template.title,
      description: template.description,
      type: type,
      dateTime: tomorrow.toISOString().slice(0, 16),
      duration: template.duration,
      location: '',
      isVirtual: true,
      meetingLink: '',
      attendees: [],
      agenda: template.agenda || [],
      notes: '',
      actionItems: [],
      status: 'scheduled',
      recurring: template.recurring || false,
      recurringPattern: template.recurringPattern || 'weekly'
    });
    setEditingMeeting(null);
    setShowMeetingTemplates(false);
    setShowMeetingModal(true);
  };

  const handleMeetingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMeetingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAttendeesChange = (e) => {
    const attendees = e.target.value.split(',').map(attendee => attendee.trim()).filter(attendee => attendee.length > 0);
    setMeetingData(prev => ({ ...prev, attendees }));
  };

  const handleAgendaChange = (index, value) => {
    const newAgenda = [...meetingData.agenda];
    newAgenda[index] = value;
    setMeetingData(prev => ({ ...prev, agenda: newAgenda }));
  };

  const addAgendaItem = () => {
    setMeetingData(prev => ({ ...prev, agenda: [...prev.agenda, ''] }));
  };

  const removeAgendaItem = (index) => {
    const newAgenda = meetingData.agenda.filter((_, i) => i !== index);
    setMeetingData(prev => ({ ...prev, agenda: newAgenda }));
  };

  const handleActionItemsChange = (e) => {
    const actionItems = e.target.value.split('\n').map(item => item.trim()).filter(item => item.length > 0);
    setMeetingData(prev => ({ ...prev, actionItems }));
  };

  const handleMeetingSubmit = async (e) => {
    e.preventDefault();
    setMeetingSaving(true);

    try {
      const submitData = {
        ...meetingData,
        id: editingMeeting ? editingMeeting.id : Date.now(),
        createdAt: editingMeeting ? editingMeeting.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingMeeting) {
        const { statusCode, data } = await Api.putRequest(`/api/startup/meetings/${editingMeeting.id}`, submitData);
        if (statusCode === 200 && data) {
          setMeetings(prev => Array.isArray(prev) ? prev.map(m => m.id === editingMeeting.id ? submitData : m) : [submitData]);
        } else {
          setMeetings(prev => Array.isArray(prev) ? prev.map(m => m.id === editingMeeting.id ? submitData : m) : [submitData]);
        }
      } else {
        const { statusCode, data } = await Api.postRequest('/api/startup/meetings', submitData);
        if (statusCode === 201 && data) {
          setMeetings(prev => Array.isArray(prev) ? [submitData, ...prev] : [submitData]);
        } else {
          setMeetings(prev => Array.isArray(prev) ? [submitData, ...prev] : [submitData]);
        }
      }

      setShowMeetingModal(false);
      alert(editingMeeting ? 'Meeting updated successfully!' : 'Meeting scheduled successfully!');
    } catch (error) {
      console.error('Meeting save error:', error);
      
      const submitData = {
        ...meetingData,
        id: editingMeeting ? editingMeeting.id : Date.now(),
        createdAt: editingMeeting ? editingMeeting.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingMeeting) {
        setMeetings(prev => Array.isArray(prev) ? prev.map(m => m.id === editingMeeting.id ? submitData : m) : [submitData]);
      } else {
        setMeetings(prev => Array.isArray(prev) ? [submitData, ...prev] : [submitData]);
      }

      setShowMeetingModal(false);
      alert(editingMeeting ? 'Meeting updated successfully! (Demo mode)' : 'Meeting scheduled successfully! (Demo mode)');
    }

    setMeetingSaving(false);
  };

  const deleteMeeting = async (meetingId) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await Api.deleteRequest(`/api/startup/meetings/${meetingId}`);
        setMeetings(prev => Array.isArray(prev) ? prev.filter(m => m.id !== meetingId) : []);
        alert('Meeting deleted successfully!');
      } catch (error) {
        setMeetings(prev => Array.isArray(prev) ? prev.filter(m => m.id !== meetingId) : []);
        alert('Meeting deleted successfully! (Demo mode)');
      }
    }
  };

  const startMeeting = (meetingId) => {
    setMeetings(prev => Array.isArray(prev) ? prev.map(m => 
      m.id === meetingId ? { ...m, status: 'in_progress' } : m
    ) : []);
    alert('Meeting started! Status updated to In Progress.');
  };

  const completeMeeting = (meetingId) => {
    setMeetings(prev => Array.isArray(prev) ? prev.map(m => 
      m.id === meetingId ? { ...m, status: 'completed' } : m
    ) : []);
    alert('Meeting marked as completed!');
  };

  // Enhanced Meeting helpers - ensure meetings is always an array
  const meetingsArray = Array.isArray(meetings) ? meetings : [];

  // Document categories and templates
  const documentCategories = [
    {
      id: 'legal',
      name: 'Legal Documents',
      icon: '⚖️',
      subcategories: ['Incorporation', 'Contracts', 'Intellectual Property', 'Compliance', 'Terms & Conditions'],
      templates: [
        { name: 'Terms of Service Template', description: 'Standard terms of service for web applications' },
        { name: 'Privacy Policy Template', description: 'GDPR compliant privacy policy template' },
        { name: 'NDA Template', description: 'Non-disclosure agreement for business discussions' },
        { name: 'Employment Contract Template', description: 'Standard employment agreement template' }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Documents',
      icon: '💰',
      subcategories: ['Reports', 'Projections', 'Budgets', 'Tax Documents', 'Investment'],
      templates: [
        { name: 'Financial Model Template', description: 'Comprehensive startup financial model' },
        { name: 'Budget Template', description: 'Monthly and annual budget planning template' },
        { name: 'Invoice Template', description: 'Professional invoice template' },
        { name: 'Expense Report Template', description: 'Employee expense reporting template' }
      ]
    },
    {
      id: 'business',
      name: 'Business Plans',
      icon: '📋',
      subcategories: ['Business Plan', 'Market Research', 'Strategy', 'Operations', 'Analysis'],
      templates: [
        { name: 'Business Plan Template', description: 'Comprehensive business plan outline' },
        { name: 'Market Analysis Template', description: 'Market research and analysis framework' },
        { name: 'SWOT Analysis Template', description: 'Strengths, weaknesses, opportunities, threats analysis' },
        { name: 'Go-to-Market Strategy', description: 'Product launch and market entry strategy' }
      ]
    },
    {
      id: 'technical',
      name: 'Technical Docs',
      icon: '🔧',
      subcategories: ['Architecture', 'API Documentation', 'User Guides', 'Development', 'Testing'],
      templates: [
        { name: 'API Documentation Template', description: 'REST API documentation structure' },
        { name: 'Technical Specification', description: 'Software technical specification template' },
        { name: 'User Manual Template', description: 'End-user documentation template' },
        { name: 'Testing Plan Template', description: 'Software testing plan and procedures' }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing Materials',
      icon: '📢',
      subcategories: ['Brand Guidelines', 'Content', 'Campaigns', 'Social Media', 'Press'],
      templates: [
        { name: 'Brand Guidelines Template', description: 'Brand identity and usage guidelines' },
        { name: 'Content Calendar Template', description: 'Social media and content planning calendar' },
        { name: 'Press Release Template', description: 'Professional press release format' },
        { name: 'Marketing Plan Template', description: 'Comprehensive marketing strategy template' }
      ]
    },
    {
      id: 'hr',
      name: 'HR Documents',
      icon: '👥',
      subcategories: ['Policies', 'Handbooks', 'Forms', 'Training', 'Performance'],
      templates: [
        { name: 'Employee Handbook Template', description: 'Comprehensive employee handbook' },
        { name: 'Job Description Template', description: 'Standardized job description format' },
        { name: 'Performance Review Template', description: 'Employee performance evaluation form' },
        { name: 'Onboarding Checklist', description: 'New employee onboarding process' }
      ]
    },
    {
      id: 'general',
      name: 'General Documents',
      icon: '📄',
      subcategories: ['Presentations', 'Reports', 'Memos', 'Notes', 'Miscellaneous'],
      templates: [
        { name: 'Meeting Minutes Template', description: 'Structured meeting notes template' },
        { name: 'Project Proposal Template', description: 'Project proposal and planning template' },
        { name: 'Status Report Template', description: 'Weekly/monthly status report format' },
        { name: 'Presentation Template', description: 'Professional presentation slides template' }
      ]
    }
  ];

  // Document helper functions
  const getDocumentIcon = (category, fileType) => {
    if (fileType) {
      switch (fileType.toLowerCase()) {
        case 'pdf': return '📄';
        case 'doc':
        case 'docx': return '📝';
        case 'xls':
        case 'xlsx': return '📊';
        case 'ppt':
        case 'pptx': return '📈';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif': return '🖼️';
        case 'zip':
        case 'rar': return '📦';
        case 'txt': return '📋';
        default: return '📎';
      }
    }
    return documentCategories.find(cat => cat.id === category)?.icon || '📄';
  };



  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFileExtension = (filename) => {
    return filename ? filename.split('.').pop().toLowerCase() : '';
  };

  const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    return imageExtensions.includes(getFileExtension(filename));
  };

  const isDocumentFile = (filename) => {
    const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
    return docExtensions.includes(getFileExtension(filename));
  };

  // Enhanced document helpers - ensure documents is always an array
  const documentsArray = Array.isArray(documents) ? documents : [];

  // Announcement categories and templates
  const announcementCategories = [
    {
      id: 'company',
      name: 'Company News',
      icon: '🏢',
      color: '#0077b6',
      templates: [
        { 
          title: 'New Hire Announcement', 
          content: 'We are excited to welcome [Name] to our [Department] team as [Position]. [Name] brings [Years] years of experience in [Field] and will be focusing on [Responsibilities].',
          type: 'team',
          priority: 'medium'
        },
        { 
          title: 'Funding Announcement', 
          content: 'We are thrilled to announce that we have successfully raised $[Amount] in [Round] funding led by [Investor]. This funding will help us [Plans and Goals].',
          type: 'milestone',
          priority: 'high'
        },
        { 
          title: 'Office Update', 
          content: 'Important update regarding our office operations: [Details]. This change will take effect on [Date]. Please reach out if you have any questions.',
          type: 'operational',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'product',
      name: 'Product Updates',
      icon: '🚀',
      color: '#28a745',
      templates: [
        { 
          title: 'New Feature Launch', 
          content: 'We are excited to introduce [Feature Name]! This new feature allows users to [Description]. Available now for all [User Type] users.',
          type: 'feature',
          priority: 'high'
        },
        { 
          title: 'Product Roadmap Update', 
          content: 'Here is what we are working on for [Quarter/Month]: [List of Features]. We expect to release these updates by [Timeline].',
          type: 'roadmap',
          priority: 'medium'
        },
        { 
          title: 'Bug Fix Notification', 
          content: 'We have identified and fixed an issue with [Component/Feature]. The fix has been deployed and should resolve [Problem Description].',
          type: 'maintenance',
          priority: 'low'
        }
      ]
    },
    {
      id: 'team',
      name: 'Team Updates',
      icon: '👥',
      color: '#6f42c1',
      templates: [
        { 
          title: 'Team Meeting Summary', 
          content: 'Key takeaways from our [Meeting Type] on [Date]: [Summary Points]. Next meeting scheduled for [Next Date].',
          type: 'meeting',
          priority: 'medium'
        },
        { 
          title: 'Team Achievement', 
          content: 'Congratulations to [Team/Person] for achieving [Achievement]! This milestone represents [Impact] and shows our commitment to [Values].',
          type: 'celebration',
          priority: 'medium'
        },
        { 
          title: 'Training Announcement', 
          content: 'We are organizing [Training Topic] training for all [Target Group]. The session will be held on [Date] at [Time]. Please confirm your attendance.',
          type: 'training',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'hr',
      name: 'HR & Policies',
      icon: '📋',
      color: '#fd7e14',
      templates: [
        { 
          title: 'Policy Update', 
          content: 'We have updated our [Policy Name] policy. Key changes include: [Changes]. Please review the updated policy document in our handbook.',
          type: 'policy',
          priority: 'high'
        },
        { 
          title: 'Benefits Reminder', 
          content: 'Reminder: [Benefit Name] enrollment/renewal period ends on [Date]. Please make sure to [Action Required] by the deadline.',
          type: 'benefits',
          priority: 'medium'
        },
        { 
          title: 'Holiday Schedule', 
          content: 'Here are the upcoming holidays and office closure dates: [Holiday List]. Please plan your work accordingly.',
          type: 'schedule',
          priority: 'low'
        }
      ]
    },
    {
      id: 'events',
      name: 'Events & Activities',
      icon: '🎉',
      color: '#dc3545',
      templates: [
        { 
          title: 'Company Event', 
          content: 'Join us for [Event Name] on [Date] at [Location/Virtual]. We will be [Event Description]. Food and refreshments will be provided.',
          type: 'social',
          priority: 'medium'
        },
        { 
          title: 'Industry Conference', 
          content: 'Our team will be attending [Conference Name] on [Dates]. Stop by our booth [Number] or schedule a meeting with [Team Members].',
          type: 'conference',
          priority: 'low'
        },
        { 
          title: 'Webinar Invitation', 
          content: 'You are invited to our upcoming webinar: "[Title]" on [Date] at [Time]. Register at [Link] to secure your spot.',
          type: 'webinar',
          priority: 'medium'
        }
      ]
    },
    {
      id: 'general',
      name: 'General',
      icon: '📢',
      color: '#6c757d',
      templates: [
        { 
          title: 'Important Reminder', 
          content: 'This is a reminder about [Topic]. Please make sure to [Action] by [Deadline]. Contact [Contact Person] if you have questions.',
          type: 'reminder',
          priority: 'medium'
        },
        { 
          title: 'System Maintenance', 
          content: 'Scheduled maintenance for [System Name] on [Date] from [Start Time] to [End Time]. During this time, [Impact Description].',
          type: 'maintenance',
          priority: 'urgent'
        },
        { 
          title: 'Survey Request', 
          content: 'We value your feedback! Please take a few minutes to complete our [Survey Topic] survey at [Link]. Your responses will help us [Purpose].',
          type: 'feedback',
          priority: 'low'
        }
      ]
    }
  ];

  // Announcement helper functions
  const getAnnouncementIcon = (type) => {
    const icons = {
      general: '📢',
      urgent: '🚨',
      milestone: '🎯',
      feature: '✨',
      maintenance: '🔧',
      team: '👥',
      hr: '📋',
      social: '🎉',
      meeting: '📅',
      policy: '📜',
      reminder: '⏰',
      celebration: '🎊',
      training: '📚',
      conference: '🏆',
      webinar: '💻',
      benefits: '💰',
      schedule: '📆',
      feedback: '💬',
      roadmap: '🗺️',
      operational: '⚙️'
    };
    return icons[type] || '📢';
  };



  const getPriorityIcon = (priority) => {
    const icons = {
      urgent: '🚨',
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
    return icons[priority] || '⚪';
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  // Enhanced announcement helpers - ensure announcements is always an array
  const announcementsArray = Array.isArray(announcements) ? announcements : [];

  const getFilteredMeetings = () => {
    switch (meetingView) {
      case 'upcoming':
        return meetingsArray.filter(m => isUpcomingMeeting(m.dateTime));
      case 'past':
        return meetingsArray.filter(m => isPastMeeting(m.dateTime));
      case 'calendar':
        return meetingsArray;
      default:
        return meetingsArray;
    }
  };

  // Investor connect (mocked)
  const handleConnect = (investorId) => {
    alert('Connection request sent to investor: ' + investorId);
  };

  // View investor profile
  const handleViewInvestorProfile = async (investor) => {
    setSelectedInvestor(null); // Clear previous data
    setShowInvestorProfileModal(true);
    setInvestorProfileLoading(true);

    try {
      // Always try to fetch the most up-to-date investor profile from API
      console.log(`Fetching fresh investor profile for: ${investor._id}`);
      const response = await Api.getRequest(`/api/investor/profile/${investor._id}`);
      
      if (response && response.statusCode === 200) {
        // Backend available - use real, up-to-date profile data
        const detailedProfile = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        console.log('✅ Fresh investor profile loaded from backend');
        setSelectedInvestor({
          ...detailedProfile,
          _isLiveData: true, // Flag to indicate this is live data
          _lastUpdated: new Date().toISOString()
        });
      } else {
        // Backend not available - create enhanced demo profile
        console.warn('⚠️ Backend not available, creating demo investor profile');
        const enhancedProfile = createDemoInvestorProfile(investor);
        setSelectedInvestor({
          ...enhancedProfile,
          _isLiveData: false, // Flag to indicate this is demo data
          _lastUpdated: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('❌ Error fetching investor profile:', error);
      // Network error - create enhanced demo profile
      const enhancedProfile = createDemoInvestorProfile(investor);
      setSelectedInvestor({
        ...enhancedProfile,
        _isLiveData: false,
        _lastUpdated: new Date().toISOString()
      });
    }
    
    setInvestorProfileLoading(false);
  };

  // Helper function to create consistent demo investor profile
  const createDemoInvestorProfile = (investor) => {
    // Create realistic demo data that varies based on investor info
    const demoIndustries = ['Technology', 'Healthcare', 'FinTech', 'EdTech', 'E-commerce', 'SaaS'];
    const demoStages = ['Seed', 'Pre-Series A', 'Series A', 'Series B'];
    const locations = ['Mumbai, India', 'Bangalore, India', 'Delhi, India', 'Pune, India', 'Hyderabad, India'];
    
    // Use investor name/id to create consistent demo data
    const hash = investor._id ? investor._id.length : investor.name?.length || 5;
    
    return {
      ...investor,
      bio: investor.bio || `Experienced investor with ${5 + (hash % 10)} years in venture capital. Passionate about supporting innovative startups with strong growth potential and exceptional founding teams. Focus on early-stage investments in technology-driven companies.`,
      location: investor.location || locations[hash % locations.length],
      website: investor.website || `https://${(investor.name || 'investor').toLowerCase().replace(/\s+/g, '')}-portfolio.com`,
      investmentFocus: investor.investmentFocus || demoIndustries.slice(0, 2 + (hash % 3)),
      ticketSize: investor.ticketSize || ['$10K - $50K', '$25K - $100K', '$50K - $250K'][hash % 3],
      companiesInvested: investor.companiesInvested || (15 + (hash % 20)),
      totalInvestment: investor.totalInvestment || [`$${1 + (hash % 3)}.${2 + (hash % 8)}M`, `$${2 + (hash % 5)}.${1 + (hash % 9)}M`][hash % 2],
      investmentStage: investor.investmentStage || demoStages.slice(0, 2 + (hash % 3)),
      industries: investor.industries || demoIndustries.slice(0, 3 + (hash % 4)),
      portfolioHighlights: investor.portfolioHighlights || [
        `Led ${1 + (hash % 3)} successful Series A rounds`,
        `Advisor to ${10 + (hash % 15)}+ companies`,
        `Former ${['entrepreneur', 'executive', 'consultant'][hash % 3]} with ${1 + (hash % 2)} exits`,
        `Focused on ${demoIndustries[hash % demoIndustries.length]} sector investments`
      ]
    };
  };

  const handleCloseInvestorProfile = () => {
    setShowInvestorProfileModal(false);
    setSelectedInvestor(null);
  };

  if (loading) return <Main><div>Loading dashboard...</div></Main>;

  return (
    <Container>
      <Sidebar>
        <SidebarLink active={selectedSection === 'profile'} onClick={() => setSelectedSection('profile')}><FaUser /> Profile</SidebarLink>
        <SidebarLink active={selectedSection === 'fundraising'} onClick={() => setSelectedSection('fundraising')}><FaMoneyBill /> Fundraising</SidebarLink>
        <SidebarLink active={selectedSection === 'milestones'} onClick={() => setSelectedSection('milestones')}><FaChartLine /> Goals & Milestones</SidebarLink>
        <SidebarLink active={selectedSection === 'investors'} onClick={() => setSelectedSection('investors')}><FaHandshake /> Investors</SidebarLink>
        <SidebarLink active={selectedSection === 'meetings'} onClick={() => setSelectedSection('meetings')}><FaHandshake /> Meetings</SidebarLink>
        <SidebarLink active={selectedSection === 'documents'} onClick={() => setSelectedSection('documents')}><FaFileAlt /> Documents</SidebarLink>
        <SidebarLink active={selectedSection === 'announcements'} onClick={() => setSelectedSection('announcements')}><FaBullhorn /> Announcements</SidebarLink>
        <SidebarLink active={selectedSection === 'resources'} onClick={() => setSelectedSection('resources')}><FaLightbulb /> Resources</SidebarLink>
      </Sidebar>
      <Main>
        {selectedSection === 'profile' && (
          <Section>
            <SectionTitle><FaUser /> Welcome, {profile?.tagline || profile?.user?.name || 'Startup'}</SectionTitle>
            
            {/* Logo and Basic Info */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {profile?.logo && (
                  <img 
                    src={profile.logo} 
                    alt="Company Logo" 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '12px', 
                      border: '2px solid #e0f7fa',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div>
                  <h3 style={{ margin: 0, color: '#0077b6' }}>{profile?.tagline || 'Company Name Not Set'}</h3>
                  <p style={{ margin: '0.5rem 0', color: '#666', fontStyle: 'italic' }}>
                    {profile?.description || 'No description provided'}
                  </p>
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <span>Profile Setup: </span>
                  <b style={{ color: progress > 70 ? '#28a745' : progress > 40 ? '#ffc107' : '#dc3545' }}>
                    {progress}%
                  </b>
                </div>
                <ProgressBar><Progress value={progress} /></ProgressBar>
                <EditButton onClick={handleEdit} style={{ marginTop: '1rem' }}>
                  <FaEdit /> Edit Profile
                </EditButton>
              </div>
            </div>

            {/* Detailed Information Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}>
              {/* Company Details */}
              <div style={{ 
                background: '#f8f9fa', 
                padding: '1.5rem', 
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{ color: '#0077b6', marginBottom: '1rem' }}>🏢 Company Details</h4>
                <div style={{ lineHeight: '1.8' }}>
                  <div><b>Industry:</b> {profile?.industry || '-'}</div>
                  <div><b>Stage:</b> {profile?.stage || '-'}</div>
                  <div><b>Founded:</b> {profile?.foundedYear || '-'}</div>
                  <div><b>Employees:</b> {profile?.employees || '-'}</div>
                  <div><b>Funding Ask:</b> {profile?.fundingAsk ? `₹${Number(profile.fundingAsk).toLocaleString()}` : '-'}</div>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ 
                background: '#f8f9fa', 
                padding: '1.5rem', 
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{ color: '#0077b6', marginBottom: '1rem' }}>📞 Contact Information</h4>
                <div style={{ lineHeight: '1.8' }}>
                  <div><b>Location:</b> {profile?.location || '-'}</div>
                  <div><b>Email:</b> {profile?.email ? 
                    <a href={`mailto:${profile.email}`} style={{ color: '#00b4d8' }}>{profile.email}</a> : '-'
                  }</div>
                  <div><b>WhatsApp:</b> {profile?.whatsapp ? 
                    <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: '#00b4d8' }}>
                      {profile.whatsapp}
                    </a> : '-'
                  }</div>
                  <div><b>Website:</b> {profile?.website ? 
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#00b4d8' }}>
                      {profile.website}
                    </a> : '-'
                  }</div>
                </div>
              </div>

              {/* Team Information */}
              <div style={{ 
                background: '#f8f9fa', 
                padding: '1.5rem', 
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{ color: '#0077b6', marginBottom: '1rem' }}>👥 Team</h4>
                <div style={{ lineHeight: '1.8' }}>
                  {profile?.team && Array.isArray(profile.team) && profile.team.length > 0 ? (
                    <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                      {profile.team.map((member, index) => (
                        <li key={index} style={{ marginBottom: '0.3rem' }}>{member}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: 0, color: '#666' }}>No team members added</p>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Completion Tips */}
            {progress < 100 && (
              <div style={{ 
                marginTop: '2rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
                borderRadius: '12px',
                border: '1px solid #bbdefb'
              }}>
                <h5 style={{ color: '#0077b6', marginBottom: '0.5rem' }}>💡 Complete your profile to attract more investors:</h5>
                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                  {!profile?.logo && <span>• Add company logo • </span>}
                  {!profile?.description && <span>• Add company description • </span>}
                  {!profile?.website && <span>• Add website URL • </span>}
                  {!profile?.fundingAsk && <span>• Specify funding requirement • </span>}
                  {!profile?.foundedYear && <span>• Add founding year • </span>}
                  {(!profile?.team || profile.team.length === 0) && <span>• Add team members • </span>}
                </div>
              </div>
            )}
          </Section>
        )}
        {selectedSection === 'fundraising' && (
          <Section>
            <SectionTitle><FaMoneyBill /> Fundraising Status</SectionTitle>
            
            {/* Campaign Status */}
            {campaigns && campaigns.length > 0 ? (
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <div><b>Current Round:</b> {campaigns[0].round}</div>
                  <div><b>Amount Sought:</b> ₹{campaigns[0].amountSought?.toLocaleString()}</div>
                  <div><b>Amount Raised:</b> ₹{campaigns[0].amountRaised?.toLocaleString() || '0'}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div>Progress:</div>
                  <ProgressBar><Progress value={fundraisingProgress} /></ProgressBar>
                </div>
                <div>
                  <EditButton onClick={handleNewCampaign}><FaPlus /> Create New Campaign</EditButton>
                </div>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                background: '#f8f9fa', 
                borderRadius: '12px',
                marginBottom: '2rem'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
                <h4>No Active Fundraising Campaign</h4>
                <p style={{ color: '#666', marginBottom: '1rem' }}>Start your fundraising journey by creating a campaign</p>
                <EditButton onClick={handleNewCampaign}><FaPlus /> Create Your First Campaign</EditButton>
              </div>
            )}

            {/* Document Upload Section */}
            <div style={{ 
              background: '#f8f9fa', 
              padding: '2rem', 
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ color: '#0077b6', marginBottom: '1.5rem' }}>📄 Essential Documents</h4>
              
              {/* Pitch Deck Upload */}
              <div style={{ marginBottom: '2rem' }}>
                <h5 style={{ color: '#0077b6', marginBottom: '1rem' }}>📊 Pitch Deck</h5>
                
                {/* Upload Method Toggle */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <button
                    onClick={() => setPitchDeckMethod('file')}
                    style={{
                      background: pitchDeckMethod === 'file' ? '#0077b6' : '#e9ecef',
                      color: pitchDeckMethod === 'file' ? 'white' : '#333',
                      border: 'none',
                      padding: '0.7rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    📁 Upload from PC
                  </button>
                  <button
                    onClick={() => setPitchDeckMethod('url')}
                    style={{
                      background: pitchDeckMethod === 'url' ? '#0077b6' : '#e9ecef',
                      color: pitchDeckMethod === 'url' ? 'white' : '#333',
                      border: 'none',
                      padding: '0.7rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    🔗 Add URL Link
                  </button>
                </div>

                {/* File Upload Method */}
                {pitchDeckMethod === 'file' ? (
                  <div>
                    <div 
                      style={{
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        padding: '2rem',
                        textAlign: 'center',
                        background: pitchDeckFile ? '#f0f8ff' : '#fafafa',
                        transition: 'all 0.3s'
                      }}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handlePitchDeckDrop}
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                        onChange={handlePitchDeckFileSelect}
                        style={{ display: 'none' }}
                        id="pitchDeckFileInput"
                      />
                      
                      {pitchDeckFile ? (
                        <div>
                          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄</div>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{pitchDeckFile.name}</div>
                          <div style={{ color: '#666', marginBottom: '1rem' }}>{formatFileSize(pitchDeckFile.size)}</div>
                          
                          {pitchDeckUploading && (
                            <div style={{ marginBottom: '1rem' }}>
                              <div>Uploading... {pitchDeckUploadProgress}%</div>
                              <ProgressBar><Progress value={pitchDeckUploadProgress} /></ProgressBar>
                            </div>
                          )}
                          
                          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <EditButton 
                              onClick={handlePitchDeckUpload}
                              disabled={pitchDeckUploading}
                              style={{ background: '#28a745' }}
                            >
                              {pitchDeckUploading ? '⏳ Uploading...' : '📤 Upload File'}
                            </EditButton>
                            <EditButton 
                              onClick={() => {
                                setPitchDeckFile(null);
                                setPitchDeckError('');
                                document.getElementById('pitchDeckFileInput').value = '';
                              }}
                              style={{ background: '#6c757d' }}
                            >
                              🗑️ Remove
                            </EditButton>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                          <div style={{ marginBottom: '1rem' }}>
                            <label 
                              htmlFor="pitchDeckFileInput"
                              style={{ 
                                cursor: 'pointer', 
                                color: '#0077b6',
                                textDecoration: 'underline'
                              }}
                            >
                              Click to upload
                            </label> or drag and drop
                          </div>
                          <div style={{ color: '#666', fontSize: '0.9rem' }}>
                            PDF, Word, PowerPoint, or Image files (Max 10MB)
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {pitchDeckError && (
                      <div style={{ 
                        color: '#dc3545', 
                        background: '#f8d7da', 
                        padding: '0.7rem', 
                        borderRadius: '6px',
                        border: '1px solid #f5c6cb',
                        marginTop: '1rem'
                      }}>
                        ❌ {pitchDeckError}
                      </div>
                    )}
                  </div>
                ) : (
                  /* URL Method */
                  <div>
                    <input
                      type="url"
                      placeholder="Enter pitch deck URL (Google Drive, Dropbox, etc.)"
                      value={campaignData.pitchDeck || ''}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, pitchDeck: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                )}

                {/* Current Pitch Deck Display */}
                {campaignData.pitchDeck && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    background: '#e8f5e8', 
                    borderRadius: '6px',
                    border: '1px solid #c3e6cb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>✅</span>
                      <span><b>Current Pitch Deck:</b></span>
                      <a 
                        href={campaignData.pitchDeck} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#0077b6' }}
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Business Model Canvas Upload */}
              <div>
                <h5 style={{ color: '#0077b6', marginBottom: '1rem' }}>📋 Business Model Canvas</h5>
                
                {/* Upload Method Toggle */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <button
                    onClick={() => setBusinessCanvasMethod('file')}
                    style={{
                      background: businessCanvasMethod === 'file' ? '#0077b6' : '#e9ecef',
                      color: businessCanvasMethod === 'file' ? 'white' : '#333',
                      border: 'none',
                      padding: '0.7rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    📁 Upload from PC
                  </button>
                  <button
                    onClick={() => setBusinessCanvasMethod('url')}
                    style={{
                      background: businessCanvasMethod === 'url' ? '#0077b6' : '#e9ecef',
                      color: businessCanvasMethod === 'url' ? 'white' : '#333',
                      border: 'none',
                      padding: '0.7rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    🔗 Add URL Link
                  </button>
                </div>

                {/* File Upload Method */}
                {businessCanvasMethod === 'file' ? (
                  <div>
                    <div 
                      style={{
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        padding: '2rem',
                        textAlign: 'center',
                        background: businessCanvasFile ? '#f0f8ff' : '#fafafa',
                        transition: 'all 0.3s'
                      }}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleBusinessCanvasDrop}
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                        onChange={handleBusinessCanvasFileSelect}
                        style={{ display: 'none' }}
                        id="businessCanvasFileInput"
                      />
                      
                      {businessCanvasFile ? (
                        <div>
                          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄</div>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{businessCanvasFile.name}</div>
                          <div style={{ color: '#666', marginBottom: '1rem' }}>{formatFileSize(businessCanvasFile.size)}</div>
                          
                          {businessCanvasUploading && (
                            <div style={{ marginBottom: '1rem' }}>
                              <div>Uploading... {businessCanvasUploadProgress}%</div>
                              <ProgressBar><Progress value={businessCanvasUploadProgress} /></ProgressBar>
                            </div>
                          )}
                          
                          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <EditButton 
                              onClick={handleBusinessCanvasUpload}
                              disabled={businessCanvasUploading}
                              style={{ background: '#28a745' }}
                            >
                              {businessCanvasUploading ? '⏳ Uploading...' : '📤 Upload File'}
                            </EditButton>
                            <EditButton 
                              onClick={() => {
                                setBusinessCanvasFile(null);
                                setBusinessCanvasError('');
                                document.getElementById('businessCanvasFileInput').value = '';
                              }}
                              style={{ background: '#6c757d' }}
                            >
                              🗑️ Remove
                            </EditButton>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                          <div style={{ marginBottom: '1rem' }}>
                            <label 
                              htmlFor="businessCanvasFileInput"
                              style={{ 
                                cursor: 'pointer', 
                                color: '#0077b6',
                                textDecoration: 'underline'
                              }}
                            >
                              Click to upload
                            </label> or drag and drop
                          </div>
                          <div style={{ color: '#666', fontSize: '0.9rem' }}>
                            PDF, Word, PowerPoint, or Image files (Max 10MB)
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {businessCanvasError && (
                      <div style={{ 
                        color: '#dc3545', 
                        background: '#f8d7da', 
                        padding: '0.7rem', 
                        borderRadius: '6px',
                        border: '1px solid #f5c6cb',
                        marginTop: '1rem'
                      }}>
                        ❌ {businessCanvasError}
                      </div>
                    )}
                  </div>
                ) : (
                  /* URL Method */
                  <div>
                    <input
                      type="url"
                      placeholder="Enter business model canvas URL (Google Drive, Dropbox, etc.)"
                      value={campaignData.businessModelCanvas || ''}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, businessModelCanvas: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                )}

                {/* Current Business Canvas Display */}
                {campaignData.businessModelCanvas && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    background: '#e8f5e8', 
                    borderRadius: '6px',
                    border: '1px solid #c3e6cb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>✅</span>
                      <span><b>Current Business Canvas:</b></span>
                      <a 
                        href={campaignData.businessModelCanvas} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#0077b6' }}
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Tips */}
              <div style={{ 
                marginTop: '2rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
                borderRadius: '8px',
                border: '1px solid #bbdefb'
              }}>
                <h6 style={{ color: '#0077b6', marginBottom: '0.5rem' }}>💡 Document Tips:</h6>
                <ul style={{ fontSize: '0.9rem', color: '#555', margin: 0, paddingLeft: '1.2rem' }}>
                  <li>Keep your pitch deck under 15 slides for better investor engagement</li>
                  <li>Include clear problem, solution, market size, and financial projections</li>
                  <li>Business model canvas should be visual and easy to understand</li>
                  <li>Ensure documents are up-to-date with latest company information</li>
                </ul>
              </div>
            </div>
          </Section>
        )}
        {selectedSection === 'milestones' && (
          <Section>
            {/* Header with controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <SectionTitle style={{ margin: 0 }}><FaChartLine /> Goals & Milestones</SectionTitle>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* View Toggle */}
                <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setMilestoneView('grid')}
                    style={{
                      background: milestoneView === 'grid' ? '#0077b6' : '#fff',
                      color: milestoneView === 'grid' ? '#fff' : '#333',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    📊 Grid
                  </button>
                  <button
                    onClick={() => setMilestoneView('timeline')}
                    style={{
                      background: milestoneView === 'timeline' ? '#0077b6' : '#fff',
                      color: milestoneView === 'timeline' ? '#fff' : '#333',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    📅 Timeline
                  </button>
                  <button
                    onClick={() => setMilestoneView('analytics')}
                    style={{
                      background: milestoneView === 'analytics' ? '#0077b6' : '#fff',
                      color: milestoneView === 'analytics' ? '#fff' : '#333',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    📈 Analytics
                  </button>
                </div>
                
                {/* Action buttons */}
                <EditButton onClick={() => setShowMilestoneTemplates(true)} style={{ background: '#17a2b8' }}>
                  📋 Templates
                </EditButton>
                <EditButton onClick={handleNewMilestone}>
                  <FaPlus /> Add Milestone
                </EditButton>
              </div>
            </div>

            {/* Overall Progress Summary */}
            <div style={{ 
              background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)', 
              padding: '1.5rem', 
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#0077b6' }}>Overall Progress</h4>
                  <p style={{ margin: '0.5rem 0', color: '#666' }}>
                    {milestonesArray.filter(m => m.percentComplete === 100).length} of {milestonesArray.length} milestones completed
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0077b6' }}>
                    {milestoneProgress}%
                  </div>
                  <ProgressBar style={{ width: '200px' }}>
                    <Progress value={milestoneProgress} />
                  </ProgressBar>
                </div>
              </div>
            </div>

            {/* Filter controls */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['all', 'product', 'business', 'funding', 'marketing', 'legal', 'team'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setMilestoneFilter(filter)}
                    style={{
                      background: milestoneFilter === filter ? '#0077b6' : '#f8f9fa',
                      color: milestoneFilter === filter ? '#fff' : '#333',
                      border: '1px solid #dee2e6',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.3s'
                    }}
                  >
                    {filter === 'all' ? '🔍 All' : `${getCategoryIcon(filter)} ${filter}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Content based on view */}
            {milestoneView === 'grid' && (
              <div>
                {getFilteredMilestones().length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem', 
                    background: '#f8f9fa', 
                    borderRadius: '12px' 
                  }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
                    <h4>No Milestones Yet</h4>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>
                      Start tracking your startup's progress by adding milestones
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <EditButton onClick={handleNewMilestone}>
                        <FaPlus /> Create First Milestone
                      </EditButton>
                      <EditButton onClick={() => setShowMilestoneTemplates(true)} style={{ background: '#17a2b8' }}>
                        📋 Use Templates
                      </EditButton>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
                    gap: '1.5rem' 
                  }}>
                    {getFilteredMilestones().map((milestone, index) => {
                      const status = getMilestoneStatus(milestone);
                      return (
                        <div key={milestone.id || index} style={{
                          background: '#fff',
                          border: `2px solid ${getStatusColor(status)}`,
                          borderRadius: '12px',
                          padding: '1.5rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                        >
                          {/* Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>{getCategoryIcon(milestone.category)}</span>
                                <span style={{ 
                                  background: getPriorityColor(milestone.priority), 
                                  color: '#fff', 
                                  padding: '0.2rem 0.5rem', 
                                  borderRadius: '12px', 
                                  fontSize: '0.8rem',
                                  textTransform: 'uppercase'
                                }}>
                                  {milestone.priority}
                                </span>
                                <span style={{ 
                                  background: getStatusColor(status), 
                                  color: '#fff', 
                                  padding: '0.2rem 0.5rem', 
                                  borderRadius: '12px', 
                                  fontSize: '0.8rem',
                                  textTransform: 'capitalize'
                                }}>
                                  {status.replace('_', ' ')}
                                </span>
                              </div>
                              <h4 style={{ margin: 0, color: '#0077b6' }}>{milestone.title}</h4>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditMilestone(milestone);
                                }}
                                style={{
                                  background: '#17a2b8',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '0.3rem 0.6rem',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem'
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMilestone(milestone.id);
                                }}
                                style={{
                                  background: '#dc3545',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '0.3rem 0.6rem',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem'
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          {/* Description */}
                          <p style={{ color: '#666', margin: '0 0 1rem 0', lineHeight: '1.4' }}>
                            {milestone.description}
                          </p>

                          {/* Progress */}
                          <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span style={{ fontWeight: 'bold' }}>Progress</span>
                              <span style={{ color: getStatusColor(status), fontWeight: 'bold' }}>
                                {milestone.percentComplete}%
                              </span>
                            </div>
                            <ProgressBar>
                              <Progress value={milestone.percentComplete} />
                            </ProgressBar>
                          </div>

                          {/* Quick Progress Controls */}
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            {[0, 25, 50, 75, 100].map(percent => (
                              <button
                                key={percent}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickProgressUpdate(milestone.id, percent);
                                }}
                                style={{
                                  background: milestone.percentComplete === percent ? '#0077b6' : '#f8f9fa',
                                  color: milestone.percentComplete === percent ? '#fff' : '#333',
                                  border: '1px solid #dee2e6',
                                  borderRadius: '6px',
                                  padding: '0.3rem 0.6rem',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  flex: 1
                                }}
                              >
                                {percent}%
                              </button>
                            ))}
                          </div>

                          {/* Details */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                            <div>
                              <div><b>Due:</b> {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'No due date'}</div>
                              {milestone.assignedTo && <div><b>Assigned:</b> {milestone.assignedTo}</div>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div><b>Category:</b> {milestone.category}</div>
                              {milestone.tags && milestone.tags.length > 0 && (
                                <div style={{ marginTop: '0.5rem' }}>
                                  {milestone.tags.map((tag, i) => (
                                    <span key={i} style={{
                                      background: '#e9ecef',
                                      padding: '0.2rem 0.4rem',
                                      borderRadius: '8px',
                                      fontSize: '0.7rem',
                                      marginLeft: '0.2rem'
                                    }}>
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {milestoneView === 'timeline' && (
              <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#0077b6', marginBottom: '2rem' }}>📅 Milestone Timeline</h4>
                {getFilteredMilestones().sort((a, b) => new Date(a.dueDate || '2099-12-31') - new Date(b.dueDate || '2099-12-31')).map((milestone, index) => (
                  <div key={milestone.id || index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: '#fff',
                    borderRadius: '8px',
                    border: `2px solid ${getStatusColor(getMilestoneStatus(milestone))}`
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: getStatusColor(getMilestoneStatus(milestone)),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '1.5rem',
                      marginRight: '1rem',
                      flexShrink: 0
                    }}>
                      {getCategoryIcon(milestone.category)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: 0, color: '#0077b6' }}>{milestone.title}</h5>
                      <p style={{ margin: '0.5rem 0', color: '#666' }}>{milestone.description}</p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
                        <span><b>Due:</b> {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'No due date'}</span>
                        <span><b>Progress:</b> {milestone.percentComplete}%</span>
                        <span><b>Priority:</b> {milestone.priority}</span>
                      </div>
                    </div>
                    <div style={{ marginLeft: '1rem' }}>
                      <ProgressBar style={{ width: '100px', marginBottom: '0.5rem' }}>
                        <Progress value={milestone.percentComplete} />
                      </ProgressBar>
                      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
                        {milestone.percentComplete}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {milestoneView === 'analytics' && (
              <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#0077b6', marginBottom: '2rem' }}>📈 Milestone Analytics</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                  {/* Completion Stats */}
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
                    <h5 style={{ color: '#0077b6', marginBottom: '1rem' }}>📊 Completion Stats</h5>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745', marginBottom: '0.5rem' }}>
                      {milestonesArray.filter(m => m.percentComplete === 100).length}
                    </div>
                    <div style={{ color: '#666' }}>Completed Milestones</div>
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
                        {milestonesArray.filter(m => m.percentComplete > 0 && m.percentComplete < 100).length}
                      </div>
                      <div style={{ color: '#666' }}>In Progress</div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
                    <h5 style={{ color: '#0077b6', marginBottom: '1rem' }}>🏷️ By Category</h5>
                    {['product', 'business', 'funding', 'marketing'].map(category => {
                      const count = milestonesArray.filter(m => m.category === category).length;
                      const completed = milestonesArray.filter(m => m.category === category && m.percentComplete === 100).length;
                      return count > 0 ? (
                        <div key={category} style={{ marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{getCategoryIcon(category)} {category}</span>
                            <span>{completed}/{count}</span>
                          </div>
                          <ProgressBar style={{ height: '6px' }}>
                            <Progress value={count > 0 ? (completed / count) * 100 : 0} />
                          </ProgressBar>
                        </div>
                      ) : null;
                    })}
                  </div>

                  {/* Priority Breakdown */}
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
                    <h5 style={{ color: '#0077b6', marginBottom: '1rem' }}>⚡ By Priority</h5>
                    {['high', 'medium', 'low'].map(priority => {
                      const count = milestonesArray.filter(m => m.priority === priority).length;
                      const completed = milestonesArray.filter(m => m.priority === priority && m.percentComplete === 100).length;
                      return count > 0 ? (
                        <div key={priority} style={{ marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: getPriorityColor(priority), fontWeight: 'bold' }}>
                              {priority.toUpperCase()}
                            </span>
                            <span>{completed}/{count}</span>
                          </div>
                          <ProgressBar style={{ height: '6px' }}>
                            <Progress value={count > 0 ? (completed / count) * 100 : 0} />
                          </ProgressBar>
                        </div>
                      ) : null;
                    })}
                  </div>

                  {/* Recent Activity */}
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
                    <h5 style={{ color: '#0077b6', marginBottom: '1rem' }}>🕒 Recent Activity</h5>
                    {milestonesArray
                      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
                      .slice(0, 5)
                      .map((milestone, index) => (
                        <div key={index} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{milestone.title}</div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {milestone.percentComplete}% complete
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </Section>
        )}
        {selectedSection === 'investors' && (
          <Section>
            <SectionTitle><FaHandshake /> Suggested Investors for You</SectionTitle>
            {investors && Array.isArray(investors) && investors.length > 0 ? (
              investors.map((inv, i) => (
                <InvestorCard key={inv._id || i}>
                  <FaUser size={32} />
                  <div style={{ flex: 1 }}>
                    <b>{inv.name || inv.email}</b> <br />
                    <span>{inv.industry || 'Investor'}, Ticket: $10k-$50k</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                    <EditButton 
                      onClick={() => handleViewInvestorProfile(inv)}
                      style={{ background: '#6c757d', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                      onMouseOver={(e) => e.target.style.background = '#5a6268'}
                      onMouseOut={(e) => e.target.style.background = '#6c757d'}
                    >
                      <FaUser /> View Profile
                    </EditButton>
                    <EditButton 
                      onClick={() => handleConnect(inv._id)}
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    >
                      <FaPaperPlane /> Connect
                    </EditButton>
                  </div>
                </InvestorCard>
              ))
            ) : (
              <div>No suggestions yet.</div>
            )}
          </Section>
        )}
        {selectedSection === 'meetings' && (
          <Section>
            {/* Header with controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <SectionTitle style={{ margin: 0 }}><FaHandshake /> Meetings Management</SectionTitle>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* View Toggle */}
                <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setMeetingView('upcoming')}
                    style={{
                      background: meetingView === 'upcoming' ? '#0077b6' : '#fff',
                      color: meetingView === 'upcoming' ? '#fff' : '#333',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    📅 Upcoming
                  </button>
                  <button
                    onClick={() => setMeetingView('past')}
                    style={{
                      background: meetingView === 'past' ? '#0077b6' : '#fff',
                      color: meetingView === 'past' ? '#fff' : '#333',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    📋 Past
                  </button>
                  <button
                    onClick={() => setMeetingView('calendar')}
                    style={{
                      background: meetingView === 'calendar' ? '#0077b6' : '#fff',
                      color: meetingView === 'calendar' ? '#fff' : '#333',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    📊 All
                  </button>
                  <button
                    onClick={() => setMeetingView('analytics')}
                    style={{
                      background: meetingView === 'analytics' ? '#0077b6' : '#fff',
                      color: meetingView === 'analytics' ? '#fff' : '#333',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    📈 Analytics
                  </button>
                </div>
                
                {/* Action buttons */}
                <EditButton onClick={() => setShowMeetingTemplates(true)} style={{ background: '#17a2b8' }}>
                  📋 Templates
                </EditButton>
                <EditButton onClick={handleNewMeeting}>
                  <FaCalendarPlus /> Schedule Meeting
                </EditButton>
              </div>
            </div>

            {/* Meeting Statistics */}
            <div style={{ 
              background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)', 
              padding: '1.5rem', 
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0077b6' }}>
                    {meetingsArray.filter(m => isUpcomingMeeting(m.dateTime)).length}
                  </div>
                  <div style={{ color: '#666' }}>Upcoming Meetings</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                    {meetingsArray.filter(m => m.status === 'completed').length}
                  </div>
                  <div style={{ color: '#666' }}>Completed</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>
                    {meetingsArray.filter(m => m.status === 'in_progress').length}
                  </div>
                  <div style={{ color: '#666' }}>In Progress</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6c757d' }}>
                    {meetingsArray.length}
                  </div>
                  <div style={{ color: '#666' }}>Total Meetings</div>
                </div>
              </div>
            </div>

            {/* Meetings Content */}
            {meetingView === 'analytics' ? (
              <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#0077b6', marginBottom: '2rem' }}>📈 Meeting Analytics</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  {/* Meeting Types */}
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
                    <h5 style={{ color: '#0077b6', marginBottom: '1rem' }}>📊 By Type</h5>
                    {['team', 'investor', 'client', 'board'].map(type => {
                      const count = meetingsArray.filter(m => m.type === type).length;
                      return count > 0 ? (
                        <div key={type} style={{ marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{getMeetingTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            <span>{count}</span>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>

                  {/* Meeting Status */}
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
                    <h5 style={{ color: '#0077b6', marginBottom: '1rem' }}>🎯 By Status</h5>
                    {['scheduled', 'in_progress', 'completed', 'cancelled'].map(status => {
                      const count = meetingsArray.filter(m => m.status === status).length;
                      return count > 0 ? (
                        <div key={status} style={{ marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: getMeetingStatusColor(status) }}>
                              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                            </span>
                            <span>{count}</span>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>

                  {/* Recent Activity */}
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
                    <h5 style={{ color: '#0077b6', marginBottom: '1rem' }}>🕒 Recent Meetings</h5>
                    {meetingsArray
                      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
                      .slice(0, 5)
                      .map((meeting, index) => (
                        <div key={index} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{meeting.title}</div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {formatDateTime(meeting.dateTime)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {getFilteredMeetings().length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem', 
                    background: '#f8f9fa', 
                    borderRadius: '12px' 
                  }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
                    <h4>No {meetingView === 'upcoming' ? 'Upcoming' : meetingView === 'past' ? 'Past' : ''} Meetings</h4>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>
                      {meetingView === 'upcoming' 
                        ? 'Schedule your first meeting to get started' 
                        : meetingView === 'past' 
                        ? 'Past meetings will appear here' 
                        : 'Start scheduling meetings to track your progress'
                      }
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <EditButton onClick={handleNewMeeting}>
                        <FaCalendarPlus /> Schedule Meeting
                      </EditButton>
                      <EditButton onClick={() => setShowMeetingTemplates(true)} style={{ background: '#17a2b8' }}>
                        📋 Use Templates
                      </EditButton>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
                    gap: '1.5rem' 
                  }}>
                    {getFilteredMeetings().map((meeting, index) => {
                      const isUpcoming = isUpcomingMeeting(meeting.dateTime);
                      const isCurrent = isCurrentMeeting(meeting.dateTime, meeting.duration);
                      
                      return (
                        <div key={meeting.id || index} style={{
                          background: '#fff',
                          border: `2px solid ${getMeetingStatusColor(meeting.status)}`,
                          borderRadius: '12px',
                          padding: '1.5rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                        onClick={() => {
                          setSelectedMeeting(meeting);
                          setShowMeetingDetails(true);
                        }}
                        >
                          {/* Current Meeting Indicator */}
                          {isCurrent && (
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              background: '#dc3545',
                              color: '#fff',
                              padding: '0.3rem 0.6rem',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold'
                            }}>
                              🔴 LIVE
                            </div>
                          )}

                          {/* Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>{getMeetingTypeIcon(meeting.type)}</span>
                                <span style={{ 
                                  background: getMeetingStatusColor(meeting.status), 
                                  color: '#fff', 
                                  padding: '0.2rem 0.5rem', 
                                  borderRadius: '12px', 
                                  fontSize: '0.8rem',
                                  textTransform: 'capitalize'
                                }}>
                                  {meeting.status.replace('_', ' ')}
                                </span>
                              </div>
                              <h4 style={{ margin: 0, color: '#0077b6' }}>{meeting.title}</h4>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditMeeting(meeting);
                                }}
                                style={{
                                  background: '#17a2b8',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '0.3rem 0.6rem',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem'
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMeeting(meeting.id);
                                }}
                                style={{
                                  background: '#dc3545',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '0.3rem 0.6rem',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem'
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          {/* Description */}
                          <p style={{ color: '#666', margin: '0 0 1rem 0', lineHeight: '1.4' }}>
                            {meeting.description}
                          </p>

                          {/* Meeting Details */}
                          <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <span>📅</span>
                              <span><b>{formatDateTime(meeting.dateTime)}</b></span>
                              <span style={{ color: '#666' }}>({meeting.duration} min)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <span>{meeting.isVirtual ? '💻' : '📍'}</span>
                              <span>{meeting.isVirtual ? 'Virtual Meeting' : meeting.location || 'TBD'}</span>
                            </div>
                            {meeting.attendees && meeting.attendees.length > 0 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>👥</span>
                                <span>{meeting.attendees.length} attendee{meeting.attendees.length > 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          {isUpcoming && meeting.status === 'scheduled' && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startMeeting(meeting.id);
                                }}
                                style={{
                                  background: '#28a745',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '0.5rem 1rem',
                                  cursor: 'pointer',
                                  flex: 1
                                }}
                              >
                                🚀 Start Meeting
                              </button>
                              {meeting.meetingLink && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(meeting.meetingLink, '_blank');
                                  }}
                                  style={{
                                    background: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                    flex: 1
                                  }}
                                >
                                  🔗 Join
                                </button>
                              )}
                            </div>
                          )}

                          {meeting.status === 'in_progress' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                completeMeeting(meeting.id);
                              }}
                              style={{
                                background: '#6c757d',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                                width: '100%',
                                marginBottom: '1rem'
                              }}
                            >
                              ✅ Mark as Completed
                            </button>
                          )}

                          {/* Agenda Preview */}
                          {meeting.agenda && meeting.agenda.length > 0 && (
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>
                              <b>Agenda:</b> {meeting.agenda.slice(0, 2).join(', ')}{meeting.agenda.length > 2 ? '...' : ''}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </Section>
        )}
        {selectedSection === 'documents' && (
          <Section>
            {/* Header with controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <SectionTitle style={{ margin: 0 }}><FaFileAlt /> Document Management</SectionTitle>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Search */}
                <input
                  type="text"
                  placeholder="🔍 Search documents..."
                  value={docSearchTerm}
                  onChange={(e) => setDocSearchTerm(e.target.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #ddd',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    width: '250px'
                  }}
                />
                
                {/* View Toggle */}
                <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setDocView('grid')}
                    style={{
                      background: docView === 'grid' ? '#0077b6' : '#fff',
                      color: docView === 'grid' ? '#fff' : '#333',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    ⊞ Grid
                  </button>
                  <button
                    onClick={() => setDocView('list')}
                    style={{
                      background: docView === 'list' ? '#0077b6' : '#fff',
                      color: docView === 'list' ? '#fff' : '#333',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    ☰ List
                  </button>
                </div>
                
                {/* Action buttons */}
                <EditButton onClick={() => setShowDocTemplates(true)} style={{ background: '#17a2b8' }}>
                  📋 Templates
                </EditButton>
                <EditButton onClick={handleNewDoc}>
                  <FaUpload /> Upload Document
                </EditButton>
              </div>
            </div>

            {/* Filters and Categories */}
            <div style={{ 
              background: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '2rem',
              display: 'flex',
              gap: '2rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {/* Filter by Type */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Filter:</label>
                <select
                  value={docFilter}
                  onChange={(e) => setDocFilter(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="all">All Documents</option>
                  <option value="recent">Recent (7 days)</option>
                  <option value="shared">Shared</option>
                  <option value="favorites">Favorites</option>
                </select>
              </div>

              {/* Filter by Category */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Category:</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="all">All Categories</option>
                  {documentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Stats */}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#666' }}>
                <span><b>{documentsArray.length}</b> Total</span>
                <span><b>{documentsArray.filter(d => d.isFavorite).length}</b> Favorites</span>
                <span><b>{documentsArray.filter(d => d.isPublic).length}</b> Public</span>
              </div>
            </div>

            {/* Documents Content */}
            {getFilteredDocuments().length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                background: '#f8f9fa', 
                borderRadius: '12px' 
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
                <h4>No Documents Found</h4>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                  {docSearchTerm || docCategory !== 'all' || docFilter !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Upload your first document to get started'
                  }
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <EditButton onClick={handleNewDoc}>
                    <FaUpload /> Upload Document
                  </EditButton>
                  <EditButton onClick={() => setShowDocTemplates(true)} style={{ background: '#17a2b8' }}>
                    📋 Use Templates
                  </EditButton>
                </div>
              </div>
            ) : (
              <div>
                {/* Grid View */}
                {docView === 'grid' && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                    gap: '1.5rem' 
                  }}>
                    {getFilteredDocuments().map((doc, index) => (
                      <div key={doc.id || index} style={{
                        background: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                      onClick={() => {
                        setSelectedDoc(doc);
                        setShowDocDetails(true);
                      }}
                      >
                        {/* Favorite Icon */}
                        {doc.isFavorite && (
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            color: '#ffc107',
                            fontSize: '1.2rem'
                          }}>
                            ⭐
                          </div>
                        )}

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{
                            fontSize: '2rem',
                            color: '#0077b6'
                          }}>
                            {getDocumentIcon(doc.category, getFileExtension(doc.filename))}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ 
                              margin: '0 0 0.5rem 0', 
                              color: '#0077b6', 
                              fontSize: '1.1rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {doc.name}
                            </h4>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <span style={{ 
                                background: documentCategories.find(cat => cat.id === doc.category)?.icon ? '#e3f2fd' : '#f0f0f0', 
                                color: '#0077b6', 
                                padding: '0.2rem 0.5rem', 
                                borderRadius: '12px', 
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                              }}>
                                {documentCategories.find(cat => cat.id === doc.category)?.icon} {doc.category}
                              </span>
                              {doc.version && (
                                <span style={{ 
                                  background: '#f8f9fa', 
                                  color: '#666', 
                                  padding: '0.2rem 0.5rem', 
                                  borderRadius: '12px', 
                                  fontSize: '0.7rem'
                                }}>
                                  v{doc.version}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p style={{ 
                          color: '#666', 
                          margin: '0 0 1rem 0', 
                          lineHeight: '1.4',
                          fontSize: '0.9rem',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden'
                        }}>
                          {doc.description}
                        </p>

                        {/* File Info */}
                        <div style={{ marginBottom: '1rem', fontSize: '0.8rem', color: '#666' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                            <span>📁 {doc.filename}</span>
                            <span>💾 {formatFileSize(doc.size)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                            <span>👤 {doc.uploadedBy}</span>
                            <span>📅 {formatDate(doc.uploadDate)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>👁️ {doc.views} views</span>
                            <span>⬇️ {doc.downloads} downloads</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {doc.tags && doc.tags.length > 0 && (
                          <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                              {doc.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span key={tagIndex} style={{
                                  background: '#e3f2fd',
                                  color: '#0077b6',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '8px',
                                  fontSize: '0.7rem',
                                  fontWeight: 'bold'
                                }}>
                                  #{tag}
                                </span>
                              ))}
                              {doc.tags.length > 3 && (
                                <span style={{ fontSize: '0.7rem', color: '#666' }}>
                                  +{doc.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadDocument(doc);
                            }}
                            style={{
                              flex: 1,
                              background: '#28a745',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.5rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            ⬇️ Download
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              shareDocument(doc);
                            }}
                            style={{
                              flex: 1,
                              background: '#17a2b8',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.5rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            🔗 Share
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              favoriteDocument(doc.id);
                            }}
                            style={{
                              background: doc.isFavorite ? '#ffc107' : '#f8f9fa',
                              color: doc.isFavorite ? '#fff' : '#666',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.5rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            ⭐
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditDoc(doc);
                            }}
                            style={{
                              background: '#007bff',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.5rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDocument(doc.id);
                            }}
                            style={{
                              background: '#dc3545',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.5rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* List View */}
                {docView === 'list' && (
                  <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                    {/* Table Header */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 150px 120px 100px 80px 140px',
                      padding: '1rem',
                      background: '#f8f9fa',
                      borderBottom: '1px solid #e0e0e0',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      <div>Document</div>
                      <div>Category</div>
                      <div>Size</div>
                      <div>Views</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>

                    {/* Table Rows */}
                    {getFilteredDocuments().map((doc, index) => (
                      <div key={doc.id || index} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 150px 120px 100px 80px 140px',
                        padding: '1rem',
                        borderBottom: index < getFilteredDocuments().length - 1 ? '1px solid #f0f0f0' : 'none',
                        alignItems: 'center',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                      onClick={() => {
                        setSelectedDoc(doc);
                        setShowDocDetails(true);
                      }}
                      >
                        {/* Document Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>
                            {getDocumentIcon(doc.category, getFileExtension(doc.filename))}
                          </span>
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#0077b6' }}>{doc.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{doc.filename}</div>
                          </div>
                          {doc.isFavorite && <span style={{ color: '#ffc107' }}>⭐</span>}
                        </div>

                        {/* Category */}
                        <div>
                          <span style={{ 
                            background: '#e3f2fd', 
                            color: '#0077b6', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '8px', 
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}>
                            {documentCategories.find(cat => cat.id === doc.category)?.icon} {doc.category}
                          </span>
                        </div>

                        {/* Size */}
                        <div>{formatFileSize(doc.size)}</div>

                        {/* Views */}
                        <div>{doc.views}</div>

                        {/* Status */}
                        <div>
                          <span style={{ 
                            background: doc.isPublic ? '#d4edda' : '#f8d7da', 
                            color: doc.isPublic ? '#155724' : '#721c24', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '8px', 
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}>
                            {doc.isPublic ? '🌐 Public' : '🔒 Private'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadDocument(doc);
                            }}
                            style={{
                              background: '#28a745',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.3rem',
                              cursor: 'pointer',
                              fontSize: '0.7rem'
                            }}
                            title="Download"
                          >
                            ⬇️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              shareDocument(doc);
                            }}
                            style={{
                              background: '#17a2b8',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.3rem',
                              cursor: 'pointer',
                              fontSize: '0.7rem'
                            }}
                            title="Share"
                          >
                            🔗
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditDoc(doc);
                            }}
                            style={{
                              background: '#007bff',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.3rem',
                              cursor: 'pointer',
                              fontSize: '0.7rem'
                            }}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDocument(doc.id);
                            }}
                            style={{
                              background: '#dc3545',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.3rem',
                              cursor: 'pointer',
                              fontSize: '0.7rem'
                            }}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Document Analytics */}
            {documentsArray.length > 0 && (
              <div style={{ 
                marginTop: '2rem',
                background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)', 
                padding: '1.5rem', 
                borderRadius: '12px'
              }}>
                <h4 style={{ color: '#0077b6', marginBottom: '1rem' }}>📊 Document Analytics</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {documentCategories.map(category => {
                    const count = documentsArray.filter(d => d.category === category.id).length;
                    return count > 0 ? (
                      <div key={category.id} style={{ background: '#fff', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{category.icon}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0077b6' }}>{count}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{category.name}</div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </Section>
        )}
        {selectedSection === 'announcements' && (
          <Section>
            <SectionTitle><FaBullhorn /> Announcements & News</SectionTitle>
            
            {/* Header with controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Search */}
                <input
                  type="text"
                  placeholder="🔍 Search announcements..."
                  value={announcementSearchTerm}
                  onChange={(e) => setAnnouncementSearchTerm(e.target.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #ddd',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    width: '250px'
                  }}
                />
                
                {/* Action buttons */}
                <EditButton onClick={() => setShowAnnouncementTemplates(true)} style={{ background: '#17a2b8' }}>
                  📋 Templates
                </EditButton>
                <EditButton onClick={handleNewAnnouncement}>
                  <FaBullhorn /> New Announcement
                </EditButton>
              </div>
            </div>

            {/* Filters and Quick Stats */}
            <div style={{ 
              background: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '2rem',
              display: 'flex',
              gap: '2rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {/* View Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>View:</label>
                <select
                  value={announcementView}
                  onChange={(e) => setAnnouncementView(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="all">All Announcements</option>
                  <option value="urgent">🚨 Urgent Only</option>
                  <option value="pinned">📌 Pinned</option>
                  <option value="recent">📅 Recent (7 days)</option>
                </select>
              </div>

              {/* Category Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Category:</label>
                <select
                  value={announcementFilter}
                  onChange={(e) => setAnnouncementFilter(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="all">All Categories</option>
                  {announcementCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Stats */}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#666' }}>
                <span><b>{announcementsArray.length}</b> Total</span>
                <span><b>{announcementsArray.filter(a => a.isPinned).length}</b> Pinned</span>
                <span><b>{announcementsArray.filter(a => a.isUrgent).length}</b> Urgent</span>
              </div>
            </div>

            {/* Announcements Content */}
            {getFilteredAnnouncements().length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                background: '#f8f9fa', 
                borderRadius: '12px' 
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📢</div>
                <h4>No Announcements Found</h4>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                  {announcementSearchTerm || announcementFilter !== 'all' || announcementView !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Create your first announcement to keep everyone informed'
                  }
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <EditButton onClick={handleNewAnnouncement}>
                    <FaBullhorn /> Create Announcement
                  </EditButton>
                  <EditButton onClick={() => setShowAnnouncementTemplates(true)} style={{ background: '#17a2b8' }}>
                    📋 Use Templates
                  </EditButton>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {getFilteredAnnouncements().map((announcement, index) => (
                  <div key={announcement.id || index} style={{
                    background: '#fff',
                    border: `2px solid ${announcement.isPinned ? '#ffc107' : announcement.isUrgent ? '#dc3545' : '#e0e0e0'}`,
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                  onClick={() => {
                    setSelectedAnnouncement(announcement);
                    setShowAnnouncementDetails(true);
                    markAsRead(announcement.id);
                  }}
                  >
                    {/* Priority and Pin indicators */}
                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '0.3rem' }}>
                      {announcement.isPinned && (
                        <span style={{ background: '#ffc107', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.7rem' }}>
                          📌 PINNED
                        </span>
                      )}
                      {announcement.isUrgent && (
                        <span style={{ background: '#dc3545', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.7rem' }}>
                          🚨 URGENT
                        </span>
                      )}
                    </div>

                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        fontSize: '2rem',
                        color: announcementCategories.find(cat => cat.id === announcement.category)?.color || '#0077b6'
                      }}>
                        {getAnnouncementIcon(announcement.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ 
                          margin: '0 0 0.5rem 0', 
                          color: '#0077b6', 
                          fontSize: '1.3rem',
                          lineHeight: '1.4'
                        }}>
                          {announcement.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ 
                            background: announcementCategories.find(cat => cat.id === announcement.category)?.color || '#0077b6', 
                            color: '#fff', 
                            padding: '0.2rem 0.6rem', 
                            borderRadius: '12px', 
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            {announcementCategories.find(cat => cat.id === announcement.category)?.icon} {announcement.category}
                          </span>
                          <span style={{ 
                            background: getPriorityColor(announcement.priority), 
                            color: '#fff', 
                            padding: '0.2rem 0.6rem', 
                            borderRadius: '12px', 
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            {getPriorityIcon(announcement.priority)} {announcement.priority}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          By {announcement.author} • {formatTimeAgo(announcement.createdAt)} • {announcement.views} views
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p style={{ 
                      color: '#333', 
                      margin: '0 0 1rem 0', 
                      lineHeight: '1.6',
                      fontSize: '1rem'
                    }}>
                      {announcement.content}
                    </p>

                    {/* Tags */}
                    {announcement.tags && announcement.tags.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {announcement.tags.slice(0, 5).map((tag, tagIndex) => (
                            <span key={tagIndex} style={{
                              background: '#e3f2fd',
                              color: '#0077b6',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '8px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold'
                            }}>
                              #{tag}
                            </span>
                          ))}
                          {announcement.tags.length > 5 && (
                            <span style={{ fontSize: '0.7rem', color: '#666' }}>
                              +{announcement.tags.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Reactions and Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* Reactions */}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            reactToAnnouncement(announcement.id, 'likes');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            cursor: 'pointer',
                            padding: '0.3rem 0.5rem',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          👍 {announcement.reactions?.likes || 0}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            reactToAnnouncement(announcement.id, 'heart');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            cursor: 'pointer',
                            padding: '0.3rem 0.5rem',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          ❤️ {announcement.reactions?.heart || 0}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            reactToAnnouncement(announcement.id, 'clap');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            cursor: 'pointer',
                            padding: '0.3rem 0.5rem',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          👏 {announcement.reactions?.clap || 0}
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            pinAnnouncement(announcement.id);
                          }}
                          style={{
                            background: announcement.isPinned ? '#ffc107' : '#f8f9fa',
                            color: announcement.isPinned ? '#fff' : '#666',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.4rem 0.6rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                          title={announcement.isPinned ? 'Unpin' : 'Pin'}
                        >
                          📌
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsUrgent(announcement.id);
                          }}
                          style={{
                            background: announcement.isUrgent ? '#dc3545' : '#f8f9fa',
                            color: announcement.isUrgent ? '#fff' : '#666',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.4rem 0.6rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                          title={announcement.isUrgent ? 'Remove urgent' : 'Mark as urgent'}
                        >
                          🚨
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAnnouncement(announcement);
                          }}
                          style={{
                            background: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.4rem 0.6rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAnnouncement(announcement.id);
                          }}
                          style={{
                            background: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.4rem 0.6rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Announcement Analytics */}
            {announcementsArray.length > 0 && (
              <div style={{ 
                marginTop: '2rem',
                background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)', 
                padding: '1.5rem', 
                borderRadius: '12px'
              }}>
                <h4 style={{ color: '#0077b6', marginBottom: '1rem' }}>📊 Announcement Analytics</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {announcementCategories.map(category => {
                    const count = announcementsArray.filter(a => a.category === category.id).length;
                    const totalViews = announcementsArray.filter(a => a.category === category.id).reduce((sum, a) => sum + (a.views || 0), 0);
                    return count > 0 ? (
                      <div key={category.id} style={{ background: '#fff', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{category.icon}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: category.color }}>{count}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.3rem' }}>{category.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#999' }}>{totalViews} total views</div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </Section>
        )}
        {selectedSection === 'resources' && (
          <Section>
            <SectionTitle><FaLightbulb /> Startup Resources & Learning Hub</SectionTitle>
            
            {/* Resource Categories */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              
              {/* Funding & Investment */}
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e9ecef' }}>
                <h3 style={{ color: '#28a745', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  💰 Funding & Investment
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#ff0000', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>YouTube</span>
                    <a href="https://www.youtube.com/watch?v=Tg3KhqFgkzE" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      How to Pitch to Investors - Y Combinator
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#ff0000', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>YouTube</span>
                    <a href="https://www.youtube.com/watch?v=4Z0BzMSjGjc" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Startup Funding Explained - TechStars
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#17a2b8', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Article</span>
                    <a href="https://www.crunchbase.com/funding-rounds" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Crunchbase Funding Database
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#6c757d', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Tool</span>
                    <a href="https://www.carta.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Carta - Equity Management Platform
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Development */}
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e9ecef' }}>
                <h3 style={{ color: '#007bff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🚀 Business Development
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#ff0000', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>YouTube</span>
                    <a href="https://www.youtube.com/watch?v=f_LNNnNfpp4" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      The Lean Startup Methodology
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#17a2b8', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Article</span>
                    <a href="https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      SBA Business Plan Guide
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#6c757d', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Tool</span>
                    <a href="https://canvanizer.com/new/business-model-canvas" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Business Model Canvas Generator
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#6c757d', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Tool</span>
                    <a href="https://www.surveymonkey.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Market Research with SurveyMonkey
                    </a>
                  </div>
                </div>
              </div>

              {/* Marketing & Growth */}
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e9ecef' }}>
                <h3 style={{ color: '#dc3545', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📈 Marketing & Growth
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#ff0000', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>YouTube</span>
                    <a href="https://www.youtube.com/watch?v=zeKwB0p3srA" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Growth Hacking Strategies - Neil Patel
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#ff0000', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>YouTube</span>
                    <a href="https://www.youtube.com/watch?v=BPK_qzeH_yk" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Digital Marketing Masterclass
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#6c757d', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Tool</span>
                    <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Google Analytics - Track Your Growth
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#6c757d', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Tool</span>
                    <a href="https://buffer.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Buffer - Social Media Management
                    </a>
                  </div>
                </div>
              </div>

              {/* Product Development */}
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e9ecef' }}>
                <h3 style={{ color: '#6f42c1', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🛠️ Product Development
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#ff0000', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>YouTube</span>
                    <a href="https://www.youtube.com/watch?v=xPJoq_QVsY4" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      MVP Development Guide
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#6c757d', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Tool</span>
                    <a href="https://www.figma.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Figma - UI/UX Design Platform
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#6c757d', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Tool</span>
                    <a href="https://trello.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Trello - Project Management
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#6c757d', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Tool</span>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      GitHub - Code Repository & Collaboration
                    </a>
                  </div>
                </div>
              </div>

              {/* Legal & Compliance */}
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e9ecef' }}>
                <h3 style={{ color: '#fd7e14', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ⚖️ Legal & Compliance
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#17a2b8', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Article</span>
                    <a href="https://www.nolo.com/legal-encyclopedia/forming-corporation" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Business Incorporation Guide - Nolo
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#6c757d', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Tool</span>
                    <a href="https://www.legalzoom.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      LegalZoom - Legal Documents
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#17a2b8', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Article</span>
                    <a href="https://www.gdprguide.org/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      GDPR Compliance Guide
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#6c757d', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Tool</span>
                    <a href="https://docusign.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      DocuSign - Digital Signatures
                    </a>
                  </div>
                </div>
              </div>

              {/* Learning & Education */}
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e9ecef' }}>
                <h3 style={{ color: '#20c997', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🎓 Learning & Education
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#ff0000', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Course</span>
                    <a href="https://startupschool.org/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Y Combinator Startup School (Free)
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#ff0000', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Course</span>
                    <a href="https://www.coursera.org/learn/wharton-entrepreneurship" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Wharton Entrepreneurship - Coursera
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#17a2b8', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Podcast</span>
                    <a href="https://www.mixergy.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      Mixergy - Startup Interviews
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#17a2b8', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>Book</span>
                    <a href="https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation/dp/0307887898" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                      "The Lean Startup" by Eric Ries
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Tools */}
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem', borderRadius: '15px', color: '#fff', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 'bold' }}>🔧 Quick Access Tools</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <EditButton 
                  onClick={() => window.open('https://docs.google.com/document/u/0/?tgif=d', '_blank')}
                  style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  📄 Google Docs
                </EditButton>
                <EditButton 
                  onClick={() => window.open('https://sheets.google.com/', '_blank')}
                  style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  📊 Google Sheets
                </EditButton>
                <EditButton 
                  onClick={() => window.open('https://calendly.com/', '_blank')}
                  style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  📅 Calendly
                </EditButton>
                <EditButton 
                  onClick={() => window.open('https://zoom.us/', '_blank')}
                  style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  🎥 Zoom
                </EditButton>
                <EditButton 
                  onClick={() => window.open('https://slack.com/', '_blank')}
                  style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  💬 Slack
                </EditButton>
                <EditButton 
                  onClick={() => window.open('https://www.canva.com/', '_blank')}
                  style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  🎨 Canva
                </EditButton>
              </div>
            </div>

            {/* Recommended YouTube Channels */}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e9ecef', marginBottom: '2rem' }}>
              <h3 style={{ color: '#dc3545', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📺 Top Startup YouTube Channels
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ width: '60px', height: '60px', background: '#ff0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    YC
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Y Combinator</h4>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Startup advice from the most successful accelerator</p>
                    <EditButton 
                      onClick={() => window.open('https://www.youtube.com/c/ycombinator', '_blank')}
                      style={{ background: '#ff0000', color: '#fff', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Subscribe
                    </EditButton>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ width: '60px', height: '60px', background: '#007bff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    TS
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Techstars</h4>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Global startup accelerator insights</p>
                    <EditButton 
                      onClick={() => window.open('https://www.youtube.com/c/Techstars', '_blank')}
                      style={{ background: '#ff0000', color: '#fff', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Subscribe
                    </EditButton>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ width: '60px', height: '60px', background: '#28a745', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    GV
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>GaryVee</h4>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Entrepreneurship and hustle mindset</p>
                    <EditButton 
                      onClick={() => window.open('https://www.youtube.com/c/garyvee', '_blank')}
                      style={{ background: '#ff0000', color: '#fff', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Subscribe
                    </EditButton>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ width: '60px', height: '60px', background: '#6f42c1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    NP
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Neil Patel</h4>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Digital marketing and growth hacking</p>
                    <EditButton 
                      onClick={() => window.open('https://www.youtube.com/c/NeilPatel', '_blank')}
                      style={{ background: '#ff0000', color: '#fff', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Subscribe
                    </EditButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Categories Filter */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e9ecef' }}>
              <h3 style={{ color: '#495057', marginBottom: '1rem' }}>📚 Additional Resources by Category</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <EditButton 
                  onClick={() => window.open('https://www.producthunt.com/', '_blank')}
                  style={{ background: '#ff6b35', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  Product Hunt - Discover Tools
                </EditButton>
                <EditButton 
                  onClick={() => window.open('https://www.indiehackers.com/', '_blank')}
                  style={{ background: '#0e76a8', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  Indie Hackers Community
                </EditButton>
                <EditButton 
                  onClick={() => window.open('https://www.reddit.com/r/entrepreneur/', '_blank')}
                  style={{ background: '#ff4500', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  r/Entrepreneur
                </EditButton>
                <EditButton 
                  onClick={() => window.open('https://angel.co/', '_blank')}
                  style={{ background: '#000', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  AngelList - Jobs & Funding
                </EditButton>
              </div>
            </div>

          </Section>
        )}
        {/* Modals for all actions */}
        {showEdit && (
          <ModalOverlay onClick={(e) => e.target === e.currentTarget && handleCloseEdit()}>
            <ModalContent style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <ModalTitle style={{ margin: 0, color: '#0077b6' }}>✏️ Edit Startup Profile</ModalTitle>
                <button 
                  onClick={handleCloseEdit}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>
              
              <ModalForm onSubmit={handleEditSubmit}>
                {/* Company Information */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>🏢 Company Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <ModalInput 
                      name="tagline" 
                      placeholder="Company Name *" 
                      value={editData.tagline || ''} 
                      onChange={handleEditChange}
                      required
                    />
                    <ModalInput 
                      name="industry" 
                      placeholder="Industry *" 
                      value={editData.industry || ''} 
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <ModalInput 
                      name="stage" 
                      placeholder="Stage (e.g., Seed, Series A)" 
                      value={editData.stage || ''} 
                      onChange={handleEditChange}
                    />
                    <ModalInput 
                      name="foundedYear" 
                      placeholder="Founded Year" 
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={editData.foundedYear || ''} 
                      onChange={handleEditChange}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <ModalInput 
                      name="employees" 
                      placeholder="Number of Employees" 
                      type="number"
                      min="1"
                      value={editData.employees || ''} 
                      onChange={handleEditChange}
                    />
                    <ModalInput 
                      name="fundingAsk" 
                      placeholder="Funding Ask (₹)" 
                      type="number"
                      min="0"
                      value={editData.fundingAsk || ''} 
                      onChange={handleEditChange}
                    />
                  </div>
                  <textarea
                    name="description"
                    placeholder="Company Description"
                    value={editData.description || ''}
                    onChange={handleEditChange}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      marginTop: '1rem',
                      minHeight: '80px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Contact Information */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>📞 Contact Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <ModalInput 
                      name="email" 
                      placeholder="Email Address" 
                      type="email"
                      value={editData.email || ''} 
                      onChange={handleEditChange}
                    />
                    <ModalInput 
                      name="whatsapp" 
                      placeholder="WhatsApp Number" 
                      value={editData.whatsapp || ''} 
                      onChange={handleEditChange}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <ModalInput 
                      name="website" 
                      placeholder="Website URL" 
                      type="url"
                      value={editData.website || ''} 
                      onChange={handleEditChange}
                    />
                    <ModalInput 
                      name="location" 
                      placeholder="Location (City, Country)" 
                      value={editData.location || ''} 
                      onChange={handleEditChange}
                    />
                  </div>
                </div>

                {/* Visual & Team */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>🎨 Visual & Team</h4>
                  <ModalInput 
                    name="logo" 
                    placeholder="Logo URL" 
                    type="url"
                    value={editData.logo || ''} 
                    onChange={handleEditChange}
                    style={{ marginBottom: '1rem' }}
                  />
                  <ModalInput 
                    name="team" 
                    placeholder="Team Members (comma separated)" 
                    value={editData.team ? editData.team.join(', ') : ''} 
                    onChange={handleTeamChange}
                  />
                  <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
                    💡 Enter team member names separated by commas (e.g., "John Doe - CEO, Jane Smith - CTO")
                  </small>
                </div>

                {/* Error and Success Messages */}
                {editError && (
                  <div style={{ 
                    color: '#dc3545', 
                    background: '#f8d7da', 
                    padding: '0.7rem', 
                    borderRadius: '6px',
                    border: '1px solid #f5c6cb',
                    marginBottom: '1rem'
                  }}>
                    ❌ {editError}
                  </div>
                )}

                {editSuccess && (
                  <div style={{ 
                    color: '#155724', 
                    background: '#d4edda', 
                    padding: '0.7rem', 
                    borderRadius: '6px',
                    border: '1px solid #c3e6cb',
                    marginBottom: '1rem'
                  }}>
                    ✅ {editSuccess}
                  </div>
                )}

                {/* Form Actions */}
                <ModalActions>
                  <EditButton 
                    type="button" 
                    onClick={handleCloseEdit} 
                    style={{ background: '#6c757d', color: '#fff' }}
                    disabled={saving}
                  >
                    Cancel
                  </EditButton>
                  <EditButton 
                    type="submit" 
                    disabled={saving}
                    style={{ 
                      background: saving ? '#ccc' : '#0077b6',
                      color: '#fff'
                    }}
                  >
                    {saving ? '⏳ Saving...' : '💾 Save Changes'}
                  </EditButton>
                </ModalActions>
              </ModalForm>
            </ModalContent>
          </ModalOverlay>
        )}
        {showCampaignModal && (
          <ModalOverlay>
            <ModalContent>
              <ModalTitle>New Fundraising Campaign</ModalTitle>
              <ModalForm onSubmit={handleCampaignSubmit}>
                <ModalInput name="round" placeholder="Round (Seed, Series A, etc.)" value={campaignData.round} onChange={handleCampaignChange} required />
                <ModalInput name="amountSought" placeholder="Amount Sought" type="number" value={campaignData.amountSought} onChange={handleCampaignChange} required />
                <ModalActions>
                  <EditButton type="button" onClick={() => setShowCampaignModal(false)} style={{ background: '#ccc', color: '#333' }}>Cancel</EditButton>
                  <EditButton type="submit" disabled={campaignSaving}>{campaignSaving ? 'Saving...' : 'Save'}</EditButton>
                </ModalActions>
              </ModalForm>
            </ModalContent>
          </ModalOverlay>
        )}
        {showMilestoneModal && (
          <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowMilestoneModal(false)}>
            <ModalContent style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <ModalTitle style={{ margin: 0, color: '#0077b6' }}>
                  {editingMilestone ? '✏️ Edit Milestone' : '🎯 New Milestone'}
                </ModalTitle>
                <button 
                  onClick={() => setShowMilestoneModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>
              
              <ModalForm onSubmit={handleMilestoneSubmit}>
                {/* Basic Information */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>📋 Basic Information</h4>
                  <ModalInput 
                    name="title" 
                    placeholder="Milestone Title *" 
                    value={milestoneData.title} 
                    onChange={handleMilestoneChange} 
                    required 
                    style={{ marginBottom: '1rem' }}
                  />
                  <textarea
                    name="description"
                    placeholder="Milestone Description"
                    value={milestoneData.description}
                    onChange={handleMilestoneChange}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      minHeight: '80px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Category and Priority */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>🏷️ Classification</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
                      <select
                        name="category"
                        value={milestoneData.category}
                        onChange={handleMilestoneChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="product">🚀 Product</option>
                        <option value="business">💼 Business</option>
                        <option value="funding">💰 Funding</option>
                        <option value="marketing">📢 Marketing</option>
                        <option value="legal">⚖️ Legal</option>
                        <option value="team">👥 Team</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Priority</label>
                      <select
                        name="priority"
                        value={milestoneData.priority}
                        onChange={handleMilestoneChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="high">🔴 High</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="low">🟢 Low</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Progress and Timeline */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>📅 Timeline & Progress</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Due Date</label>
                      <ModalInput 
                        name="dueDate" 
                        type="date" 
                        value={milestoneData.dueDate} 
                        onChange={handleMilestoneChange}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Progress ({milestoneData.percentComplete}%)
                      </label>
                      <input
                        name="percentComplete"
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={milestoneData.percentComplete}
                        onChange={handleMilestoneChange}
                        style={{
                          width: '100%',
                          marginBottom: '0.5rem'
                        }}
                      />
                      <ProgressBar>
                        <Progress value={milestoneData.percentComplete} />
                      </ProgressBar>
                    </div>
                  </div>
                </div>

                {/* Assignment and Status */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>👤 Assignment & Status</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Assigned To</label>
                      <ModalInput 
                        name="assignedTo" 
                        placeholder="Team member name" 
                        value={milestoneData.assignedTo} 
                        onChange={handleMilestoneChange}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Status</label>
                      <select
                        name="status"
                        value={milestoneData.status}
                        onChange={handleMilestoneChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="not_started">⚪ Not Started</option>
                        <option value="in_progress">🔵 In Progress</option>
                        <option value="completed">🟢 Completed</option>
                        <option value="overdue">🔴 Overdue</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>🏷️ Tags</h4>
                  <ModalInput 
                    name="tags" 
                    placeholder="Tags (comma separated, e.g., urgent, mvp, customer-feedback)" 
                    value={milestoneData.tags ? milestoneData.tags.join(', ') : ''} 
                    onChange={handleTagsChange}
                  />
                  <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
                    💡 Add tags to help categorize and find milestones easily
                  </small>
                </div>

                {/* Quick Progress Buttons */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>⚡ Quick Progress</h4>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[0, 25, 50, 75, 100].map(percent => (
                      <button
                        key={percent}
                        type="button"
                        onClick={() => setMilestoneData(prev => ({ ...prev, percentComplete: percent }))}
                        style={{
                          background: milestoneData.percentComplete === percent ? '#0077b6' : '#f8f9fa',
                          color: milestoneData.percentComplete === percent ? '#fff' : '#333',
                          border: '1px solid #dee2e6',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          flex: 1
                        }}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <ModalActions>
                  <EditButton 
                    type="button" 
                    onClick={() => setShowMilestoneModal(false)} 
                    style={{ background: '#6c757d', color: '#fff' }}
                    disabled={milestoneSaving}
                  >
                    Cancel
                  </EditButton>
                  <EditButton 
                    type="submit" 
                    disabled={milestoneSaving}
                    style={{ 
                      background: milestoneSaving ? '#ccc' : '#0077b6',
                      color: '#fff'
                    }}
                  >
                    {milestoneSaving ? '⏳ Saving...' : editingMilestone ? '💾 Update Milestone' : '🎯 Create Milestone'}
                  </EditButton>
                </ModalActions>
              </ModalForm>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Milestone Templates Modal */}
        {showMilestoneTemplates && (
          <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowMilestoneTemplates(false)}>
            <ModalContent style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <ModalTitle style={{ margin: 0, color: '#0077b6' }}>📋 Milestone Templates</ModalTitle>
                <button 
                  onClick={() => setShowMilestoneTemplates(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>
              
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Choose from our curated collection of common startup milestones to get started quickly.
              </p>

              {milestoneTemplates.map((categoryGroup, index) => (
                <div key={index} style={{ marginBottom: '2rem' }}>
                  <h4 style={{ 
                    color: '#0077b6', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {getCategoryIcon(categoryGroup.category)} 
                    {categoryGroup.category.charAt(0).toUpperCase() + categoryGroup.category.slice(1)} Milestones
                  </h4>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    {categoryGroup.templates.map((template, templateIndex) => (
                      <div key={templateIndex} style={{
                        background: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        padding: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e3f2fd';
                        e.currentTarget.style.borderColor = '#0077b6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#dee2e6';
                      }}
                      onClick={() => handleMilestoneFromTemplate(template, categoryGroup.category)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h5 style={{ margin: 0, color: '#0077b6' }}>{template.title}</h5>
                          <span style={{ 
                            background: getPriorityColor(template.priority), 
                            color: '#fff', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '12px', 
                            fontSize: '0.7rem',
                            textTransform: 'uppercase'
                          }}>
                            {template.priority}
                          </span>
                        </div>
                        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                          {template.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                          <span>📅 Est. {template.estimatedDays} days</span>
                          <span>👆 Click to use</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <EditButton 
                  onClick={() => setShowMilestoneTemplates(false)}
                  style={{ background: '#6c757d' }}
                >
                  Close Templates
                </EditButton>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
        {/* Enhanced Meeting Modal */}
        {showMeetingModal && (
          <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowMeetingModal(false)}>
            <ModalContent style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <ModalTitle style={{ margin: 0, color: '#0077b6' }}>
                  {editingMeeting ? '✏️ Edit Meeting' : '📅 Schedule New Meeting'}
                </ModalTitle>
                <button 
                  onClick={() => setShowMeetingModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>
              
              <ModalForm onSubmit={handleMeetingSubmit}>
                {/* Basic Information */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>📋 Meeting Details</h4>
                  <ModalInput 
                    name="title" 
                    placeholder="Meeting Title *" 
                    value={meetingData.title} 
                    onChange={handleMeetingChange} 
                    required 
                    style={{ marginBottom: '1rem' }}
                  />
                  <textarea
                    name="description"
                    placeholder="Meeting Description"
                    value={meetingData.description}
                    onChange={handleMeetingChange}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      minHeight: '80px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Type and Schedule */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>🏷️ Type & Schedule</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Meeting Type</label>
                      <select
                        name="type"
                        value={meetingData.type}
                        onChange={handleMeetingChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="team">👥 Team Meeting</option>
                        <option value="investor">💰 Investor Meeting</option>
                        <option value="client">🤝 Client Meeting</option>
                        <option value="board">📋 Board Meeting</option>
                        <option value="partner">🤝 Partner Meeting</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Date & Time</label>
                      <ModalInput 
                        name="dateTime" 
                        type="datetime-local" 
                        value={meetingData.dateTime} 
                        onChange={handleMeetingChange}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Duration (minutes)</label>
                      <ModalInput 
                        name="duration" 
                        type="number" 
                        min="15"
                        max="480"
                        step="15"
                        value={meetingData.duration} 
                        onChange={handleMeetingChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>📍 Location</h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="isVirtual"
                        checked={meetingData.isVirtual}
                        onChange={handleMeetingChange}
                      />
                      <span>💻 Virtual Meeting</span>
                    </label>
                  </div>
                  {meetingData.isVirtual ? (
                    <ModalInput 
                      name="meetingLink" 
                      placeholder="Meeting Link (Zoom, Teams, etc.)" 
                      value={meetingData.meetingLink} 
                      onChange={handleMeetingChange}
                    />
                  ) : (
                    <ModalInput 
                      name="location" 
                      placeholder="Physical Location" 
                      value={meetingData.location} 
                      onChange={handleMeetingChange}
                    />
                  )}
                </div>

                {/* Attendees */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>👥 Attendees</h4>
                  <ModalInput 
                    name="attendees" 
                    placeholder="Attendees (comma separated, e.g., john@example.com, Jane Doe, +1-555-1234)" 
                    value={meetingData.attendees ? meetingData.attendees.join(', ') : ''} 
                    onChange={handleAttendeesChange}
                  />
                  <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
                    💡 Add email addresses or names, separated by commas
                  </small>
                </div>

                {/* Agenda */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>📝 Agenda</h4>
                  {meetingData.agenda && meetingData.agenda.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder={`Agenda item ${index + 1}`}
                        value={item}
                        onChange={(e) => handleAgendaChange(index, e.target.value)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeAgendaItem(index)}
                        style={{
                          background: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAgendaItem}
                    style={{
                      background: '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    ➕ Add Agenda Item
                  </button>
                </div>

                {/* Recurring Options */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>🔄 Recurring Options</h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="recurring"
                        checked={meetingData.recurring}
                        onChange={handleMeetingChange}
                      />
                      <span>🔄 Recurring Meeting</span>
                    </label>
                  </div>
                  {meetingData.recurring && (
                    <select
                      name="recurringPattern"
                      value={meetingData.recurringPattern}
                      onChange={handleMeetingChange}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  )}
                </div>

                {/* Notes */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>📝 Notes</h4>
                  <textarea
                    name="notes"
                    placeholder="Meeting notes, preparation items, or additional information..."
                    value={meetingData.notes}
                    onChange={handleMeetingChange}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      minHeight: '100px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Form Actions */}
                <ModalActions>
                  <EditButton 
                    type="button" 
                    onClick={() => setShowMeetingModal(false)} 
                    style={{ background: '#6c757d', color: '#fff' }}
                    disabled={meetingSaving}
                  >
                    Cancel
                  </EditButton>
                  <EditButton 
                    type="submit" 
                    disabled={meetingSaving}
                    style={{ 
                      background: meetingSaving ? '#ccc' : '#0077b6',
                      color: '#fff'
                    }}
                  >
                    {meetingSaving ? '⏳ Saving...' : editingMeeting ? '💾 Update Meeting' : '📅 Schedule Meeting'}
                  </EditButton>
                </ModalActions>
              </ModalForm>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Meeting Templates Modal */}
        {showMeetingTemplates && (
          <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowMeetingTemplates(false)}>
            <ModalContent style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <ModalTitle style={{ margin: 0, color: '#0077b6' }}>📋 Meeting Templates</ModalTitle>
                <button 
                  onClick={() => setShowMeetingTemplates(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>
              
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Choose from our curated collection of meeting templates to schedule common startup meetings quickly.
              </p>

              {meetingTemplates.map((categoryGroup, index) => (
                <div key={index} style={{ marginBottom: '2rem' }}>
                  <h4 style={{ 
                    color: '#0077b6', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {getMeetingTypeIcon(categoryGroup.type)} 
                    {categoryGroup.type.charAt(0).toUpperCase() + categoryGroup.type.slice(1)} Meetings
                  </h4>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    {categoryGroup.templates.map((template, templateIndex) => (
                      <div key={templateIndex} style={{
                        background: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        padding: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e3f2fd';
                        e.currentTarget.style.borderColor = '#0077b6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#dee2e6';
                      }}
                      onClick={() => handleMeetingFromTemplate(template, categoryGroup.type)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h5 style={{ margin: 0, color: '#0077b6' }}>{template.title}</h5>
                          <span style={{ 
                            background: '#17a2b8', 
                            color: '#fff', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '12px', 
                            fontSize: '0.7rem'
                          }}>
                            {template.duration} min
                          </span>
                        </div>
                        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                          {template.description}
                        </p>
                        {template.agenda && template.agenda.length > 0 && (
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            <b>Agenda:</b> {template.agenda.slice(0, 2).join(', ')}{template.agenda.length > 2 ? '...' : ''}
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                          {template.recurring && <span>🔄 Recurring</span>}
                          <span>👆 Click to use</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <EditButton 
                  onClick={() => setShowMeetingTemplates(false)}
                  style={{ background: '#6c757d' }}
                >
                  Close Templates
                </EditButton>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Meeting Details Modal */}
        {showMeetingDetails && selectedMeeting && (
          <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowMeetingDetails(false)}>
            <ModalContent style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <ModalTitle style={{ margin: 0, color: '#0077b6' }}>
                  📅 {selectedMeeting.title}
                </ModalTitle>
                <button 
                  onClick={() => setShowMeetingDetails(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{getMeetingTypeIcon(selectedMeeting.type)}</span>
                  <span style={{ 
                    background: getMeetingStatusColor(selectedMeeting.status), 
                    color: '#fff', 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '15px', 
                    fontSize: '0.9rem',
                    textTransform: 'capitalize'
                  }}>
                    {selectedMeeting.status.replace('_', ' ')}
                  </span>
                </div>

                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                  {selectedMeeting.description}
                </p>

                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <b>📅 Date & Time:</b> {formatDateTime(selectedMeeting.dateTime)}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <b>⏱️ Duration:</b> {selectedMeeting.duration} minutes
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <b>{selectedMeeting.isVirtual ? '💻' : '📍'} Location:</b> {selectedMeeting.isVirtual ? 'Virtual Meeting' : selectedMeeting.location || 'TBD'}
                  </div>
                  {selectedMeeting.meetingLink && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <b>🔗 Meeting Link:</b> 
                      <a href={selectedMeeting.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b6', marginLeft: '0.5rem' }}>
                        Join Meeting
                      </a>
                    </div>
                  )}
                  {selectedMeeting.attendees && selectedMeeting.attendees.length > 0 && (
                    <div>
                      <b>👥 Attendees:</b> {selectedMeeting.attendees.join(', ')}
                    </div>
                  )}
                </div>

                {selectedMeeting.agenda && selectedMeeting.agenda.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h5 style={{ color: '#0077b6' }}>📝 Agenda</h5>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                      {selectedMeeting.agenda.map((item, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedMeeting.notes && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h5 style={{ color: '#0077b6' }}>📋 Notes</h5>
                    <p style={{ color: '#666', background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                      {selectedMeeting.notes}
                    </p>
                  </div>
                )}

                {selectedMeeting.actionItems && selectedMeeting.actionItems.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h5 style={{ color: '#0077b6' }}>✅ Action Items</h5>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                      {selectedMeeting.actionItems.map((item, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <EditButton 
                  onClick={() => {
                    setShowMeetingDetails(false);
                    handleEditMeeting(selectedMeeting);
                  }}
                  style={{ background: '#17a2b8' }}
                >
                  ✏️ Edit Meeting
                </EditButton>
                <EditButton 
                  onClick={() => setShowMeetingDetails(false)}
                  style={{ background: '#6c757d' }}
                >
                  Close
                </EditButton>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
        {/* Enhanced Document Modal with PC File Upload */}
        {showDocModal && (
          <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowDocModal(false)}>
            <ModalContent style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <ModalTitle style={{ margin: 0, color: '#0077b6' }}>
                  {editingDoc ? '✏️ Edit Document' : '📁 Upload New Document'}
                </ModalTitle>
                <button 
                  onClick={() => setShowDocModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>
              
              <ModalForm onSubmit={handleDocSubmit}>
                {/* File Upload Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    📁 File Upload
                  </h4>
                  
                  {/* Drag & Drop / File Select Area */}
                  <div 
                    style={{
                      border: '2px dashed #0077b6',
                      borderRadius: '12px',
                      padding: '2rem',
                      textAlign: 'center',
                      background: docData.file ? '#e3f2fd' : '#f8f9fa',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => document.getElementById('file-input').click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.background = '#e3f2fd';
                      e.currentTarget.style.borderColor = '#28a745';
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.background = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#0077b6';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.background = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#0077b6';
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        const file = files[0];
                        setDocData(prev => ({
                          ...prev,
                          file: file,
                          name: prev.name || file.name.split('.')[0],
                          fileSize: file.size,
                          fileType: file.type,
                          filename: file.name
                        }));
                      }
                    }}
                  >
                    <input
                      id="file-input"
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                    />
                    
                    {docData.file ? (
                      <div>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#28a745' }}>
                          {getDocumentIcon(docData.category, getFileExtension(docData.filename))}
                        </div>
                        <h4 style={{ color: '#28a745', margin: '0 0 0.5rem 0' }}>
                          📄 File Selected: {docData.filename}
                        </h4>
                        <p style={{ color: '#666', margin: '0.5rem 0' }}>
                          Size: {formatFileSize(docData.fileSize)} | Type: {docData.fileType}
                        </p>
                        <p style={{ color: '#0077b6', fontSize: '0.9rem' }}>
                          Click to select a different file or drag & drop to replace
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#0077b6' }}>📁</div>
                        <h4 style={{ color: '#0077b6', margin: '0 0 0.5rem 0' }}>
                          Upload Document from PC
                        </h4>
                        <p style={{ color: '#666', margin: '0.5rem 0' }}>
                          Click to browse files or drag & drop your document here
                        </p>
                        <p style={{ color: '#999', fontSize: '0.8rem' }}>
                          Supported: PDF, Word, Excel, PowerPoint, Images, Text, Archives
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => document.getElementById('file-input').click()}
                      style={{
                        background: '#0077b6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.7rem 1.5rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}
                    >
                      📁 Browse Computer
                    </button>
                    
                    {docData.file && (
                      <button
                        type="button"
                        onClick={() => {
                          setDocData(prev => ({ 
                            ...prev, 
                            file: null, 
                            filename: '', 
                            fileSize: 0, 
                            fileType: '' 
                          }));
                        }}
                        style={{
                          background: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.7rem 1.5rem',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        🗑️ Remove File
                      </button>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>📋 Document Details</h4>
                  <ModalInput 
                    name="name" 
                    placeholder="Document Name *" 
                    value={docData.name} 
                    onChange={handleDocChange} 
                    required 
                    style={{ marginBottom: '1rem' }}
                  />
                  <textarea
                    name="description"
                    placeholder="Document Description"
                    value={docData.description}
                    onChange={handleDocChange}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      minHeight: '80px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Category and Classification */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>🏷️ Classification</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
                      <select
                        name="category"
                        value={docData.category}
                        onChange={handleDocChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      >
                        {documentCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Subcategory</label>
                      <select
                        name="subcategory"
                        value={docData.subcategory}
                        onChange={handleDocChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="">Select subcategory</option>
                        {documentCategories.find(cat => cat.id === docData.category)?.subcategories?.map(sub => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tags and Version */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>🔖 Tags & Version</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tags</label>
                      <ModalInput 
                        name="tags" 
                        placeholder="Tags (comma separated, e.g., urgent, financial, legal)" 
                        value={docData.tags ? docData.tags.join(', ') : ''} 
                        onChange={handleDocTagsChange}
                      />
                      <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
                        💡 Add tags to help categorize and find documents easily
                      </small>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Version</label>
                      <ModalInput 
                        name="version" 
                        placeholder="Version (e.g., 1.0, 2.1)" 
                        value={docData.version} 
                        onChange={handleDocChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Permissions and Sharing */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>🔐 Permissions & Sharing</h4>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={docData.isPublic}
                        onChange={handleDocChange}
                      />
                      <span>🌐 Make this document public</span>
                    </label>
                    <small style={{ color: '#666', marginLeft: '1.5rem' }}>
                      Public documents can be accessed by anyone with the link
                    </small>
                  </div>

                  {!docData.isPublic && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Share with specific people
                      </label>
                      <ModalInput 
                        name="permissions" 
                        placeholder="Email addresses (comma separated, e.g., john@company.com, team@startup.com)" 
                        value={docData.permissions ? docData.permissions.join(', ') : ''} 
                        onChange={handlePermissionsChange}
                      />
                      <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
                        💡 Leave empty to keep document private to your team only
                      </small>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <ModalActions>
                  <EditButton 
                    type="button" 
                    onClick={() => setShowDocModal(false)} 
                    style={{ background: '#6c757d', color: '#fff' }}
                    disabled={docSaving}
                  >
                    Cancel
                  </EditButton>
                  <EditButton 
                    type="submit" 
                    disabled={docSaving || (!docData.file && !editingDoc)}
                    style={{ 
                      background: (docSaving || (!docData.file && !editingDoc)) ? '#ccc' : '#0077b6',
                      color: '#fff'
                    }}
                  >
                    {docSaving ? '⏳ Uploading...' : editingDoc ? '💾 Update Document' : '📁 Upload Document'}
                  </EditButton>
                </ModalActions>
              </ModalForm>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Document Templates Modal */}
        {showDocTemplates && (
          <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowDocTemplates(false)}>
            <ModalContent style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <ModalTitle style={{ margin: 0, color: '#0077b6' }}>📋 Document Templates</ModalTitle>
                <button 
                  onClick={() => setShowDocTemplates(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>
              
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Choose from our curated collection of document templates to create common business documents quickly.
              </p>

              {documentCategories.map((category, index) => (
                <div key={index} style={{ marginBottom: '2rem' }}>
                  <h4 style={{ 
                    color: '#0077b6', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {category.icon} {category.name}
                  </h4>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    {category.templates.map((template, templateIndex) => (
                      <div key={templateIndex} style={{
                        background: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        padding: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e3f2fd';
                        e.currentTarget.style.borderColor = '#0077b6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#dee2e6';
                      }}
                      onClick={() => handleDocFromTemplate(template, category.id)}
                      >
                        <h5 style={{ margin: '0 0 0.5rem 0', color: '#0077b6' }}>{template.name}</h5>
                        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                          {template.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                          <span>{category.icon} {category.name}</span>
                          <span>👆 Click to use</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <EditButton 
                  onClick={() => setShowDocTemplates(false)}
                  style={{ background: '#6c757d' }}
                >
                  Close Templates
                </EditButton>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Document Details Modal */}
        {showDocDetails && selectedDoc && (
          <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowDocDetails(false)}>
            <ModalContent style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <ModalTitle style={{ margin: 0, color: '#0077b6' }}>
                  {getDocumentIcon(selectedDoc.category, getFileExtension(selectedDoc.filename))} {selectedDoc.name}
                </ModalTitle>
                <button 
                  onClick={() => setShowDocDetails(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ 
                    background: documentCategories.find(cat => cat.id === selectedDoc.category)?.icon ? '#e3f2fd' : '#f0f0f0', 
                    color: '#0077b6', 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '15px', 
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {documentCategories.find(cat => cat.id === selectedDoc.category)?.icon} {selectedDoc.category}
                  </span>
                  {selectedDoc.version && (
                    <span style={{ 
                      background: '#f8f9fa', 
                      color: '#666', 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '15px', 
                      fontSize: '0.9rem'
                    }}>
                      v{selectedDoc.version}
                    </span>
                  )}
                  {selectedDoc.isFavorite && <span style={{ fontSize: '1.2rem' }}>⭐</span>}
                </div>

                <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  {selectedDoc.description}
                </p>

                <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <b>📁 Filename:</b> {selectedDoc.filename}
                    </div>
                    <div>
                      <b>💾 Size:</b> {formatFileSize(selectedDoc.size)}
                    </div>
                    <div>
                      <b>👤 Uploaded by:</b> {selectedDoc.uploadedBy}
                    </div>
                    <div>
                      <b>📅 Upload Date:</b> {formatDate(selectedDoc.uploadDate)}
                    </div>
                    <div>
                      <b>👁️ Views:</b> {selectedDoc.views}
                    </div>
                    <div>
                      <b>⬇️ Downloads:</b> {selectedDoc.downloads}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <b>🔐 Access:</b> {selectedDoc.isPublic ? '🌐 Public' : '🔒 Private'}
                    {selectedDoc.permissions && selectedDoc.permissions.length > 0 && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                        <b>Shared with:</b> {selectedDoc.permissions.join(', ')}
                      </div>
                    )}
                  </div>

                  <div>
                    <b>🏷️ Tags:</b> {selectedDoc.tags && selectedDoc.tags.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                        {selectedDoc.tags.map((tag, index) => (
                          <span key={index} style={{
                            background: '#e3f2fd',
                            color: '#0077b6',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#666' }}> No tags</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <EditButton 
                  onClick={() => downloadDocument(selectedDoc)}
                  style={{ background: '#28a745' }}
                >
                  ⬇️ Download
                </EditButton>
                <EditButton 
                  onClick={() => shareDocument(selectedDoc)}
                  style={{ background: '#17a2b8' }}
                >
                  🔗 Share
                </EditButton>
                <EditButton 
                  onClick={() => {
                    setShowDocDetails(false);
                    handleEditDoc(selectedDoc);
                  }}
                  style={{ background: '#007bff' }}
                >
                  ✏️ Edit
                </EditButton>
                <EditButton 
                  onClick={() => favoriteDocument(selectedDoc.id)}
                  style={{ background: selectedDoc.isFavorite ? '#ffc107' : '#f8f9fa', color: selectedDoc.isFavorite ? '#fff' : '#666' }}
                >
                  ⭐ {selectedDoc.isFavorite ? 'Unfavorite' : 'Favorite'}
                </EditButton>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Enhanced Announcement Modal */}
        {showAnnouncementModal && (
          <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowAnnouncementModal(false)}>
            <ModalContent style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <ModalTitle style={{ margin: 0, color: '#0077b6' }}>
                  {editingAnnouncement ? '✏️ Edit Announcement' : '📢 Create New Announcement'}
                </ModalTitle>
                <button 
                  onClick={() => setShowAnnouncementModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>
              
              <ModalForm onSubmit={handleAnnouncementSubmit}>
                {/* Basic Information */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>📋 Basic Information</h4>
                  <ModalInput 
                    name="title" 
                    placeholder="Announcement Title *" 
                    value={announcementData.title} 
                    onChange={handleAnnouncementChange} 
                    required 
                    style={{ marginBottom: '1rem' }}
                  />
                  <textarea
                    name="content"
                    placeholder="Write your announcement content here... *"
                    value={announcementData.content}
                    onChange={handleAnnouncementChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      minHeight: '120px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Category and Type */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>🏷️ Classification</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
                      <select
                        name="category"
                        value={announcementData.category}
                        onChange={handleAnnouncementChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      >
                        {announcementCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Type</label>
                      <select
                        name="type"
                        value={announcementData.type}
                        onChange={handleAnnouncementChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="general">📢 General</option>
                        <option value="urgent">🚨 Urgent</option>
                        <option value="milestone">🎯 Milestone</option>
                        <option value="feature">✨ Feature</option>
                        <option value="maintenance">🔧 Maintenance</option>
                        <option value="team">👥 Team</option>
                        <option value="hr">📋 HR</option>
                        <option value="social">🎉 Social</option>
                        <option value="meeting">📅 Meeting</option>
                        <option value="policy">📜 Policy</option>
                        <option value="reminder">⏰ Reminder</option>
                        <option value="celebration">🎊 Celebration</option>
                        <option value="training">📚 Training</option>
                        <option value="feedback">💬 Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Priority</label>
                      <select
                        name="priority"
                        value={announcementData.priority}
                        onChange={handleAnnouncementChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                        <option value="urgent">🚨 Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tags and Audience */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>🔖 Tags & Audience</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tags</label>
                      <ModalInput 
                        name="tags" 
                        placeholder="Tags (comma separated, e.g., important, team, product)" 
                        value={announcementData.tags ? announcementData.tags.join(', ') : ''} 
                        onChange={handleAnnouncementTagsChange}
                      />
                      <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
                        💡 Add tags to help categorize and find announcements easily
                      </small>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Target Audience</label>
                      <select
                        name="targetAudience"
                        value={announcementData.targetAudience}
                        onChange={handleAnnouncementChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="all">👥 Everyone</option>
                        <option value="employees">👨‍💼 Employees</option>
                        <option value="customers">🤝 Customers</option>
                        <option value="investors">💰 Investors</option>
                        <option value="partners">🤝 Partners</option>
                        <option value="management">👔 Management</option>
                        <option value="engineers">💻 Engineers</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#0077b6', marginBottom: '1rem', fontSize: '1.1rem' }}>⚙️ Settings</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Scheduled Date (Optional)</label>
                      <input
                        type="datetime-local"
                        name="scheduledDate"
                        value={announcementData.scheduledDate}
                        onChange={handleAnnouncementChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Expiry Date (Optional)</label>
                      <input
                        type="datetime-local"
                        name="expiryDate"
                        value={announcementData.expiryDate}
                        onChange={handleAnnouncementChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="isUrgent"
                        checked={announcementData.isUrgent}
                        onChange={handleAnnouncementChange}
                      />
                      <span>🚨 Mark as urgent</span>
                    </label>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="isPinned"
                        checked={announcementData.isPinned}
                        onChange={handleAnnouncementChange}
                      />
                      <span>📌 Pin this announcement</span>
                    </label>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={announcementData.isPublic}
                        onChange={handleAnnouncementChange}
                      />
                      <span>🌐 Make public</span>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <ModalActions>
                  <EditButton 
                    type="button" 
                    onClick={() => setShowAnnouncementModal(false)} 
                    style={{ background: '#6c757d', color: '#fff' }}
                    disabled={announcementSaving}
                  >
                    Cancel
                  </EditButton>
                  <EditButton 
                    type="submit" 
                    disabled={announcementSaving || !announcementData.title || !announcementData.content}
                    style={{ 
                      background: (announcementSaving || !announcementData.title || !announcementData.content) ? '#ccc' : '#0077b6',
                      color: '#fff'
                    }}
                  >
                    {announcementSaving ? '⏳ Saving...' : editingAnnouncement ? '💾 Update Announcement' : '📢 Create Announcement'}
                  </EditButton>
                </ModalActions>
              </ModalForm>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Announcement Templates Modal */}
        {showAnnouncementTemplates && (
          <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowAnnouncementTemplates(false)}>
            <ModalContent style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <ModalTitle style={{ margin: 0, color: '#0077b6' }}>📋 Announcement Templates</ModalTitle>
                <button 
                  onClick={() => setShowAnnouncementTemplates(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>
              
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Choose from our curated collection of announcement templates to create professional announcements quickly.
              </p>

              {announcementCategories.map((category, index) => (
                <div key={index} style={{ marginBottom: '2rem' }}>
                  <h4 style={{ 
                    color: category.color, 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {category.icon} {category.name}
                  </h4>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    {category.templates.map((template, templateIndex) => (
                      <div key={templateIndex} style={{
                        background: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        padding: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e3f2fd';
                        e.currentTarget.style.borderColor = category.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#dee2e6';
                      }}
                      onClick={() => handleAnnouncementFromTemplate(template, category.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <h5 style={{ margin: 0, color: category.color }}>{template.title}</h5>
                          <span style={{ 
                            background: getPriorityColor(template.priority), 
                            color: '#fff', 
                            padding: '0.1rem 0.4rem', 
                            borderRadius: '8px', 
                            fontSize: '0.7rem'
                          }}>
                            {getPriorityIcon(template.priority)} {template.priority}
                          </span>
                        </div>
                        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
                          {template.content.substring(0, 120)}...
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                          <span>{getAnnouncementIcon(template.type)} {template.type}</span>
                          <span>👆 Click to use</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <EditButton 
                  onClick={() => setShowAnnouncementTemplates(false)}
                  style={{ background: '#6c757d' }}
                >
                  Close Templates
                </EditButton>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Announcement Details Modal */}
        {showAnnouncementDetails && selectedAnnouncement && (
          <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowAnnouncementDetails(false)}>
            <ModalContent style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <ModalTitle style={{ margin: 0, color: '#0077b6' }}>
                  {getAnnouncementIcon(selectedAnnouncement.type)} {selectedAnnouncement.title}
                </ModalTitle>
                <button 
                  onClick={() => setShowAnnouncementDetails(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ 
                    background: announcementCategories.find(cat => cat.id === selectedAnnouncement.category)?.color || '#0077b6', 
                    color: '#fff', 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '15px', 
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {announcementCategories.find(cat => cat.id === selectedAnnouncement.category)?.icon} {selectedAnnouncement.category}
                  </span>
                  <span style={{ 
                    background: getPriorityColor(selectedAnnouncement.priority), 
                    color: '#fff', 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '15px', 
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {getPriorityIcon(selectedAnnouncement.priority)} {selectedAnnouncement.priority}
                  </span>
                  {selectedAnnouncement.isPinned && (
                    <span style={{ background: '#ffc107', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '15px', fontSize: '0.9rem' }}>
                      📌 Pinned
                    </span>
                  )}
                  {selectedAnnouncement.isUrgent && (
                    <span style={{ background: '#dc3545', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '15px', fontSize: '0.9rem' }}>
                      🚨 Urgent
                    </span>
                  )}
                </div>

                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <b>👤 Author:</b> {selectedAnnouncement.author}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <b>📅 Created:</b> {formatDate(selectedAnnouncement.createdAt)}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <b>👥 Target Audience:</b> {selectedAnnouncement.targetAudience}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <b>👁️ Views:</b> {selectedAnnouncement.views}
                  </div>
                  <div>
                    <b>🔐 Visibility:</b> {selectedAnnouncement.isPublic ? '🌐 Public' : '🔒 Private'}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ color: '#0077b6', marginBottom: '1rem' }}>📝 Content</h5>
                  <p style={{ color: '#333', lineHeight: '1.6', fontSize: '1rem', background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                    {selectedAnnouncement.content}
                  </p>
                </div>

                {selectedAnnouncement.tags && selectedAnnouncement.tags.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h5 style={{ color: '#0077b6', marginBottom: '1rem' }}>🏷️ Tags</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {selectedAnnouncement.tags.map((tag, index) => (
                        <span key={index} style={{
                          background: '#e3f2fd',
                          color: '#0077b6',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ color: '#0077b6', marginBottom: '1rem' }}>👍 Reactions</h5>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>👍</span>
                      <span><b>{selectedAnnouncement.reactions?.likes || 0}</b> Likes</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>❤️</span>
                      <span><b>{selectedAnnouncement.reactions?.heart || 0}</b> Hearts</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>👏</span>
                      <span><b>{selectedAnnouncement.reactions?.clap || 0}</b> Claps</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <EditButton 
                  onClick={() => {
                    setShowAnnouncementDetails(false);
                    handleEditAnnouncement(selectedAnnouncement);
                  }}
                  style={{ background: '#007bff' }}
                >
                  ✏️ Edit
                </EditButton>
                <EditButton 
                  onClick={() => pinAnnouncement(selectedAnnouncement.id)}
                  style={{ background: selectedAnnouncement.isPinned ? '#ffc107' : '#6c757d' }}
                >
                  📌 {selectedAnnouncement.isPinned ? 'Unpin' : 'Pin'}
                </EditButton>
                <EditButton 
                  onClick={() => markAsUrgent(selectedAnnouncement.id)}
                  style={{ background: selectedAnnouncement.isUrgent ? '#dc3545' : '#6c757d' }}
                >
                  🚨 {selectedAnnouncement.isUrgent ? 'Remove Urgent' : 'Mark Urgent'}
                </EditButton>
                <EditButton 
                  onClick={() => setShowAnnouncementDetails(false)}
                  style={{ background: '#6c757d' }}
                >
                  Close
                </EditButton>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Investor Profile Modal */}
        {showInvestorProfileModal && selectedInvestor && (
          <ModalOverlay onClick={handleCloseInvestorProfile}>
            <ModalContent 
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '700px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ margin: 0, color: '#0077b6' }}>👤 Investor Profile</h2>
                  {selectedInvestor._isLiveData ? (
                    <div style={{ fontSize: '0.8rem', color: '#28a745', marginTop: '0.2rem' }}>
                      ✅ Live data - Updated when investor edits profile
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.2rem' }}>
                      📋 Demo data - Backend not available
                    </div>
                  )}
                </div>
                <EditButton 
                  onClick={handleCloseInvestorProfile}
                  style={{ background: '#6c757d', fontSize: '1.2rem', padding: '0.5rem 0.8rem' }}
                >
                  ✕
                </EditButton>
              </div>

              {investorProfileLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Loading investor profile...</div>
                  <div>⏳</div>
                </div>
              ) : (
                <div>
                  {/* Basic Info */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '12px', 
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👤</div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>
                      {selectedInvestor.name || selectedInvestor.email}
                    </h3>
                    <p style={{ margin: '0', opacity: 0.9 }}>
                      {selectedInvestor.location || 'Location not specified'}
                    </p>
                    {selectedInvestor.website && (
                      <a 
                        href={selectedInvestor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'white', textDecoration: 'underline', fontSize: '0.9rem' }}
                      >
                        🌐 Visit Website
                      </a>
                    )}
                  </div>

                  {/* Investment Focus */}
                  <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <h4 style={{ color: '#0077b6', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      💰 Investment Focus
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <strong>Ticket Size:</strong>
                        <div style={{ color: '#28a745', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          {selectedInvestor.ticketSize || '$10K - $100K'}
                        </div>
                      </div>
                      <div>
                        <strong>Investment Stages:</strong>
                        <div style={{ marginTop: '0.3rem' }}>
                          {selectedInvestor.investmentStage?.map(stage => (
                            <span key={stage} style={{ 
                              background: '#e3f2fd', 
                              color: '#0277bd', 
                              padding: '0.2rem 0.5rem', 
                              borderRadius: '12px', 
                              fontSize: '0.8rem',
                              marginRight: '0.5rem',
                              display: 'inline-block',
                              marginBottom: '0.3rem'
                            }}>
                              {stage}
                            </span>
                          )) || 'Not specified'}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <strong>Preferred Industries:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        {selectedInvestor.industries?.map(industry => (
                          <span key={industry} style={{ 
                            background: '#e8f5e8', 
                            color: '#2e7d32', 
                            padding: '0.2rem 0.6rem', 
                            borderRadius: '12px', 
                            fontSize: '0.8rem',
                            marginRight: '0.5rem',
                            display: 'inline-block',
                            marginBottom: '0.3rem'
                          }}>
                            {industry}
                          </span>
                        )) || 'Not specified'}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {selectedInvestor.bio && (
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e0e0e0' }}>
                      <h4 style={{ color: '#0077b6', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📝 About
                      </h4>
                      <p style={{ lineHeight: '1.6', margin: 0, color: '#333' }}>
                        {selectedInvestor.bio}
                      </p>
                    </div>
                  )}

                  {/* Investment Stats */}
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e0e0e0' }}>
                    <h4 style={{ color: '#0077b6', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      📊 Investment Stats
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                      <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0077b6' }}>
                          {selectedInvestor.companiesInvested || 25}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Companies Invested</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                          {selectedInvestor.totalInvestment || '$2.5M'}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Investment</div>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Highlights */}
                  {selectedInvestor.portfolioHighlights && (
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e0e0e0' }}>
                      <h4 style={{ color: '#0077b6', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🏆 Portfolio Highlights
                      </h4>
                      <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                        {selectedInvestor.portfolioHighlights.map((highlight, index) => (
                          <li key={index} style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
                    <EditButton 
                      onClick={() => {
                        handleConnect(selectedInvestor._id);
                        handleCloseInvestorProfile();
                      }}
                      style={{ 
                        background: '#0077b6', 
                        fontSize: '1rem', 
                        padding: '0.8rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaPaperPlane /> Connect with {selectedInvestor.name?.split(' ')[0] || 'Investor'}
                    </EditButton>
                    <EditButton 
                      onClick={() => handleViewInvestorProfile(selectedInvestor)}
                      style={{ 
                        background: '#17a2b8', 
                        fontSize: '1rem', 
                        padding: '0.8rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      disabled={investorProfileLoading}
                    >
                      {investorProfileLoading ? '⏳' : '🔄'} Refresh Profile
                    </EditButton>
                    <EditButton 
                      onClick={handleCloseInvestorProfile}
                      style={{ 
                        background: '#6c757d', 
                        fontSize: '1rem', 
                        padding: '0.8rem 1.5rem'
                      }}
                    >
                      Close
                    </EditButton>
                  </div>
                </div>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </Main>
    </Container>
  );
};

export default DashboardMain; 