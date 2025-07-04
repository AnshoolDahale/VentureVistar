import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(66, 153, 225, 0.6);
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(66, 153, 225, 0.8);
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 5px rgba(66, 153, 225, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(66, 153, 225, 0.8);
    }
    100% {
      box-shadow: 0 0 5px rgba(66, 153, 225, 0.5);
    }
  }

  /* Utility Classes */
  .fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .slide-in {
    animation: slideIn 0.5s ease-out;
  }

  .scale-in {
    animation: scaleIn 0.4s ease-out;
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  .glow {
    animation: glow 2s infinite;
  }

  /* Glass Morphism Utility */
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .glass-dark {
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  }

  /* Responsive Typography */
  .text-xs { font-size: 0.75rem; }
  .text-sm { font-size: 0.875rem; }
  .text-base { font-size: 1rem; }
  .text-lg { font-size: 1.125rem; }
  .text-xl { font-size: 1.25rem; }
  .text-2xl { font-size: 1.5rem; }
  .text-3xl { font-size: 1.875rem; }
  .text-4xl { font-size: 2.25rem; }
  .text-5xl { font-size: 3rem; }

  /* Responsive Breakpoints */
  @media (max-width: 640px) {
    .text-2xl { font-size: 1.25rem; }
    .text-3xl { font-size: 1.5rem; }
    .text-4xl { font-size: 1.875rem; }
    .text-5xl { font-size: 2.25rem; }
  }

  /* Loading States */
  .loading {
    position: relative;
    overflow: hidden;
  }

  .loading::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  /* Focus States */
  .focus-ring:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }

  /* Hover Effects */
  .hover-scale:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
  }

  .hover-glow:hover {
    box-shadow: 0 0 20px rgba(66, 153, 225, 0.6);
    transition: box-shadow 0.3s ease;
  }

  .hover-lift:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
  }

  /* Button Styles */
  .btn-primary {
    background: linear-gradient(135deg, #4299E1, #667EEA);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(66, 153, 225, 0.4);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #4A5568;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1rem 2rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  /* Card Styles */
  .card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    padding: 2rem;
    transition: all 0.3s ease;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px 0 rgba(31, 38, 135, 0.5);
  }

  /* Form Styles */
  .form-input {
    width: 100%;
    padding: 1rem 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    color: #2D3748;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: #4299E1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    background: rgba(255, 255, 255, 0.15);
  }

  .form-input::placeholder {
    color: #A0AEC0;
  }

  /* Responsive Grid */
  .grid {
    display: grid;
    gap: 2rem;
  }

  .grid-1 { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-4 { grid-template-columns: repeat(4, 1fr); }

  @media (max-width: 1024px) {
    .grid-4 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .grid-4, .grid-3, .grid-2 { 
      grid-template-columns: 1fr; 
      gap: 1rem;
    }
  }

  /* Spacing Utilities */
  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-4 { margin-top: 1rem; }
  .mt-8 { margin-top: 2rem; }
  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mb-8 { margin-bottom: 2rem; }
  .p-2 { padding: 0.5rem; }
  .p-4 { padding: 1rem; }
  .p-8 { padding: 2rem; }

  /* Text Utilities */
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .font-bold { font-weight: 700; }
  .font-semibold { font-weight: 600; }
  .font-medium { font-weight: 500; }

  /* Color Utilities */
  .text-white { color: white; }
  .text-gray-600 { color: #718096; }
  .text-gray-800 { color: #2D3748; }
  .text-blue-500 { color: #4299E1; }
  .text-green-500 { color: #48BB78; }
  .text-red-500 { color: #F56565; }

  /* Flex Utilities */
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: 0.5rem; }
  .gap-4 { gap: 1rem; }
  .gap-8 { gap: 2rem; }

  /* Background Utilities */
  .bg-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .bg-gradient-blue {
    background: linear-gradient(135deg, #4299E1, #667EEA);
  }

  .bg-gradient-green {
    background: linear-gradient(135deg, #48BB78, #38A169);
  }

  .bg-gradient-purple {
    background: linear-gradient(135deg, #9F7AEA, #805AD5);
  }

  /* Shadow Utilities */
  .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
  .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
  .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
  .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
`;

export default GlobalStyles;