import React from 'react';
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";

import DashboardBodyMenu from '#/components/DashboardBodyMenu';
import Tickets from './Tickets';
import SingleTicket from './SingleTicket';
import UserGuide from './UserGuide';
import FAQ from './FAQ';
import './style.scss';

class Support extends React.Component {

  render() {
    const { match: { path } } = this.props;
    const menus = [
      {
        name: 'Tickets',
        path: '/app/support/tickets',
        title: 'Support',
      },
      {
        name: 'User Guide',
        path: '/app/support/user-guide',
        title: 'Support',
      },
      {
        name: 'FAQs',
        path: '/app/support/faqs',
        title: 'Support',
      },
    ]
    return (
      <div className="support-page">
        <Switch>
          <Route exact path={path}>
            <Redirect to={{ pathname:`${path}/tickets`, state: { routeName: 'Support' }}} />
          </Route>
          <Route path={`${path}/tickets`}>
            <DashboardBodyMenu menus={menus} />
            <div className="container">
              <Tickets />
            </div>
          </Route>
          <Route path={`${path}/user-guide`}>
            <DashboardBodyMenu menus={menus} />
            <div className="container">
              <UserGuide />
            </div>
          </Route>
          <Route path={`${path}/faqs`}>
            <DashboardBodyMenu menus={menus} />
            <div className="container">
              <FAQ />
            </div>
          </Route>
          <Route path={`${path}/ticket/:ticketId`}>
          <SingleTicket />
          </Route>
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { app: { profile: { userProfile: { data } } } } = state;
  return {
    data,
  };
};

export default withRouter(connect(mapStateToProps)(Support));
