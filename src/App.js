import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import Home from './Home';
//import axios from 'axios';

const oktaAuth = new OktaAuth({
  issuer: process.env.REACT_APP_ISSUER,
  clientId: process.env.REACT_APP_CLIENTID,
  redirectUri: window.location.origin + '/account-match'
});

class App extends Component {
  constructor(props) {
    super(props);

    this.restoreOriginalUri = async (_oktaAuth, originalUri) => {
      const idToken = await _oktaAuth.tokenManager.get('idToken');
      if (idToken) {
        const decodedIdToken = JSON.parse(atob(idToken.idToken.split('.')[1]));
        console.log(decodedIdToken.email);
        sessionStorage.setItem("loginUserEmail", decodedIdToken.email);
      }

      let pathname = window.location.pathname;
      let redirect_after_login = sessionStorage.getItem("redirect_after_login") || '';
      if (redirect_after_login !== '') {
        if (pathname === '/account-match/') {
          window.location.href = pathname + redirect_after_login;
        } else {
          window.location.href = pathname + '/' + redirect_after_login;
        }
      } else {
        props.history.replace(toRelativeUrl(originalUri || '/account-match', window.location.origin));
      }
    };

    // Bind handleAuthStateChange to the instance
    this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
  }

  componentDidMount() {
    // Add event listener for authentication state changes
    oktaAuth.authStateManager.subscribe(this.handleAuthStateChange);
    // Start refreshing the token every minute if the user is authenticated
    this.startTokenRefresh();
  }
  startTokenRefresh() {

    this.tokenRefreshCount = 0; // Initialize the counter

    this.tokenRefreshInterval = setInterval(async () => {
        const authState = oktaAuth.authStateManager.getAuthState();
        if (authState?.isAuthenticated) {
            try {
                const token = await oktaAuth.tokenManager.get('accessToken');
                if (token) {
                    this.tokenRefreshCount++; // Increment the counter
                    console.log(`Token refreshed ${this.tokenRefreshCount} time(s)`);
                    await this.getBearerToken(token.accessToken);
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
            }
        }
    }, 1800000); // 30 minute in milliseconds
}

  componentWillUnmount() {
    // Clean up the subscription when the component unmounts
    oktaAuth.authStateManager.unsubscribe(this.handleAuthStateChange);
  }

  // Get bearer token from API
  async getBearerToken(AuthToken) {    
   
    //url for token creation
    const url=process.env.REACT_APP_AUTH_TOKEN_URL;    
  
    const loginData = {
      loginUserToken: AuthToken, 
    };

try {      
        const res = await fetch(url, {
                method: 'POST',
                 headers: { "Content-Type": "application/json",
                  },
                body:JSON.stringify(loginData),
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            const bearerToken = data.access_token;
            console.log("token: "+bearerToken); 
            sessionStorage.setItem("authToken", bearerToken);
     
        } catch (error) {
          console.log(error);
        }
  }

  async handleAuthStateChange(authState) {
    if (authState.isAuthenticated) {
      console.log('User is authenticated');
      try {
        const idToken = await oktaAuth.tokenManager.get('idToken');
        const token = await oktaAuth.tokenManager.get('accessToken');
        if (idToken) {
          const decodedIdToken = JSON.parse(atob(idToken.idToken.split('.')[1]));
          sessionStorage.setItem("loginUserEmail", decodedIdToken.email);
        }
        if(token){          
          //console.log("auth token from default :: "+token.accessToken);
          // Call getBearerToken() when the user is authenticated
          await this.getBearerToken(token.accessToken);
        }
        
      } catch (error) {
        console.error('Error handling authentication state change:', error);
      }
    } else {
      console.log('User is not authenticated');
    }
  }

  render() {
    return (
      <Security oktaAuth={oktaAuth} restoreOriginalUri={this.restoreOriginalUri}>
        <Route path="/account-match" component={LoginCallback} />
        <Route path="/account-match" exact={true} component={Home} />
      </Security>
    );
  }
}

const AppWithRouterAccess = withRouter(App);

class RouterApp extends Component {
  render() {
    return (<Router><AppWithRouterAccess /></Router>);
  }
}

export default RouterApp;
