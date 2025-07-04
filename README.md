

## 🌟 Overview

VentureVistar is a comprehensive platform designed to connect startups with potential investors. It provides a seamless experience for both startups seeking funding and investors looking for promising opportunities. The platform features advanced matching algorithms, real-time communication, document management, and analytics dashboards.

## ✨ Features

### For Startups
- **Profile Creation**: Detailed startup profiles with logo, tagline, industry, and team information
- **Fundraising Campaigns**: Create and manage fundraising campaigns with funding goals
- **Document Management**: Upload and share pitch decks, business plans, and financial documents
- **Investor Matching**: AI-powered investor recommendations based on industry and funding stage
- **Meeting Scheduler**: Schedule and manage meetings with potential investors
- **Progress Tracking**: Track milestones and campaign progress
- **Communication Hub**: Direct messaging with investors

### For Investors
- **Advanced Search**: Filter startups by industry, stage, location, and funding amount
- **Portfolio Management**: Track investments and portfolio performance
- **Due Diligence Tools**: Access to startup documents and financial data
- **Meeting Management**: Schedule and track meetings with startups
- **Analytics Dashboard**: Investment analytics and performance metrics
- **Watchlist**: Save and track interesting startups
- **Notification System**: Real-time updates on new opportunities

### Platform Features
- **Authentication System**: Secure login/signup with user type selection
- **Responsive Design**: Mobile-friendly interface with modern UI
- **Real-time Updates**: Live notifications and updates
- **Document Viewer**: In-app document viewing capabilities
- **Charts & Analytics**: Interactive charts for data visualization
- **Search Functionality**: Advanced search with filters
- **Admin Panel**: Platform management and user administration

## 🛠 Tech Stack

### Frontend
- **React 17.0.1** - JavaScript library for building user interfaces
- **Redux 4.0.5** - State management with Redux Thunk for async actions
- **React Router 5.2.0** - Client-side routing
- **Styled Components 5.3.11** - CSS-in-JS styling
- **Framer Motion 4.1.17** - Animation library
- **Recharts 2.8.0** - Chart visualization
- **React Icons 4.12.0** - Icon library
- **Axios 0.21.0** - HTTP client

### Backend
- **Node.js** - JavaScript runtime environment
- **Express 4.17.1** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 5.11.8** - MongoDB object modeling
- **JWT (jsonwebtoken 8.5.1)** - Authentication tokens
- **bcrypt 5.0.1** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 8.2.0** - Environment variable management

## 📁 Project Structure

```
project-venturevistar/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/                 # AI-related components
│   │   │   ├── analytics/          # Analytics components
│   │   │   ├── animations/         # Animation components
│   │   │   ├── charts/             # Chart components
│   │   │   ├── communication/      # Communication components
│   │   │   ├── landing/            # Landing page components
│   │   │   ├── search/             # Search components
│   │   │   ├── ui/                 # UI components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── Product.js
│   │   │   ├── CartItem.js
│   │   │   ├── SideDrawer.js
│   │   │   ├── Backdrop.js
│   │   │   └── DocumentViewer.js
│   │   ├── screens/
│   │   │   ├── SignIn/
│   │   │   ├── SignUp/
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── DashboardMain.js
│   │   │   ├── DashboardNavbar.js
│   │   │   ├── DashboardSidebar.js
│   │   │   ├── EnhancedDashboard.js
│   │   │   ├── InvestorDashboard.js
│   │   │   ├── HomeScreen.js
│   │   │   ├── ProductScreen.js
│   │   │   └── CartScreen.js
│   │   ├── redux/
│   │   │   ├── actions/
│   │   │   │   ├── authActions.js
│   │   │   │   ├── cartActions.js
│   │   │   │   ├── productActions.js
│   │   │   │   └── userAction.js
│   │   │   ├── constants/
│   │   │   ├── reducers/
│   │   │   │   ├── authReducer.js
│   │   │   │   ├── cartReducers.js
│   │   │   │   └── productReducers.js
│   │   │   └── store.js
│   │   ├── utils/
│   │   │   ├── hooks/
│   │   │   │   └── useLogin.js
│   │   │   ├── Api.js
│   │   │   ├── config.js
│   │   │   ├── localstorage.js
│   │   │   └── utils.function.js
│   │   ├── styles/
│   │   │   └── GlobalStyles.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   ├── package.json
│   └── .env.example
└── backend/
    ├── backend/
    │   ├── config/
    │   │   └── db.js
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── StartupProfile.js
    │   │   ├── investorModel.js
    │   │   ├── Product.js
    │   │   ├── FundraisingCampaign.js
    │   │   ├── Meeting.js
    │   │   ├── Document.js
    │   │   └── Milestone.js
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── startup.js
    │   │   ├── investor.js
    │   │   ├── investorRoutes.js
    │   │   ├── connectionRoutes.js
    │   │   ├── startupRoutes.js
    │   │   ├── announcement.js
    │   │   ├── userRoutes.js
    │   │   ├── productRoutes.js
    │   │   └── cartRoutes.js
    │   ├── utils/
    │   │   ├── generateToken.js
    │   │   └── utility.function.js
    │   ├── server.js
    │   └── seederScript.js
    ├── package.json
    └── .env (create this file)
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-venturevistar
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/venturevistar
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=30d
   ```

5. **Start MongoDB service**
   ```bash
   # On macOS (using Homebrew)
   brew services start mongodb-community
   
   # On Ubuntu
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

6. **Run the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**
   ```env
   REACT_APP_API_BASE_URL=http://localhost:3001
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Environment Setup

### Backend Environment Variables
```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/venturevistar

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=30d

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload Configuration (Optional)
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png,gif,txt
```

### Frontend Environment Variables
```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001

# Google OAuth (Optional)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

# Analytics (Optional)
REACT_APP_GA_TRACKING_ID=your-google-analytics-id
```

## 📖 Usage

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Production Mode

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend in production mode**
   ```bash
   cd backend
   npm start
   ```

### User Types & Authentication

The platform supports two user types:

#### Startup Users
- Register as a startup
- Create detailed company profiles
- Upload pitch decks and documents
- Connect with investors
- Track fundraising progress

#### Investor Users
- Register as an investor
- Browse and filter startups
- Manage investment portfolio
- Schedule meetings with startups
- Access analytics and reports

### Key Features Usage

#### Authentication Flow
1. Visit the landing page
2. Click "Get Started" to navigate to login
3. Toggle between "Startup" and "Investor" user types
4. Register or login with credentials
5. Complete profile setup post-registration

#### Dashboard Features
- **Startup Dashboard**: Profile management, fundraising campaigns, investor connections
- **Investor Dashboard**: Startup discovery, portfolio tracking, meeting management

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user (startup or investor)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "startup" // or "investor"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "startup"
  }
}
```

#### POST /api/auth/login
Login existing user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "userType": "startup"
}
```

### Startup Endpoints

#### GET /api/startup/profile
Get startup profile information

#### PUT /api/startup/profile
Update startup profile

#### POST /api/startup/documents
Upload startup documents

### Investor Endpoints

#### GET /api/investor/profile
Get investor profile information

#### GET /api/investor/recommendations
Get startup recommendations for investor

#### POST /api/investor/meetings
Schedule meeting with startup

### Connection Endpoints

#### POST /api/connections/request
Send connection request

#### GET /api/connections/requests
Get pending connection requests

#### PUT /api/connections/respond
Respond to connection request

## 🗄 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  userType: String (enum: ['startup', 'investor']),
  createdAt: Date,
  updatedAt: Date
}
```

### Startup Profile Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  logo: String,
  tagline: String,
  industry: String,
  stage: String,
  team: [String],
  location: String,
  website: String,
  whatsapp: String,
  email: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Investor Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  name: String,
  profilePic: String,
  bio: String,
  industries: [String],
  stages: [String],
  minTicket: Number,
  maxTicket: Number,
  portfolio: [Object],
  savedStartups: [ObjectId],
  preferences: Object,
  meetings: [Object],
  documents: [Object],
  stats: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Features Roadmap

### Phase 1 (Current)
- [x] User authentication and authorization
- [x] Startup and investor profiles
- [x] Basic matching system
- [x] Document upload and management
- [x] Dashboard interfaces

### Phase 2 (In Progress)
- [ ] Advanced search and filtering
- [ ] Real-time messaging system
- [ ] Meeting scheduler integration
- [ ] Email notifications
- [ ] Mobile app development

### Phase 3 (Planned)
- [ ] AI-powered matching algorithms
- [ ] Video conferencing integration
- [ ] Payment processing
- [ ] Advanced analytics and reporting
- [ ] Multi-language support

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **File Upload Security**: File type and size validation
- **Environment Variables**: Sensitive data stored in environment variables

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

## 📦 Deployment

### Frontend Deployment (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy the build folder
```

### Backend Deployment (Heroku/AWS)
```bash
cd backend
# Set up environment variables
# Deploy to your preferred platform
```

### Database Deployment
- MongoDB Atlas (recommended for production)
- Self-hosted MongoDB instance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use meaningful commit messages
- Add proper documentation
- Write unit tests for new features
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Anshool Dahale** - Initial work and backend development , Frontend and full-stack development
  

## 🙏 Acknowledgments

- React community for excellent documentation
- Node.js ecosystem for robust backend tools
- MongoDB for flexible data storage
- All contributors and testers

## 📞 Support 8328004134

For support, email anshooldahale08@gmail.com 



---

<div align="center">
  <p>Made with ❤️ by the VentureVistar Team</p>
</div>
