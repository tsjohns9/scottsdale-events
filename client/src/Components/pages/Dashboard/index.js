import './index.css';
import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SideNav from '../../SideNav';
import SideNavContent from './SideNavContent';
import Profile from './Profile';
import CreateCustomer from './CreateCustomer';
import CreateAdmin from './CreateAdmin';
import ViewCustomers from './ViewCustomers';
import API from '../../../api/API';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { unauthorized: false };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  // used to check if a user is authorized at any part of the admin dashboard
  checkAuth = bool => this.setState({ unauthorized: bool });

  decodedToken = () => API.decodeToken();

  render() {
    if (this.state.unauthorized || !this.decodedToken()) {
      return (
        <Redirect
          to={{
            pathname: '/admin',
            state: { msg: 'Your session has expired' }
          }}
        />
      );
    }
    return (
      <Fragment>
        <Switch>
          <SideNav
            SideNavContent={<SideNavContent />}
            mainContent={func => (
              <Fragment>
                <Route
                  exact
                  path="/dashboard"
                  render={props => (
                    <Profile
                      {...props}
                      checkAuth={this.checkAuth}
                      user={this.decodedToken().result}
                      toggleSideBar={func}
                    />
                  )}
                />
                <Route
                  exact
                  path="/dashboard/create/customer"
                  render={props => (
                    <CreateCustomer
                      {...props}
                      checkAuth={this.checkAuth}
                      user={this.decodedToken().result}
                      toggleSideBar={func}
                    />
                  )}
                />
                <Route
                  exact
                  path="/dashboard/create/admin"
                  render={props => (
                    <CreateAdmin
                      {...props}
                      checkAuth={this.checkAuth}
                      user={this.decodedToken().result}
                      toggleSideBar={func}
                    />
                  )}
                />
                <Route
                  exact
                  path="/dashboard/view/customers"
                  render={props => (
                    <ViewCustomers
                      {...props}
                      checkAuth={this.checkAuth}
                      user={this.decodedToken().result}
                      toggleSideBar={func}
                    />
                  )}
                />
              </Fragment>
            )}
          />
        </Switch>
      </Fragment>
    );
  }
}
export default Dashboard;
