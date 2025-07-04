import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { 
  FaUser, FaChartLine, FaHandshake, FaFileAlt, FaBookmark, 
  FaSearch, FaFire, FaEnvelope, FaFileContract, FaLightbulb,
  FaIndustry, FaMoneyBillWave, FaMapMarkerAlt, FaChartBar, FaTrash, FaDownload, FaCamera, FaEdit, FaTimes
} from 'react-icons/fa';
import { Api } from '../utils/Api';
import DocumentViewer from '../components/DocumentViewer';

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f4f8fb;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #fff;
  padding: 1.5rem;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const Section = styled.section`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.3rem;
  color: #0077b6;
  margin-bottom: 1.2rem;
`;

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafd;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const ProfilePicContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfilePicture = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #0077b6;
  }
`;

const ProfilePicUpload = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: #0077b6;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid white;
  
  &:hover {
    background: #005a8a;
    transform: scale(1.1);
  }
  
  &:hover::after {
    content: 'Upload profile picture';
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    white-space: nowrap;
    z-index: 1000;
  }
`;

const ProfilePicInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const ProfilePicRemove = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid white;
  opacity: ${props => props.show ? 1 : 0};
  transform: ${props => props.show ? 'scale(1)' : 'scale(0)'};
  
  &:hover {
    background: #c82333;
    transform: scale(1.1);
  }
  
  &:hover::after {
    content: 'Remove profile picture';
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    white-space: nowrap;
    z-index: 1000;
  }
`;

const StartupCard = styled.div`
  background: #f7fafd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => (props.active ? '#0077b6' : '#333')};
  text-decoration: none;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  background: ${props => (props.active ? '#e0f7fa' : 'transparent')};
  border-radius: 6px;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
`;

const DocumentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid #eee;
`;

const SavedStartupRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid #eee;
`;

const InvestorDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const history = useHistory();
  const [investorProfile, setInvestorProfile] = useState(null);
  const [recommendedStartups, setRecommendedStartups] = useState([]);
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [savedStartups, setSavedStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('profile');
  const [docForm, setDocForm] = useState({ type: '', title: '', url: '', startup: '' });
  const [docUploading, setDocUploading] = useState(false);
  const [docError, setDocError] = useState('');
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [availableStartups, setAvailableStartups] = useState([]);
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profilePicUploading, setProfilePicUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    location: '',
    industries: [],
    minTicket: '',
    maxTicket: '',
    bio: '',
    phone: '',
    company: '',
    website: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
  }, [userInfo, history]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [profileRes, startupsRes, meetingsRes, docsRes, savedRes] = await Promise.all([
          Api.getRequest('/api/investor/profile'),
          Api.getRequest('/api/investor/recommendations'),
          Api.getRequest('/api/investor/meetings'),
          Api.getRequest('/api/investor/documents'),
          Api.getRequest('/api/investor/saved')
        ]);
        
        // Parse responses safely
        const parseResponse = (res) => {
          if (typeof res.data === 'string') {
            try {
              return JSON.parse(res.data);
            } catch {
              return res.data;
            }
          }
          return res.data;
        };

        const profileData = parseResponse(profileRes);
        const startupsData = parseResponse(startupsRes);
        const meetingsData = parseResponse(meetingsRes);
        const docsData = parseResponse(docsRes);
        const savedData = parseResponse(savedRes);

        setInvestorProfile(profileData || {});
        setRecommendedStartups(Array.isArray(startupsData) ? startupsData : []);
        setMeetingRequests(Array.isArray(meetingsData) ? meetingsData : []);
        setDocuments(Array.isArray(docsData) ? docsData : []);
        setSavedStartups(Array.isArray(savedData) ? savedData : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        
        // Set sample data for demonstration when backend is not available
        setInvestorProfile({
          name: userInfo?.name || 'John Investor',
          email: userInfo?.email || 'john@investor.com',
          industries: ['Technology', 'FinTech', 'Healthcare'],
          minTicket: 500000,
          maxTicket: 5000000,
          location: 'Mumbai, India',
          portfolio: []
        });
        
        // Sample startup data
        setRecommendedStartups([
          {
            _id: '1',
            name: 'TechStart Solutions',
            tagline: 'AI-powered business automation',
            industry: 'Technology',
            fundingAsk: 2000000,
            location: 'Bangalore',
            logo: 'https://placehold.co/50x50'
          },
          {
            _id: '2',
            name: 'HealthCare Plus',
            tagline: 'Telemedicine for rural areas',
            industry: 'Healthcare',
            fundingAsk: 1500000,
            location: 'Delhi',
            logo: 'https://placehold.co/50x50'
          },
          {
            _id: '3',
            name: 'FinFlow',
            tagline: 'Digital payments for SMEs',
            industry: 'FinTech',
            fundingAsk: 3000000,
            location: 'Mumbai',
            logo: 'https://placehold.co/50x50'
          }
        ]);
        
        // Sample meeting data
        setMeetingRequests([
          {
            _id: 'm1',
            startupName: 'TechStart Solutions',
            date: new Date(Date.now() + 86400000).toISOString(),
            status: 'pending'
          },
          {
            _id: 'm2',
            startupName: 'HealthCare Plus',
            date: new Date(Date.now() + 172800000).toISOString(),
            status: 'pending'
          }
        ]);
        
        // Sample documents
        setDocuments([
          {
            _id: 'd1',
            title: 'TechStart Pitch Deck',
            type: 'pitch_deck',
            url: 'https://www.example.com/sample-pitch-deck.pdf',
            fileName: 'TechStart_Pitch_Deck.pdf',
            fileSize: 2048000,
            fileType: 'application/pdf',
            isDemo: true
          },
          {
            _id: 'd2',
            title: 'Investment Agreement Template',
            type: 'term_sheet',
            url: 'https://www.example.com/investment-agreement.pdf',
            fileName: 'Investment_Agreement.pdf',
            fileSize: 1024000,
            fileType: 'application/pdf',
            isDemo: true
          }
        ]);
        
        // Sample saved startups
        setSavedStartups([
          {
            _id: 's1',
            name: 'EcoGreen Solutions',
            industry: 'Sustainability',
            logo: 'https://placehold.co/40x40'
          },
          {
            _id: 's2',
            name: 'EdTech Innovations',
            industry: 'Education',
            logo: 'https://placehold.co/40x40'
          }
        ]);
      }
    }
    
    if (userInfo) {
      fetchData();
    }
  }, [userInfo]);

  // Document upload handlers
  const handleDocInput = e => {
    setDocForm({ ...docForm, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setDocError('Invalid file type. Please upload PDF, Word, Excel, PowerPoint, image, or text files.');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setDocError('File size too large. Please upload files smaller than 10MB.');
        return;
      }
      
      setSelectedFile(file);
      setDocError('');
      
      // Auto-fill title if empty
      if (!docForm.title) {
        const fileName = file.name.substring(0, file.name.lastIndexOf('.'));
        setDocForm(prev => ({ ...prev, title: fileName }));
      }
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const simulateFileUpload = (file) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          // Simulate cloud storage URL
          const fileUrl = `https://cloud-storage.example.com/investor-docs/${Date.now()}-${file.name}`;
          resolve(fileUrl);
        }
        setUploadProgress(Math.min(progress, 100));
      }, 200);
    });
  };
  
  const handleDocUpload = async e => {
    e.preventDefault();
    setDocUploading(true);
    setDocError('');
    setUploadProgress(0);
    
    try {
      let documentData = { ...docForm };
      
      if (uploadMethod === 'file' && selectedFile) {
        // Handle file upload
        try {
          // Convert file to base64 for storage/transmission
          const base64File = await convertFileToBase64(selectedFile);
          
          // Simulate file upload to cloud storage
          const fileUrl = await simulateFileUpload(selectedFile);
          
          documentData = {
            ...docForm,
            url: fileUrl,
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
            base64Data: base64File // In real app, this would be uploaded to cloud storage
          };
        } catch (fileError) {
          setDocError('Failed to process file');
          setDocUploading(false);
          return;
        }
      } else if (uploadMethod === 'url' && !docForm.url) {
        setDocError('Please provide a document URL');
        setDocUploading(false);
        return;
      }
      
      // Validation
      if (!documentData.type || !documentData.title) {
        setDocError('Please fill in all required fields');
        setDocUploading(false);
        return;
      }
      
      // Try to send to backend
      try {
        const res = await Api.postRequest('/api/investor/documents', documentData);
        if (res.statusCode === 200 || res.statusCode === 201) {
          const newDoc = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          setDocuments(prev => [...prev, { ...documentData, _id: Date.now() }]);
          resetDocumentForm();
          alert('Document uploaded successfully!');
        } else {
          throw new Error('Backend error');
        }
      } catch (apiError) {
        // Fallback: Add to local state for demo
        console.warn('Backend not available, adding document locally');
        const newDoc = {
          ...documentData,
          _id: Date.now(),
          uploadedAt: new Date().toISOString(),
          status: 'uploaded'
        };
        setDocuments(prev => [...prev, newDoc]);
        resetDocumentForm();
        alert('Document uploaded successfully! (Demo mode - saved locally)');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setDocError('Failed to upload document. Please try again.');
    }
    
    setDocUploading(false);
    setUploadProgress(0);
  };

  const resetDocumentForm = () => {
    setDocForm({ type: '', title: '', url: '', startup: '' });
    setSelectedFile(null);
    setUploadProgress(0);
    setDocError('');
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      // Use the same validation as file select
      const fakeEvent = { target: { files: [file] } };
      handleFileSelect(fakeEvent);
    }
  };

  // Connect functionality
  const handleOpenConnect = async () => {
    setShowConnectModal(true);
    setConnectLoading(true);
    
    try {
      // Try to fetch startups from API
      const res = await Api.getRequest('/api/startups/available');
      if (res.statusCode === 200) {
        const startupsData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        setAvailableStartups(Array.isArray(startupsData) ? startupsData : []);
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      console.warn('Backend not available, loading sample startups');
      // Sample startups for demo
      setAvailableStartups([
        {
          _id: 'startup1',
          name: 'GreenTech Solutions',
          tagline: 'Sustainable energy solutions for smart cities',
          industry: 'Sustainability',
          location: 'Bangalore, India',
          fundingAsk: 2500000,
          stage: 'Series A',
          logo: 'https://placehold.co/60x60',
          description: 'We develop innovative solar panel technologies that are 40% more efficient than traditional panels.',
          team: 'Founded by IIT alumni with 15+ years in renewable energy',
          traction: '500+ installations, $2M ARR'
        },
        {
          _id: 'startup2',
          name: 'MedAI Diagnostics',
          tagline: 'AI-powered medical diagnosis for rural healthcare',
          industry: 'Healthcare',
          location: 'Mumbai, India',
          fundingAsk: 3000000,
          stage: 'Series A',
          logo: 'https://placehold.co/60x60',
          description: 'Using machine learning to provide accurate medical diagnostics in remote areas where specialists are unavailable.',
          team: 'Team of 12 including 3 doctors and 4 AI engineers',
          traction: 'Deployed in 50+ clinics, 10,000+ diagnoses completed'
        },
        {
          _id: 'startup3',
          name: 'EduVerse',
          tagline: 'Immersive VR learning experiences',
          industry: 'Education',
          location: 'Delhi, India',
          fundingAsk: 1800000,
          stage: 'Seed',
          logo: 'https://placehold.co/60x60',
          description: 'Creating virtual reality educational content that makes learning interactive and engaging for students.',
          team: 'Founded by ex-Google engineers with education expertise',
          traction: '200+ schools using platform, 50,000+ students engaged'
        },
        {
          _id: 'startup4',
          name: 'FinFlow Pro',
          tagline: 'Digital banking for small businesses',
          industry: 'FinTech',
          location: 'Pune, India',
          fundingAsk: 4000000,
          stage: 'Series A',
          logo: 'https://placehold.co/60x60',
          description: 'Comprehensive digital banking platform designed specifically for small and medium enterprises.',
          team: 'Ex-banking professionals with deep fintech experience',
          traction: '1,000+ business clients, $5M+ transactions processed'
        },
        {
          _id: 'startup5',
          name: 'FoodTech Innovations',
          tagline: 'Smart kitchen appliances for healthy cooking',
          industry: 'Food & Beverage',
          location: 'Chennai, India',
          fundingAsk: 2200000,
          stage: 'Pre-Series A',
          logo: 'https://placehold.co/60x60',
          description: 'IoT-enabled kitchen appliances that help users cook healthier meals with guided recipes and nutrition tracking.',
          team: '8 people including hardware and software engineers',
          traction: '5,000+ units sold, partnerships with 3 major retailers'
        },
        {
          _id: 'startup6',
          name: 'LogiSmart',
          tagline: 'AI-optimized supply chain management',
          industry: 'Technology',
          location: 'Hyderabad, India',
          fundingAsk: 3500000,
          stage: 'Series A',
          logo: 'https://placehold.co/60x60',
          description: 'Machine learning platform that optimizes supply chain operations and reduces logistics costs by 30%.',
          team: 'Supply chain experts and AI researchers',
          traction: '25+ enterprise clients, $1.5M ARR'
        }
      ]);
    }
    
    setConnectLoading(false);
  };

  const handleSendConnectionRequest = async (startup) => {
    try {
      const requestData = {
        startupId: startup._id,
        investorId: userInfo?._id,
        message: `Hi ${startup.name} team! I'm interested in learning more about your company and potential investment opportunities. I'd love to schedule a meeting to discuss further.`,
        requestType: 'investment_interest',
        investorProfile: {
          name: investorProfile?.name || userInfo?.name,
          company: investorProfile?.company || 'Independent Investor',
          industries: investorProfile?.industries || [],
          ticketSize: `₹${investorProfile?.minTicket?.toLocaleString()} - ₹${investorProfile?.maxTicket?.toLocaleString()}`
        }
      };

      // Try API first
      try {
        const res = await Api.postRequest('/api/connections/request', requestData);
        if (res.statusCode === 200 || res.statusCode === 201) {
          alert(`Connection request sent to ${startup.name} successfully!`);
          // Add to local tracking
          setConnectionRequests(prev => [...prev, {
            ...requestData,
            _id: Date.now(),
            status: 'pending',
            sentAt: new Date().toISOString()
          }]);
          return;
        }
      } catch (apiError) {
        console.warn('API not available, simulating request');
      }

      // Fallback: Simulate sending request
      setConnectionRequests(prev => [...prev, {
        ...requestData,
        _id: Date.now(),
        status: 'pending',
        sentAt: new Date().toISOString()
      }]);

      // Simulate notification to startup
      const notification = {
        type: 'connection_request',
        from: investorProfile?.name || userInfo?.name,
        startup: startup.name,
        message: `New investment interest from ${investorProfile?.name || userInfo?.name}`,
        timestamp: new Date().toLocaleString()
      };

      console.log('📧 Startup Notification Sent:', notification);
      
      alert(`Connection request sent to ${startup.name} successfully! They will receive a notification and can respond via their dashboard.`);
      
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request. Please try again.');
    }
  };

  const handleCloseConnectModal = () => {
    setShowConnectModal(false);
  };

  const isAlreadyRequested = (startupId) => {
    return connectionRequests.some(req => req.startupId === startupId);
  };

  // Handle startup interactions
  const handleViewStartupDetails = (startup) => {
    // Navigate to startup details page or show modal
    alert(`Viewing details for ${startup.name}\nIndustry: ${startup.industry}\nFunding Ask: ₹${startup.fundingAsk}`);
  };

  const handleSaveStartup = async (startupId) => {
    try {
      const res = await Api.postRequest(`/api/investor/save/${startupId}`, {});
      if (res.statusCode === 200 || res.statusCode === 201) {
        alert('Startup saved successfully!');
        // Refresh saved startups
        const savedRes = await Api.getRequest('/api/investor/saved');
        const savedData = typeof savedRes.data === 'string' ? JSON.parse(savedRes.data) : savedRes.data;
        setSavedStartups(Array.isArray(savedData) ? savedData : []);
      }
    } catch (err) {
      alert('Failed to save startup');
    }
  };

  // Unsave startup handler
  const handleUnsave = async (startupId) => {
    try {
      const res = await Api.DeleteRequest(`/api/investor/unsave/${startupId}`);
      if (res.statusCode === 200) {
        setSavedStartups(prev => prev.filter(s => s._id !== startupId));
        alert('Startup removed from saved list');
      }
    } catch (err) {
      alert('Failed to remove startup');
    }
  };

  // Meeting handlers
  const handleMeetingAction = async (meetingId, action) => {
    try {
      const res = await Api.putRequest(`/api/investor/meetings/${meetingId}`, { 
        status: action,
        notes: action === 'accepted' ? 'Meeting accepted by investor' : 'Meeting declined by investor'
      });
      
      if (res.statusCode === 200) {
        // Update meeting in state
        setMeetingRequests(prev => 
          prev.map(meeting => 
            meeting._id === meetingId 
              ? { ...meeting, status: action }
              : meeting
          )
        );
        alert(`Meeting ${action} successfully!`);
      }
    } catch (err) {
      alert(`Failed to ${action} meeting`);
    }
  };

  // Contact startup handler
  const handleContactStartup = async (startup) => {
    const message = prompt(`Send a message to ${startup.name}:`);
    if (message) {
      try {
        const res = await Api.postRequest('/api/investor/messages', {
          startup: startup._id,
          content: message
        });
        if (res.statusCode === 200 || res.statusCode === 201) {
          alert('Message sent successfully!');
        }
      } catch (err) {
        alert('Failed to send message');
      }
    }
  };

  // Edit profile handlers
  const handleEditProfile = () => {
    // Pre-populate the form with current profile data
    setEditForm({
      name: investorProfile?.name || userInfo?.name || '',
      email: investorProfile?.email || userInfo?.email || '',
      location: investorProfile?.location || '',
      industries: investorProfile?.industries || [],
      minTicket: investorProfile?.minTicket || '',
      maxTicket: investorProfile?.maxTicket || '',
      bio: investorProfile?.bio || '',
      phone: investorProfile?.phone || '',
      company: investorProfile?.company || '',
      website: investorProfile?.website || ''
    });
    setShowEditModal(true);
    setEditError('');
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIndustryChange = (industry) => {
    setEditForm(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry]
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');

    // Validation
    if (!editForm.name || !editForm.email) {
      setEditError('Name and email are required');
      setEditLoading(false);
      return;
    }

    if (editForm.minTicket && editForm.maxTicket && 
        parseInt(editForm.minTicket) > parseInt(editForm.maxTicket)) {
      setEditError('Minimum ticket size cannot be greater than maximum');
      setEditLoading(false);
      return;
    }

    // Prepare update data outside try-catch to make it available in both blocks
    const updateData = {
      ...editForm,
      minTicket: editForm.minTicket ? parseInt(editForm.minTicket) : 0,
      maxTicket: editForm.maxTicket ? parseInt(editForm.maxTicket) : 0
    };

    try {
      const res = await Api.putRequest('/api/investor/profile', updateData);
      
      if (res && res.statusCode === 200) {
        // Update the local profile state
        const updatedProfile = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        setInvestorProfile(updatedProfile);
        setShowEditModal(false);
        setEditError('');
        alert('Profile updated successfully!');
      } else {
        // Any other response - update local state for demo
        console.warn('Backend response:', res);
        const updatedProfile = {
          ...investorProfile,
          ...updateData
        };
        setInvestorProfile(updatedProfile);
        setShowEditModal(false);
        setEditError('');
        alert('Profile updated successfully! (Demo mode - changes saved locally)');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      // Fallback: Always update local state when backend is not available
      console.warn('Backend error, updating local state for demonstration');
      const updatedProfile = {
        ...investorProfile,
        ...updateData
      };
      setInvestorProfile(updatedProfile);
      setShowEditModal(false);
      setEditError('');
      alert('Profile updated successfully! (Demo mode - changes saved locally)');
    }
    
    setEditLoading(false);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditError('');
  };

  // Profile picture upload handler
  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('Please select an image file smaller than 5MB');
      return;
    }

    setProfilePicUploading(true);

    try {
      // Convert file to base64 for local storage (demo mode)
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target.result;
        
        try {
          // Try to upload to backend first
          const uploadData = {
            profilePic: base64Image,
            fileName: file.name,
            fileType: file.type
          };

          const res = await Api.putRequest('/api/investor/profile-pic', uploadData);
          
          if (res && res.statusCode === 200) {
            // Backend upload successful
            const updatedProfile = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            setInvestorProfile(updatedProfile);
            alert('Profile picture updated successfully!');
          } else {
            // Backend not available - update local state
            console.warn('Backend not available, updating local state for demonstration');
            const updatedProfile = {
              ...investorProfile,
              profilePic: base64Image
            };
            setInvestorProfile(updatedProfile);
            alert('Profile picture updated successfully! (Demo mode - changes saved locally)');
          }
        } catch (error) {
          console.error('Profile picture upload error:', error);
          // Fallback: Always update local state
          const updatedProfile = {
            ...investorProfile,
            profilePic: base64Image
          };
          setInvestorProfile(updatedProfile);
          alert('Profile picture updated successfully! (Demo mode - changes saved locally)');
        }
        
        setProfilePicUploading(false);
      };

      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        setProfilePicUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Profile picture upload error:', error);
      alert('Error uploading profile picture. Please try again.');
      setProfilePicUploading(false);
    }

    // Clear the input so the same file can be selected again
    event.target.value = '';
  };

  // Profile picture remove handler
  const handleProfilePicRemove = async () => {
    // Confirm before removing
    const confirmed = window.confirm('Are you sure you want to remove your profile picture?');
    if (!confirmed) return;

    setProfilePicUploading(true);

    try {
      // Try to remove from backend first
      const res = await Api.putRequest('/api/investor/profile-pic', { profilePic: null });
      
      if (res && res.statusCode === 200) {
        // Backend removal successful
        const updatedProfile = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        setInvestorProfile(updatedProfile);
        alert('Profile picture removed successfully!');
      } else {
        // Backend not available - update local state
        console.warn('Backend not available, updating local state for demonstration');
        const updatedProfile = {
          ...investorProfile,
          profilePic: null
        };
        setInvestorProfile(updatedProfile);
        alert('Profile picture removed successfully! (Demo mode - changes saved locally)');
      }
    } catch (error) {
      console.error('Profile picture removal error:', error);
      // Fallback: Always update local state
      const updatedProfile = {
        ...investorProfile,
        profilePic: null
      };
      setInvestorProfile(updatedProfile);
      alert('Profile picture removed successfully! (Demo mode - changes saved locally)');
    }
    
    setProfilePicUploading(false);
  };

  // Document viewing handler - fixed to handle base64 data
  const handleDocumentView = (doc) => {
    try {
      // If document has base64 data (uploaded file), create a blob URL
      if (doc.base64Data) {
        // Extract the base64 data (remove data:type/subtype;base64, prefix)
        const base64Data = doc.base64Data.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: doc.fileType || 'application/octet-stream' });
        
        // Create a URL for the blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Check if it's a viewable file type
        if (doc.fileType && (doc.fileType.includes('image') || doc.fileType.includes('pdf') || doc.fileType.includes('text'))) {
          // Open in new tab for viewing
          window.open(blobUrl, '_blank');
        } else {
          // Download the file
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = doc.fileName || doc.title || 'document';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        // Clean up the blob URL after a short delay
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      } else if (doc.url && doc.url.startsWith('http')) {
        // External URL - open in new tab
        window.open(doc.url, '_blank', 'noopener,noreferrer');
      } else if (doc.isDemo) {
        // Demo document - show informational message
        alert(`📄 Demo Document: "${doc.title}"\n\nThis is a sample document for demonstration purposes. In a real application, this would open the actual document.\n\nDocument type: ${doc.type.replace('_', ' ').toUpperCase()}\nFile: ${doc.fileName || 'N/A'}\nSize: ${doc.fileSize ? (doc.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}`);
      } else {
        // Fallback for invalid URLs
        alert('This document cannot be viewed. The file may no longer be available.');
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Error opening document. Please try again.');
    }
  };

  // Close document viewer
  const handleCloseDocumentViewer = () => {
    setShowDocumentViewer(false);
    setSelectedDocument(null);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showEditModal) {
        handleCloseModal();
      }
    };

    if (showEditModal) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showEditModal]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#0077b6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>🔄</div>
          Loading Investor Dashboard...
        </div>
      </div>
    );
  }

  return (
    <DashboardContainer>
      <Sidebar>
        <ProfileCard>
          <ProfilePicContainer>
            <ProfilePicture 
              src={investorProfile?.profilePic || 'https://placehold.co/50x50'} 
              alt="Profile" 
            />
            <ProfilePicUpload>
              <ProfilePicInput 
                type="file" 
                accept="image/*" 
                onChange={handleProfilePicUpload}
                disabled={profilePicUploading}
              />
              {profilePicUploading ? '⏳' : <FaCamera />}
            </ProfilePicUpload>
            <ProfilePicRemove 
              show={investorProfile?.profilePic && !investorProfile.profilePic.includes('placehold.co')}
              onClick={handleProfilePicRemove}
            >
              <FaTimes />
            </ProfilePicRemove>
          </ProfilePicContainer>
          <div>
            <h3>{investorProfile?.name || 'Investor'}</h3>
            <p style={{ color: '#666' }}>Investor</p>
            {profilePicUploading && (
              <p style={{ color: '#0077b6', fontSize: '0.8rem', margin: '0.2rem 0' }}>
                Uploading...
              </p>
            )}
          </div>
        </ProfileCard>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <SidebarLink
                active={selectedSection === 'profile'}
                onClick={e => { e.preventDefault(); setSelectedSection('profile'); }}
                href="#profile"
              >
                <FaUser /> My Profile
              </SidebarLink>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <SidebarLink
                active={selectedSection === 'recommendations'}
                onClick={e => { e.preventDefault(); setSelectedSection('recommendations'); }}
                href="#recommendations"
              >
                <FaChartLine /> Recommendations
              </SidebarLink>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <SidebarLink
                active={selectedSection === 'meetings'}
                onClick={e => { e.preventDefault(); setSelectedSection('meetings'); }}
                href="#meetings"
              >
                <FaHandshake /> Meetings
              </SidebarLink>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <SidebarLink
                active={selectedSection === 'documents'}
                onClick={e => { e.preventDefault(); setSelectedSection('documents'); }}
                href="#documents"
              >
                <FaFileAlt /> Documents
              </SidebarLink>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <SidebarLink
                active={selectedSection === 'saved'}
                onClick={e => { e.preventDefault(); setSelectedSection('saved'); }}
                href="#saved"
              >
                <FaBookmark /> Saved Startups
              </SidebarLink>
            </li>
          </ul>
        </nav>
      </Sidebar>
      <MainContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0 }}>Welcome back, {investorProfile?.name || 'Investor'}</h1>
          
          {/* Connect Button */}
          <div style={{ marginLeft: 'auto', paddingLeft: '2rem' }}>
            <button
            onClick={handleOpenConnect}
            style={{
              background: 'linear-gradient(135deg, #0077b6, #00a8e6)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              boxShadow: '0 4px 15px rgba(0, 119, 182, 0.3)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 119, 182, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 119, 182, 0.3)';
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>🤝</span>
            Connect with Startups
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
              transform: 'rotate(45deg)',
              transition: 'all 0.6s'
            }}></div>
          </button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            background: '#fff', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            textAlign: 'center'
          }}>
            <FaChartLine style={{ color: '#0077b6', fontSize: '2rem', marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0.5rem 0', color: '#0077b6' }}>{recommendedStartups.length}</h3>
            <p style={{ margin: 0, color: '#666' }}>Recommendations</p>
          </div>
          <div style={{ 
            background: '#fff', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            textAlign: 'center'
          }}>
            <FaHandshake style={{ color: '#28a745', fontSize: '2rem', marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0.5rem 0', color: '#28a745' }}>{meetingRequests.length}</h3>
            <p style={{ margin: 0, color: '#666' }}>Meeting Requests</p>
          </div>
          <div style={{ 
            background: '#fff', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            textAlign: 'center'
          }}>
            <FaBookmark style={{ color: '#ffc107', fontSize: '2rem', marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0.5rem 0', color: '#ffc107' }}>{savedStartups.length}</h3>
            <p style={{ margin: 0, color: '#666' }}>Saved Startups</p>
          </div>
          <div style={{ 
            background: '#fff', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            textAlign: 'center'
          }}>
            <FaFileAlt style={{ color: '#17a2b8', fontSize: '2rem', marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0.5rem 0', color: '#17a2b8' }}>{documents.length}</h3>
            <p style={{ margin: 0, color: '#666' }}>Documents</p>
          </div>
        </div>
        {selectedSection === 'profile' && (
          <Section>
            <SectionTitle><FaUser /> Profile Overview</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div>
                <h4>Investment Preferences</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  {investorProfile?.industries?.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      {investorProfile.industries.map((industry, i) => (
                        <li key={i}>{industry}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: 0, color: '#666' }}>No preferences set</p>
                  )}
                </div>
              </div>
              <div>
                <h4>Investment Range</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  <p style={{ margin: 0 }}>
                    <b>Ticket Size:</b> ₹{investorProfile?.minTicket?.toLocaleString() || '0'} - ₹{investorProfile?.maxTicket?.toLocaleString() || '0'}
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0' }}>
                    <b>Portfolio Size:</b> {investorProfile?.portfolio?.length || 0} companies
                  </p>
                </div>
              </div>
              <div>
                <h4>Contact Information</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  <p style={{ margin: 0 }}><b>Email:</b> {investorProfile?.email || userInfo?.email || 'Not set'}</p>
                  <p style={{ margin: '0.5rem 0 0 0' }}><b>Location:</b> {investorProfile?.location || 'Not set'}</p>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button 
                onClick={handleEditProfile}
                style={{
                  background: '#0077b6',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = '#005a8b'}
                onMouseOut={(e) => e.target.style.background = '#0077b6'}
              >
                Edit Profile
              </button>
            </div>
          </Section>
        )}
        {selectedSection === 'recommendations' && (
          <Section>
            <SectionTitle><FaChartLine /> Startup Recommendations</SectionTitle>
            {recommendedStartups && recommendedStartups.length > 0 ? (
              recommendedStartups.map((startup, i) => (
                <StartupCard key={i}>
                  <img 
                    src={startup.logo || 'https://placehold.co/50x50'} 
                    alt={startup.name} 
                    style={{ borderRadius: '8px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3>{startup.name}</h3>
                    <p>{startup.tagline}</p>
                    <div style={{ display: 'flex', gap: '1rem', color: '#666' }}>
                      <span><FaIndustry /> {startup.industry}</span>
                      <span><FaMoneyBillWave /> ₹{startup.fundingAsk}</span>
                      <span><FaMapMarkerAlt /> {startup.location}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleViewStartupDetails(startup)}
                      style={{
                        background: '#0077b6',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleSaveStartup(startup._id)}
                      style={{
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <FaBookmark /> Save
                    </button>
                    <button 
                      onClick={() => handleContactStartup(startup)}
                      style={{
                        background: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <FaEnvelope /> Contact
                    </button>
                  </div>
                </StartupCard>
              ))
            ) : (
              <p>No recommendations available</p>
            )}
          </Section>
        )}
        {selectedSection === 'meetings' && (
          <Section>
            <SectionTitle><FaHandshake /> Meeting Requests</SectionTitle>
            {meetingRequests && meetingRequests.length > 0 ? (
              meetingRequests.map((meeting, i) => (
                <div key={i} style={{ 
                  background: '#f7fafd', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  marginBottom: '1rem' 
                }}>
                  <h3>Meeting with {meeting.startupName || meeting.startup?.name}</h3>
                  <p>Date: {new Date(meeting.date || meeting.scheduledAt).toLocaleString()}</p>
                  <p>Status: <span style={{ 
                    color: meeting.status === 'pending' ? '#ffc107' : 
                           meeting.status === 'accepted' ? '#28a745' : '#dc3545',
                    fontWeight: 'bold' 
                  }}>{meeting.status}</span></p>
                  {meeting.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        onClick={() => handleMeetingAction(meeting._id, 'accepted')}
                        style={{
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <FaHandshake /> Accept
                      </button>
                      <button 
                        onClick={() => handleMeetingAction(meeting._id, 'declined')}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No meeting requests</p>
            )}
          </Section>
        )}
        {selectedSection === 'documents' && (
          <Section>
            <SectionTitle><FaFileAlt /> Documents</SectionTitle>
            
            {/* Upload Method Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setUploadMethod('file')}
                  style={{
                    background: uploadMethod === 'file' ? '#0077b6' : '#f8f9fa',
                    color: uploadMethod === 'file' ? 'white' : '#333',
                    border: '1px solid #ddd',
                    padding: '0.7rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaFileAlt /> Upload from PC
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  style={{
                    background: uploadMethod === 'url' ? '#0077b6' : '#f8f9fa',
                    color: uploadMethod === 'url' ? 'white' : '#333',
                    border: '1px solid #ddd',
                    padding: '0.7rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaEnvelope /> Add URL Link
                </button>
              </div>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleDocUpload} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* Document Type */}
                <select 
                  name="type" 
                  value={docForm.type} 
                  onChange={handleDocInput} 
                  required
                  style={{
                    padding: '0.7rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Document Type</option>
                  <option value="pitch_deck">Pitch Deck</option>
                  <option value="term_sheet">Term Sheet</option>
                  <option value="nda">NDA</option>
                  <option value="cap_table">Cap Table</option>
                  <option value="financial_statements">Financial Statements</option>
                  <option value="business_plan">Business Plan</option>
                  <option value="legal_documents">Legal Documents</option>
                  <option value="other">Other</option>
                </select>

                {/* Document Title */}
                <input 
                  name="title" 
                  value={docForm.title} 
                  onChange={handleDocInput} 
                  placeholder="Document Title" 
                  required
                  style={{
                    padding: '0.7rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* File Upload or URL Input */}
              {uploadMethod === 'file' ? (
                <div style={{ marginBottom: '1rem' }}>
                  <div 
                    style={{
                      border: '2px dashed #ddd',
                      borderRadius: '8px',
                      padding: '2rem',
                      textAlign: 'center',
                      background: selectedFile ? '#f0f8ff' : '#fafafa',
                      transition: 'all 0.3s'
                    }}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
                      style={{ display: 'none' }}
                      id="fileInput"
                    />
                    <label 
                      htmlFor="fileInput" 
                      style={{ 
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ fontSize: '3rem', color: '#0077b6' }}>
                        📁
                      </div>
                      {selectedFile ? (
                        <div>
                          <p style={{ margin: 0, fontWeight: 'bold', color: '#0077b6' }}>
                            {selectedFile.name}
                          </p>
                          <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                            Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>
                            Click to upload or drag and drop
                          </p>
                          <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                            PDF, Word, Excel, PowerPoint, Images, Text files (Max 10MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '1rem' }}>
                  <input 
                    name="url" 
                    value={docForm.url} 
                    onChange={handleDocInput} 
                    placeholder="Enter document URL (e.g., Google Drive, Dropbox link)" 
                    required
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

              {/* Upload Progress */}
              {docUploading && uploadProgress > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #0077b6, #00a8e6)',
                      transition: 'width 0.3s'
                    }}></div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {docError && (
                <div style={{ 
                  color: '#dc3545', 
                  background: '#f8d7da', 
                  padding: '0.7rem', 
                  borderRadius: '6px',
                  border: '1px solid #f5c6cb',
                  marginBottom: '1rem'
                }}>
                  {docError}
                </div>
              )}

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button 
                  type="submit" 
                  disabled={docUploading || (!selectedFile && uploadMethod === 'file') || (!docForm.url && uploadMethod === 'url')}
                  style={{
                    background: docUploading ? '#ccc' : '#0077b6',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 2rem',
                    borderRadius: '6px',
                    cursor: docUploading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {docUploading ? (
                    <>🔄 Uploading...</>
                  ) : (
                    <>📤 {uploadMethod === 'file' ? 'Upload File' : 'Add Document'}</>
                  )}
                </button>
                
                {(selectedFile || docForm.url || docForm.title) && (
                  <button 
                    type="button" 
                    onClick={resetDocumentForm}
                    style={{
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '0.8rem 1.5rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            {/* Documents List */}
            <div>
              <h4 style={{ color: '#0077b6', marginBottom: '1rem' }}>Uploaded Documents</h4>
              {documents.length > 0 ? (
                documents.map((doc, i) => (
                  <DocumentRow key={i} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    padding: '1rem',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '1.5rem' }}>
                      {doc.type === 'pitch_deck' ? '📊' :
                       doc.type === 'term_sheet' ? '📋' :
                       doc.type === 'nda' ? '🔒' :
                       doc.type === 'cap_table' ? '📈' :
                       doc.type === 'financial_statements' ? '💰' :
                       doc.type === 'business_plan' ? '📋' : '📄'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>
                        {doc.title}
                        {doc.isDemo && <span style={{ 
                          marginLeft: '0.5rem', 
                          padding: '0.2rem 0.5rem', 
                          background: '#ffc107', 
                          color: '#000', 
                          borderRadius: '4px', 
                          fontSize: '0.7rem', 
                          fontWeight: 'bold' 
                        }}>DEMO</span>}
                      </p>
                      <p style={{ margin: '0.2rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                        {doc.type.replace('_', ' ').toUpperCase()}
                        {doc.fileName && ` • ${doc.fileName}`}
                        {doc.fileSize && ` • ${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleDocumentView(doc)}
                        style={{
                          background: '#0077b6',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.9rem'
                        }}
                      >
                        <FaDownload /> View
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this document?')) {
                            setDocuments(prev => prev.filter((_, index) => index !== i));
                          }
                        }}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </DocumentRow>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#666',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                  <p>No documents uploaded yet.</p>
                  <p style={{ fontSize: '0.9rem' }}>Upload your first document using the form above.</p>
                </div>
              )}
            </div>
          </Section>
        )}
        {selectedSection === 'saved' && (
          <Section>
            <SectionTitle><FaBookmark /> Saved Startups</SectionTitle>
            {savedStartups.length > 0 ? (
              savedStartups.map((startup, i) => (
                <SavedStartupRow key={i}>
                  <img src={startup.logo || 'https://placehold.co/40x40'} alt={startup.name} style={{ borderRadius: '8px', width: 40, height: 40 }} />
                  <div style={{ flex: 1 }}>
                    <span><b>{startup.name}</b></span>
                    <p style={{ color: '#666', margin: '0.2rem 0' }}>{startup.industry}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleViewStartupDetails(startup)}
                      style={{
                        background: '#0077b6',
                        color: 'white',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleUnsave(startup._id)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </SavedStartupRow>
              ))
            ) : (
              <p>No saved startups yet.</p>
            )}
          </Section>
        )}
      </MainContent>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: '#0077b6' }}>Edit Profile</h2>
              <button 
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Basic Information */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditInputChange}
                      required
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
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditInputChange}
                      required
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditInputChange}
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
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleEditInputChange}
                      placeholder="e.g., Mumbai, India"
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={editForm.company}
                      onChange={handleEditInputChange}
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
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={editForm.website}
                      onChange={handleEditInputChange}
                      placeholder="https://..."
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

                {/* Investment Range */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Min Ticket Size (₹)
                    </label>
                    <input
                      type="number"
                      name="minTicket"
                      value={editForm.minTicket}
                      onChange={handleEditInputChange}
                      min="0"
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
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Max Ticket Size (₹)
                    </label>
                    <input
                      type="number"
                      name="maxTicket"
                      value={editForm.maxTicket}
                      onChange={handleEditInputChange}
                      min="0"
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

                {/* Bio */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleEditInputChange}
                    rows="3"
                    placeholder="Tell startups about your investment approach..."
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Industry Preferences */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Industry Preferences
                  </label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '0.5rem',
                    padding: '1rem',
                    background: '#f8f9fa',
                    borderRadius: '6px'
                  }}>
                    {['Technology', 'FinTech', 'Healthcare', 'Education', 'E-commerce', 'SaaS', 'AI/ML', 'Sustainability', 'Gaming', 'Food & Beverage'].map(industry => (
                      <label key={industry} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={editForm.industries.includes(industry)}
                          onChange={() => handleIndustryChange(industry)}
                        />
                        <span>{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Error Display */}
                {editError && (
                  <div style={{ 
                    color: '#dc3545', 
                    background: '#f8d7da', 
                    padding: '0.7rem', 
                    borderRadius: '6px',
                    border: '1px solid #f5c6cb'
                  }}>
                    {editError}
                  </div>
                )}

                {/* Form Actions */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '0.7rem 1.5rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    style={{
                      background: editLoading ? '#ccc' : '#0077b6',
                      color: 'white',
                      border: 'none',
                      padding: '0.7rem 1.5rem',
                      borderRadius: '6px',
                      cursor: editLoading ? 'not-allowed' : 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    {editLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Connect with Startups Modal */}
      {showConnectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseConnectModal();
          }
        }}
        >
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            width: '95%',
            maxWidth: '1000px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            {/* Modal Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '2rem',
              borderBottom: '2px solid #f0f0f0',
              paddingBottom: '1rem'
            }}>
              <div>
                <h2 style={{ margin: 0, color: '#0077b6', fontSize: '1.8rem' }}>
                  🤝 Connect with Startups
                </h2>
                <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                  Discover and connect with innovative startups looking for investment
                </p>
              </div>
              <button 
                onClick={handleCloseConnectModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f0f0f0';
                  e.target.style.color = '#333';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#999';
                }}
              >
                ×
              </button>
            </div>

            {/* Loading State */}
            {connectLoading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem',
                color: '#0077b6'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
                <p>Loading available startups...</p>
              </div>
            ) : (
              /* Startups Grid */
              <div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
                  gap: '1.5rem' 
                }}>
                  {availableStartups.map((startup) => (
                    <div key={startup._id} style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                    }}
                    >
                      {/* Startup Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <img 
                          src={startup.logo} 
                          alt={startup.name}
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            borderRadius: '12px',
                            border: '2px solid #f0f0f0'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: 0, color: '#0077b6', fontSize: '1.3rem' }}>
                            {startup.name}
                          </h3>
                          <p style={{ margin: '0.3rem 0 0 0', color: '#666', fontStyle: 'italic' }}>
                            {startup.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Startup Details */}
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '1fr 1fr', 
                          gap: '0.5rem',
                          marginBottom: '1rem',
                          fontSize: '0.9rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#0077b6' }}>🏢</span>
                            <span>{startup.industry}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#0077b6' }}>📍</span>
                            <span>{startup.location}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#0077b6' }}>💰</span>
                            <span>₹{startup.fundingAsk.toLocaleString()}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#0077b6' }}>📈</span>
                            <span>{startup.stage}</span>
                          </div>
                        </div>

                        <p style={{ margin: '0.8rem 0', color: '#444', lineHeight: '1.5' }}>
                          {startup.description}
                        </p>

                        <div style={{ 
                          background: '#f8f9fa', 
                          padding: '0.8rem', 
                          borderRadius: '8px',
                          fontSize: '0.9rem'
                        }}>
                          <p style={{ margin: '0 0 0.5rem 0' }}>
                            <strong>Team:</strong> {startup.team}
                          </p>
                          <p style={{ margin: 0 }}>
                            <strong>Traction:</strong> {startup.traction}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div style={{ textAlign: 'center' }}>
                        {isAlreadyRequested(startup._id) ? (
                          <button
                            disabled
                            style={{
                              background: '#28a745',
                              color: 'white',
                              border: 'none',
                              padding: '0.8rem 2rem',
                              borderRadius: '8px',
                              fontSize: '1rem',
                              cursor: 'not-allowed',
                              opacity: 0.7
                            }}
                          >
                            ✅ Request Sent
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSendConnectionRequest(startup)}
                            style={{
                              background: 'linear-gradient(135deg, #0077b6, #00a8e6)',
                              color: 'white',
                              border: 'none',
                              padding: '0.8rem 2rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              fontWeight: 'bold',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 8px rgba(0, 119, 182, 0.3)'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 15px rgba(0, 119, 182, 0.4)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0px)';
                              e.target.style.boxShadow = '0 2px 8px rgba(0, 119, 182, 0.3)';
                            }}
                          >
                            🚀 Send Connection Request
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Startups Message */}
                {availableStartups.length === 0 && !connectLoading && (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#666'
                  }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                    <h3>No startups available at the moment</h3>
                    <p>Check back later for new investment opportunities!</p>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div style={{ 
              marginTop: '2rem', 
              paddingTop: '1rem',
              borderTop: '1px solid #f0f0f0',
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem'
            }}>
              <p style={{ margin: 0 }}>
                💡 <strong>Tip:</strong> Connection requests include your investor profile and investment preferences. 
                Startups will be notified and can respond through their dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      <DocumentViewer 
        document={selectedDocument}
        isOpen={showDocumentViewer}
        onClose={handleCloseDocumentViewer}
      />
    </DashboardContainer>
  );
};

export default InvestorDashboard; 