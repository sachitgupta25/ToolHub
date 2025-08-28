import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../config/googleAuth';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for Google API to be fully loaded
    const waitForGoogleAPI = () => {
      let attempts = 0;
      const maxAttempts = 30; // 15 seconds total
      
      const checkInterval = setInterval(() => {
        attempts++;
        
        // Check if both gapi and gapi.auth2 are available
        if (window.gapi && window.gapi.load) {
          console.log('Google API is available');
          
          // Try to load auth2 to make sure it's working
          try {
            window.gapi.load('auth2', () => {
              console.log('Google Auth2 library ready');
              clearInterval(checkInterval);
            });
          } catch (error) {
            console.error('Error loading auth2:', error);
          }
          return;
        }
        
        if (attempts >= maxAttempts) {
          console.warn('Google API not loaded after 15 seconds');
          clearInterval(checkInterval);
          setError('Google Sign-In is taking too long to load. Please refresh the page.');
        }
      }, 500);
    };

    // Start checking after a short delay
    setTimeout(waitForGoogleAPI, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Replace this with your actual login API call
      // const response = await fetch('https://your-api.com/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Login failed');
      // }
      // 
      // const userData = await response.json();

      // Mock login for demonstration
      setTimeout(() => {
        if (email && password) {
          const userData = {
            id: 1,
            name: email.split('@')[0], // Use part of email as name
            email: email,
            picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=4A90E2&color=fff&size=128`
          };
          onLogin(userData);
          navigate('/tools'); // Redirect to tools page after login
        } else {
          setError('Please enter both email and password');
        }
        setLoading(false);
      }, 1000);

    } catch (error) {
      setError('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleGoogleSSO = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      console.log('Attempting Google Sign-In...');
      
      // Enhanced checks for Google API availability
      if (!window.gapi) {
        throw new Error('Google API is not loaded. Please refresh the page and try again.');
      }

      if (!window.gapi.load) {
        throw new Error('Google API is not fully initialized. Please refresh the page and try again.');
      }

      // Wait a moment to ensure everything is loaded
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userData = await signInWithGoogle();
      console.log('Google Sign-In Success:', userData);
      
      // Validate userData before proceeding
      if (!userData || !userData.email) {
        throw new Error('Invalid user data received from Google');
      }
      
      onLogin(userData);
      navigate('/tools'); // Redirect to tools page after login
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      
      // More specific error messages with safe string handling
      let errorMessage = 'Google sign-in failed. ';
      let errorMsg = '';
      
      // Safely extract error message
      try {
        errorMsg = error?.message || error?.error || error?.toString() || '';
      } catch (e) {
        errorMsg = 'Unknown error occurred';
      }
      
      // Handle specific error cases
      if (errorMsg.includes('popup_closed_by_user')) {
        errorMessage += 'Sign-in popup was closed. Please try again.';
      } else if (errorMsg.includes('access_denied')) {
        errorMessage += 'Access was denied. Please grant necessary permissions.';
      } else if (errorMsg.includes('network')) {
        errorMessage += 'Network error. Please check your connection.';
      } else if (errorMsg.includes('Google API') && (errorMsg.includes('not loaded') || errorMsg.includes('not fully initialized'))) {
        errorMessage = errorMsg;
      } else if (errorMsg.includes('idpiframe_initialization_failed')) {
        errorMessage += 'Authentication service unavailable. Please try: 1) Refresh the page, 2) Disable ad blockers, 3) Enable cookies, or 4) Try incognito mode.';
      } else if (errorMsg.includes('getAuthInstance')) {
        errorMessage += 'Google authentication not properly initialized. Please refresh the page and try again.';
      } else if (errorMsg.includes('Script error')) {
        errorMessage += 'Script loading error. Please refresh the page and try again.';
      } else if (errorMsg) {
        errorMessage += `${errorMsg}`;
      } else {
        errorMessage += 'Please try again or use email/password login.';
      }
      
      setError(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };


  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access all tools</p>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading || googleLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading || googleLoading}
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              className="login-btn-primary" 
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

        

          <button 
            onClick={handleGoogleSSO} 
            className="google-sso-btn"
            disabled={loading || googleLoading}
          >
            <img 
              src="https://developers.google.com/identity/images/g-logo.png" 
              alt="Google"
              width="20"
              height="20"
              margintop="2"
            />
            {googleLoading ? (
              <>
                <span className="loading-spinner" style={{borderTopColor: '#4A90E2'}}></span>
                Signing In...
              </>
            ) : (
              'Continue with Google'
            )}
          </button>

          {/* Fallback button for development/testing */}
          
        </div>

        <div className="login-benefits">
          <h3>Why join ToolHub?</h3>
          <ul>
            <li>✅ Access to 50+ premium tools</li>
            <li>✅ Save your processing history</li>
            <li>✅ Priority support</li>
            <li>✅ No ads or watermarks</li>
            <li>✅ Batch processing capabilities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;