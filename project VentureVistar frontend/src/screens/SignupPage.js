import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/actions/authActions';

const SignupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const SignupBox = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #2a2a2a;
  margin-bottom: 2rem;
  font-family: 'Montserrat', sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #00b4d8;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem;
  background: #00b4d8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #666;
  
  span {
    color: #00b4d8;
    cursor: pointer;
    text-decoration: underline;
  }
`;

const SignupPage = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: location.state?.userType || 'startup'
  });

  const auth = useSelector((state) => state.auth);
  const { loading, error, userInfo } = auth;

  useEffect(() => {
    if (userInfo) {
      // Redirect to dashboard after signup
      history.push('/dashboard');
    }
  }, [userInfo, history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    dispatch(register(formData.name, formData.email, formData.password, formData.userType));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <SignupContainer>
      <SignupBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Sign up as {formData.userType}</Title>
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <Form onSubmit={handleSubmit} autoComplete="on">
          <Input
            type="text"
            name="name"
            placeholder={formData.userType === 'startup' ? 'Startup Name' : 'Full Name'}
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </SubmitButton>
        </Form>
        <LoginLink>
          Already have an account?{' '}
          <span onClick={() => history.push('/login')}>
            Login
          </span>
        </LoginLink>
      </SignupBox>
    </SignupContainer>
  );
};

export default SignupPage; 