// config/googleAuth.js - Robust implementation with script loading

export const GOOGLE_CLIENT_ID = '928471517201-mi1komn1vbtdfjl0kbbpgj2r3cru741s.apps.googleusercontent.com';

// Function to dynamically load Google API if not available
const loadGoogleAPI = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.gapi) {
      console.log('Google API already loaded');
      resolve();
      return;
    }

    console.log('Loading Google API dynamically...');
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google API loaded successfully');
      // Wait a moment for the API to initialize
      setTimeout(() => {
        if (window.gapi) {
          resolve();
        } else {
          reject(new Error('Google API loaded but not available'));
        }
      }, 500);
    };
    
    script.onerror = () => {
      console.error('Failed to load Google API');
      reject(new Error('Failed to load Google API script'));
    };
    
    document.head.appendChild(script);
  });
};

// Function to dynamically load Google Identity Services
const loadGoogleIdentity = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.accounts) {
      console.log('Google Identity Services already loaded');
      resolve();
      return;
    }

    console.log('Loading Google Identity Services dynamically...');
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google Identity Services loaded successfully');
      // Wait a moment for the API to initialize
      setTimeout(() => {
        if (window.google && window.google.accounts) {
          resolve();
        } else {
          reject(new Error('Google Identity Services loaded but not available'));
        }
      }, 1000);
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Identity Services');
      reject(new Error('Failed to load Google Identity Services script'));
    };
    
    document.head.appendChild(script);
  });
};

// Wait for APIs with timeout
const waitForAPI = (checkFunction, apiName, maxWait = 10000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      if (checkFunction()) {
        resolve();
      } else if (Date.now() - startTime > maxWait) {
        reject(new Error(`${apiName} failed to load within ${maxWait}ms`));
      } else {
        setTimeout(check, 100);
      }
    };
    
    check();
  });
};

// Modern Google Sign-In (recommended)
export const signInWithGoogleModern = () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Starting modern Google sign-in...');
      
      // Load Google Identity Services
      await loadGoogleIdentity();
      
      // Wait for it to be fully available
      await waitForAPI(
        () => window.google && window.google.accounts && window.google.accounts.oauth2,
        'Google Identity Services'
      );

      // Initialize OAuth2 client
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'profile email',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error(`OAuth error: ${tokenResponse.error}`));
            return;
          }
          
          try {
            // Get user info using the access token
            const userData = await getUserInfo(tokenResponse.access_token);
            resolve(userData);
          } catch (error) {
            reject(error);
          }
        },
        error_callback: (error) => {
          reject(new Error(`OAuth initialization error: ${error.type || 'unknown'}`));
        }
      });
      
      // Request access token
      client.requestAccessToken({
        prompt: 'consent',
        hint: 'auto'
      });
      
    } catch (error) {
      console.error('Modern sign-in error:', error);
      reject(error);
    }
  });
};

// Legacy Google Sign-In (fallback)
export const signInWithGoogleLegacy = () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Starting legacy Google sign-in...');
      
      // Load Google API
      await loadGoogleAPI();
      
      // Wait for GAPI to be available
      await waitForAPI(() => window.gapi, 'Google API');
      
      // Load auth2 library
      await new Promise((resolveAuth, rejectAuth) => {
        window.gapi.load('auth2', {
          callback: () => {
            console.log('Auth2 library loaded');
            resolveAuth();
          },
          onerror: () => {
            rejectAuth(new Error('Failed to load auth2 library'));
          },
          timeout: 10000,
          ontimeout: () => {
            rejectAuth(new Error('Auth2 library load timeout'));
          }
        });
      });

      // Wait for auth2 to be available
      await waitForAPI(() => window.gapi.auth2, 'Google Auth2');

      // Initialize or get existing auth instance
      let authInstance;
      try {
        authInstance = window.gapi.auth2.getAuthInstance();
        if (!authInstance || !authInstance.isSignedIn) {
          authInstance = await window.gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'profile email'
          });
        }
      } catch (e) {
        authInstance = await window.gapi.auth2.init({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'profile email'
        });
      }

      // Sign in
      const googleUser = await authInstance.signIn({
        prompt: 'select_account'
      });
      
      // Extract user data
      const profile = googleUser.getBasicProfile();
      const userData = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        picture: profile.getImageUrl(),
        token: googleUser.getAuthResponse().id_token,
        accessToken: googleUser.getAuthResponse().access_token
      };
      
      resolve(userData);
      
    } catch (error) {
      console.error('Legacy sign-in error:', error);
      reject(error);
    }
  });
};

// Get user info from Google API
const getUserInfo = async (accessToken) => {
  const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }
  
  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    picture: data.picture,
    accessToken: accessToken
  };
};

// Main sign-in function with automatic fallback
export const signInWithGoogle = async () => {
  console.log('Attempting Google sign-in...');
  
  try {
    // Try modern method first
    return await signInWithGoogleModern();
  } catch (modernError) {
    console.warn('Modern sign-in failed, trying legacy method:', modernError.message);
    
    try {
      // Fallback to legacy method
      return await signInWithGoogleLegacy();
    } catch (legacyError) {
      console.error('Both sign-in methods failed');
      console.error('Modern error:', modernError.message);
      console.error('Legacy error:', legacyError.message);
      
      // Throw a comprehensive error
      throw new Error(`Google sign-in failed. Modern: ${modernError.message}, Legacy: ${legacyError.message}`);
    }
  }
};

// Check API availability
export const checkGoogleAPIStatus = () => {
  return {
    gapiLoaded: !!window.gapi,
    gapiAuth2Available: !!(window.gapi && window.gapi.auth2),
    googleIdentityLoaded: !!(window.google && window.google.accounts),
    googleOAuth2Available: !!(window.google && window.google.accounts && window.google.accounts.oauth2)
  };
};

// Debug function
export const debugGoogleAPI = () => {
  const status = checkGoogleAPIStatus();
  console.log('Google API Debug Status:', status);
  
  console.log('Window objects available:');
  console.log('- window.gapi:', !!window.gapi);
  console.log('- window.google:', !!window.google);
  console.log('- window.google.accounts:', !!(window.google && window.google.accounts));
  
  return status;
};