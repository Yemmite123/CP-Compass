import React from 'react';
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/investment/actionTypes";
import { getTermedInvestments } from '#/store/investment/actions'
import DashboardBodyMenu from '#/components/DashboardBodyMenu';
import InformationBar from '#/components/InformationBar';
import Recommended from './Recommended';
import TermedInvestments from './TermedInvestments';
import FinancialInstruments from './FinancialInstruments';
import Investment from './Investment';
import SingleInvestment from '#/pages/App/Portfolio/SingleInvestment';
import LiquidateInvestment from '#/pages/App/Portfolio/LiquidateInvestment';
import Collections from './Collections';
import Predefined from './Predefined';
import PPI from './PPI';
import SingleMutualFund from './SingleMutualFund';
import Custom from './Custom';
import './style.scss';

class Marketplace extends React.Component {

  state = {
    showPpiMenu: true
  }

  componentDidMount() {
    this.props.getTermedInvestments();
  }

  handleBvnSetup = () => {
    this.props.history.push('/app/onboarding');
  }

  togglePpiMenu = () => {
    this.setState(prevState => ({ showPpiMenu: !prevState.showPpiMenu }))
  }
  render() {
    const { match: { path }, isBvnActive, isApproved } = this.props;
    const menus = [
      {
        name: 'Recommended',
        path: '/app/marketplace/recommended',
        title: 'Marketplace',
      },
      {
        name: 'Aspire Goals',
        path: '/app/marketplace/termed-investments',
        title: 'Marketplace',
      },
      {
        name: 'Financial Instruments',
        path: '/app/marketplace/financial-instruments',
        title: 'Marketplace',
      },
      {
        name: 'Private Placement/Public Issue',
        path: '/app/marketplace/ppi',
        title: 'Marketplace',
      },
    ]

    return (
      <div className="marketplace-page">
        {isBvnActive && !isApproved &&
          <InformationBar className="mt-3 mb-3 text-white">
            Your account is awaiting approval, you won't be able to perform some actions
          </InformationBar>
        }
        <Switch>
          <Route exact path={path}>
            <Redirect to={{ pathname: `${path}/recommended`, state: { routeName: 'Marketplace' } }} />
          </Route>
          <Route path={`${path}/recommended`}>
            <DashboardBodyMenu menus={menus} />
            <div className="container">
              <p className='py-1 mt-2'>These are investments which have been specifically chosen for you based on your goals.</p>
              <Recommended />
            </div>
          </Route>
          <Route path={`${path}/termed-investments`}>
            <DashboardBodyMenu menus={menus} />
            <div className="container">
              <p className='py-1 mt-2'>{"Reach your set dreams through Aspire goals (8-10% p.a) {Rate of collection investment- rate of predefined investment}"}</p>
              <TermedInvestments />
            </div>
          </Route>
          <Route path={`${path}/financial-instruments`}>
            <DashboardBodyMenu menus={menus} />
            <div className="container">
              <FinancialInstruments />
            </div>
          </Route>
          <Route path={`${path}/ppi`}>
            {this.state.showPpiMenu && <DashboardBodyMenu menus={menus} />}
            <div>
              <PPI togglePpiMenu={this.togglePpiMenu} />
            </div>
          </Route>
          <Route path={`${path}/ppi/:slug`}>
            <DashboardBodyMenu menus={menus} />
            <div>
              <SingleMutualFund />
            </div>
          </Route>
          <Route path={`${path}/termed-investment/:investmentId`}>
            <Investment />
          </Route>
          <Route path={`${path}/predefined/:investmentId`}>
            <Predefined />
          </Route>
          <Route path={`${path}/collection/:investmentId`}>
            <Collections />
          </Route>
          <Route path={`${path}/custom/:investmentId`}>
            <Custom />
          </Route>
          <Route path={`${path}/investment/:investmentId`} >
            <SingleInvestment />
          </Route>
          <Route path={`${path}/liquidate/:investmentId`} >
            <LiquidateInvestment />
          </Route>
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { app: { profile: { userProfile: { data } } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_ALL_INVESTMENTS_REQUEST),
    isBvnActive: data && data.bvn ? true : false,
    isApproved: data && data.isApproved === 1 ? true : false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTermedInvestments: () => dispatch(getTermedInvestments()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Marketplace));
