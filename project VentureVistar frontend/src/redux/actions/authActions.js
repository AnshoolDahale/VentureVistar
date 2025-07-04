import { Api } from '../../utils/Api';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGOUT,
} from '../constants/authConstants';

export const login = (email, password, userType) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const { statusCode, data, error } = await Api.postRequest('/api/auth/login', {
      email,
      password,
      userType,
    });
    if (statusCode === 200 && !error) {
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
    } else {
      dispatch({ type: USER_LOGIN_FAIL, payload: error || data?.message || 'Login failed' });
    }
  } catch (error) {
    dispatch({ type: USER_LOGIN_FAIL, payload: error.message });
  }
};

export const register = (name, email, password, userType) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const { statusCode, data, error } = await Api.postRequest('/api/auth/register', {
      name,
      email,
      password,
      userType,
    });
    if (statusCode === 201 && !error) {
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
    } else {
      dispatch({ type: USER_REGISTER_FAIL, payload: error || data?.message || 'Registration failed' });
    }
  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, payload: error.message });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
}; 