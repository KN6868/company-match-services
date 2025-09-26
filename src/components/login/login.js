import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { Security, LoginCallback } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';


class OktaApp extends Component {
  constructor(props) {
    super(props);
    this.oktaAuth = new OktaAuth({
      issuer:process.env.REACT_APP_ISSUER,
      clientId:process.env.REACT_APP_CLIENTID,
      redirectUri: window.location.origin + '/login/callback'
    });

   

    this.restoreOriginalUri = async (_oktaAuth, originalUri) => {
      props.history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
    };
  }

  render() {
    return (
      <Security oktaAuth={this.oktaAuth} restoreOriginalUri={this.restoreOriginalUri} >
       <Route path='/login/callback' component={LoginCallback} />
      </Security>
    );
  }
}

const OktaLogin = withRouter(OktaApp);
class Login extends Component {
  render() {
    return (<Router><OktaLogin/></Router>);
  }
}







/*const Login = ({loginSuccess}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  let API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleLogin = async () => {
    setErrorMsg('');
    if(username == ''){
      setErrorMsg("User name can not be blank");
      return;
    }
    if(password == ''){
      setErrorMsg("Password can not be blank");
      return;
    }
    try {
       let userData = {
        emailId:username,
        passWord:password
       };
      fetch(API_BASE_URL+'/contact/validate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }).then((response) => response.json())
      .then((data) => {
            if (data.status === 'UNAUTHORIZED') {
              setErrorMsg(data.statusDescription);
            } else if (data.statusCode == "200") {
              sessionStorage.setItem('login',true);
              loginSuccess(true);
            }
        }).catch((error) => {
          // sessionStorage.setItem('login',true);
          // loginSuccess(true);
        });
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className='login_container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <head>Login</head>
      <label className='login_lbl' htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        className="form-control"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className='login_lbl' htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        id='btnLogin'
        on
        onClick={handleLogin}
      >
        Login
      </button>
      <span className='loginErrorMsg'>
      {errorMsg}
      </span>
    </div>
  );
};*/

export default Login;
