import React from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import LandingPage from './screens/LandingPage';
import LoginPage from './screens/LoginPage';
import SignupPage from './screens/SignupPage';
import Dashboard from './screens/Dashboard';
import Footer from './components/Footer';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="app-container">
      <main className="main-content">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </main>
      {!isLandingPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
