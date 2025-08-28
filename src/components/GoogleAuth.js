// components/GoogleAuth.js - Component with debug information

import React, { useState, useEffect } from 'react';
import { 
  signInWithGoogle, 
  signInWithGoogleModern, 
  signInWithGoogleLegacy,
  checkGoogleAPIStatus,
  debugGoogleAPI 
} from '../config/googleAuth';

const GoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Check API status periodically
    const checkStatus = () => {
      const status = checkGoogleAPIStatus();
      setApiStatus(status);
      console.log('API Status:', status);
    };

    // Initial check
    checkStatus();
    
    // Check every 2 seconds for the first 10 seconds
    const interval = setInterval(checkStatus, 2000);
    
    // Stop checking after 10 seconds
    setTimeout(() => {
      clearInterval(interval);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSignIn = async (method = 'auto') => {
    setLoading(true);
    setError(null);
    
    // Debug API status before sign-in
    console.log('=== Sign-in Debug Info ===');
    debugGoogleAPI();
    console.log('========================');

    try {
      let userData;
      
      switch (method) {
        case 'modern':
          userData = await signInWithGoogleModern();
          break;
        case 'legacy':
          userData = await signInWithGoogleLegacy();
          break;
        case 'auto':
        default:
          userData = await signInWithGoogle();
          break;
      }
      
      setUser(userData);
      console.log('Sign-in successful:', userData);
      
    } catch (error) {
      console.error('Sign-in failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setError(null);
    console.log('User signed out');
  };

  const handleDebug = () => {
    debugGoogleAPI();
    setShowDebug(!showDebug);
  };

  const getStatusColor = (status) => {
    if (status === true) return '#4caf50'; // green
    if (status === false) return '#f44336'; // red
    return '#ff9800'; // orange
  };

  const getStatusText = (status) => {
    if (status === true) return '✓ Loaded';
    if (status === false) return '✗ Not Loaded';
    return '? Unknown';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Google Authentication</h2>
      
      {/* API Status Display */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>API Status:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', alignItems: 'center' }}>
          <span>Google API (gapi):</span>
          <span style={{ color: getStatusColor(apiStatus?.gapiLoaded) }}>
            {getStatusText(apiStatus?.gapiLoaded)}
          </span>
          
          <span>Google Auth2:</span>
          <span style={{ color: getStatusColor(apiStatus?.gapiAuth2Available) }}>
            {getStatusText(apiStatus?.gapiAuth2Available)}
          </span>
          
          <span>Google Identity:</span>
          <span style={{ color: getStatusColor(apiStatus?.googleIdentityLoaded) }}>
            {getStatusText(apiStatus?.googleIdentityLoaded)}
          </span>
          
          <span>OAuth2 Client:</span>
          <span style={{ color: getStatusColor(apiStatus?.googleOAuth2Available) }}>
            {getStatusText(apiStatus?.googleOAuth2Available)}
          </span>
        </div>
        
        <button 
          onClick={handleDebug}
          style={{
            marginTop: '10px',
            padding: '5px 10px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'} (Check Console)
        </button>
      </div>

      {/* Debug Information */}
      {showDebug && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7',
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '20px',
          fontSize: '12px'
        }}>
          <h4>Debug Information:</h4>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(apiStatus, null, 2)}
          </pre>
          <p style={{ margin: '10px 0 0 0' }}>
            Check browser console for detailed debug information.
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffebee', 
          padding: '15px', 
          borderRadius: '5px', 
          marginBottom: '20px',
          border: '1px solid #ffcdd2'
        }}>
          <strong>Error:</strong> {error}
          
          {error.includes('Google API') && (
            <div style={{ marginTop: '10px' }}>
              <strong>Possible solutions:</strong>
              <ul>
                <li>Check your internet connection</li>
                <li>Disable ad blockers temporarily</li>
                <li>Refresh the page</li>
                <li>Try incognito mode</li>
                <li>Check if the Google API script is blocked</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* User Display or Sign-In Buttons */}
      {user ? (
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '20px', 
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <img 
            src={user.picture} 
            alt={user.name} 
            style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%',
              marginBottom: '10px'
            }}
          />
          <h3>Welcome, {user.name}!</h3>
          <p>Email: {user.email}</p>
          <button 
            onClick={handleSignOut}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h4>Sign-In Options:</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleSignIn('auto')} 
                disabled={loading}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  flex: 1,
                  minWidth: '120px'
                }}
              >
                {loading ? 'Signing in...' : 'Auto (Recommended)'}
              </button>
              
              <button 
                onClick={() => handleSignIn('modern')} 
                disabled={loading || !apiStatus?.googleIdentityLoaded}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#34a853',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: (loading || !apiStatus?.googleIdentityLoaded) ? 'not-allowed' : 'pointer',
                  opacity: (loading || !apiStatus?.googleIdentityLoaded) ? 0.6 : 1,
                  flex: 1,
                  minWidth: '120px'
                }}
              >
                Modern Method
              </button>
              
              <button 
                onClick={() => handleSignIn('legacy')} 
                disabled={loading || !apiStatus?.gapiLoaded}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#ea4335',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: (loading || !apiStatus?.gapiLoaded) ? 'not-allowed' : 'pointer',
                  opacity: (loading || !apiStatus?.gapiLoaded) ? 0.6 : 1,
                  flex: 1,
                  minWidth: '120px'
                }}
              >
                Legacy Method
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '15px', 
            borderRadius: '5px',
            fontSize: '14px'
          }}>
            <h4 style={{ margin: '0 0 10px 0' }}>If APIs are not loading:</h4>
            <ol style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Check your internet connection</li>
              <li>Disable ad blockers (they might block Google APIs)</li>
              <li>Refresh the page and wait for APIs to load</li>
              <li>Try incognito mode</li>
              <li>Check browser console for specific errors</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAuth;