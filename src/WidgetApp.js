
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import logo from './image/servicenow-header-logo.png';


import React, { useState, useEffect } from 'react';

import MatchAccountForm from './components/match-account/match-account';
import 'react-tagsinput/react-tagsinput.css';
import SmartLink from './smartLink';

function App({ okta }) {

  let API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [loginUserName, setLoginUserName] = useState('');

  useEffect(() => {
    // Fetch loginUserEmail from session storage
    const email = sessionStorage.getItem('loginUserEmail');

    // Check if email exists and process it
    if (email) {
      const userName = email.split('@')[0]; // Remove the domain part after '@'
      const formattedName = userName
        .split('.')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize the first letter
        .join(' '); // Join with a space

      setLoginUserName(formattedName); // Set the formatted name
    } else {
      setLoginUserName('Guest'); // Default to 'Guest' if no email is found
    }
  }, []);

  const logout = async () => {
    sessionStorage.removeItem("loginUserEmail");
    sessionStorage.removeItem("search_email");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("redirect_after_login");


    try {
      setTimeout(async () => {
        await okta?.signOut({ postLogoutRedirectUri: window.location.origin + '/account-match' });
      }, 300);

    } catch (error) {
      console.error("Error during signOut:", error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='d-flex'>
          <div>
            <img src={logo} className="logo header_logo" alt="servicenow" style={{ "marginBottom": "5px" }} />
          </div>
          <div className='logo_line'>|</div>
          <div className='header_widget_container'>
            <div>
              Account Match
            </div>
          </div>
        </div>

        <div className='menu_container'>
          <div className="boxhead KB">
            {/* <SmartLink to="https://my.servicenow.com/esc?id=surf_kb_article&sys_id=fe449257971ad6d4f831d004a253afd4" className="hover-link">
               <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <g>
                  <circle cx="11.5" cy="12.5" r="11" />
                  <path d="M8.5 10c0-1.656 1.343-3 3-3 1.656 0 3 1.344 3 3 0 1.658-1.344 3-3 3v3" />
                  <path d="M12 18.5c0 .276-.224.5-.5.5s-.5-.224-.5-.5.224-.5.5-.5.5.224.5.5z" />
                </g>
              </svg>
            </SmartLink> */}

          </div>
          <div className='d-flex'>


            <div className="dropdown dropdown-hover" style={{ marginRight: '100px' }}>
              <a
                className="dropdown-toggle"
                style={{ 'color': '#f3f3f3' }}
                role="button"
                aria-expanded="false">
                {loginUserName}
              </a>
              <ul className="dropdown-menu">
                <li style={{ 'cursor': 'pointer' }} onClick={logout}><a className="logout">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <MatchAccountForm />


    </div>
  );
}

export default App;
