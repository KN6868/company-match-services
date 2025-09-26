import React, { Component } from 'react';
import { withOktaAuth } from '@okta/okta-react';
import './App.css';
import WidgetApp from './WidgetApp'
import logo from './image/servicenow-header-logo.png';


document.addEventListener('DOMContentLoaded', function () {
  let searchParam = new URLSearchParams(window.location.search);
  let email = searchParam.get("email") || '';
  if (email && email.length) {
    sessionStorage.setItem("search_email", searchParam.get("email") || '');
    window.history.replaceState(null, null, window.location.origin + window.location.pathname);
  }
}, false)
export default withOktaAuth(class Home extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    console.log(process.env.REACT_APP_API_BASE_URL);
    
    if (!this.props.authState?.isAuthenticated) {
      sessionStorage.removeItem("loginUserEmail");
      sessionStorage.removeItem("authToken");
    }
  }

  async login(event) {
    event.preventDefault();

    await this.props.oktaAuth.signInWithRedirect();

  }

  async logout() {
    sessionStorage.removeItem("loginUserEmail");
    sessionStorage.removeItem("search_email");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("redirect_after_login");
    await this.props.oktaAuth.signOut({ postLogoutRedirectUri: window.location.origin + '/account-match' });
  }

  render() {
    let body = null;
    if (this.props.authState?.isAuthenticated) {
      body = (
        <WidgetApp okta={this.props.oktaAuth} />
      );
    } else {
      body = (
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
            
          </header>
          {/* <p align="center" >
                <b> Welcome to ServiceNow Widget App Portal. </b>
                <img src={beta} style={{"width":"42px"}} className="beta contact app" alt="servicenow beta" />
              </p> */}
              
          <div className="Buttons home_login_main_container">
            Click here to login <button className="btn_login" onClick={this.login}>Login</button>

          </div>
        </div>
      );
    }

    return (
      <div className="App">
        

        {body}
        

        <footer>
          <div className='footer_container'>
            <div>
              <div className='powered_by_mdm_text'>Powered by MDM</div>
            </div>
            <div>© 2025 ServiceNow Inc. All rights reserved.</div>
          </div>
        </footer>
      </div>
    );
  }
});