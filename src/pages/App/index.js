import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Redirect, Switch } from "react-router-dom";
import Drift from "react-driftjs";
import CONFIG from "#/config";
import { logout } from "#/store/user/actions";
import {
  getUserProfile,
  getSegmentQuestions,
  getRiskQuestions,
} from "#/store/profile/actions";
import { getWalletDetails } from "#/store/wallet/actions";
import { getSystemCinfig } from "#/store/config/actions";
import {
  getAllNotifications,
  connectToSocket,
} from "#/store/notifications/actions";
import { getDashboardInfo } from "#/store/dashboard/actions";
import Onboarding from "./Onboarding";
import DashboardMenu from "#/components/DashboardMenu";
import DashboardNav from "#/components/DashboardNav";
import BankTransferModal from "#/components/BankTransferModal";
import FloatingToastAlert from "#/components/FloatingToastAlert";
import Home from "./Home";
import Marketplace from "./Marketplace";
import Portfolio from "./Portfolio";
import Profile from "./Profile";
import Support from "./Support";
import Wallet from "./Wallet";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import InformationBar from "#/components/InformationBar";
import Transactions from "./Transactions";
import Cards from "./Cards";
import Segments from "./Segments";
import Risks from "./Risks";
import Calculator from "./Calculator";
import Insights from "./Insights";
import SingleInsight from "./SingleInsight";
import InsightCategory from "./InsightCategory";
import TrendingInsights from "./TrendingInsights";
import LatestInsights from "./LatestInsights";
import "./style.scss";
import user from "#/store/user";

class App extends Component {
  state = {
    openMenu: false,
  };

  componentDidMount() {
    this.props.connectToSocket();
    this.props.getUserProfile();
    this.props.getWalletDetails();
    this.props.getSegmentQuestions();
    this.props.getRiskQuestions();
    this.props.getSystemCinfig();
    this.props.getDashboardInfo();
    this.props.getAllNotifications(20, 1);
    console.log(this.props.userProfile.data);
  }

  handleLogout = () => {
    this.props.logout();
  };

  handleNavigateToProfile = () => {
    this.props.history.push("/app/profile");
  };

  handleNavigateToWallet = () => {
    this.props.history.push("/app/wallet");
  };

  handleToggleMenu = () => {
    this.setState({ openMenu: !this.state.openMenu });
  };
  handleCompleteAccount = () => {
    this.props.history.push("/app/onboarding/start");
  };
  render() {
    const {
      match,
      location,
      authorized,
      isBvnActive,
      showTransferModal,
      isStaff,
      userProfile,
      alert,
      notifications,
      notificationsMeta,
    } = this.props;
    const { path } = match;
    const headerTitle = location.state?.routeName;

    const { openMenu } = this.state;
    const isApproved = userProfile?.data?.isApproved === 1 ? true : false;
    const isBvn = userProfile?.data?.bvn > 0 ? true : false;
    if (!authorized || isStaff) return <Redirect to="/login" />;

    return (
      <div>
        {showTransferModal && (
          <BankTransferModal
            details={userProfile && userProfile.data?.nuban}
            confirmPayment={this.handleNavigateToWallet}
          />
        )}
        <Switch>
          <>
            <Route exact path={path}>
              <Redirect to={`${path}/home`} />
            </Route>
            <Route path={`${path}/onboarding`}>
              {isBvnActive ? <Redirect to={`${path}/home`} /> : <Onboarding />}
            </Route>
            <div className="dashboard">
              {alert && <FloatingToastAlert alert={alert} />}
              {!this.props.history.location.pathname
                .split("/")
                .includes("onboarding") && (
                  <DashboardMenu
                    openMenu={openMenu}
                    handleToggleMenu={this.handleToggleMenu}
                  />
                )}
              {!this.props.history.location.pathname
                .split("/")
                .includes("onboarding") && (
                  <>
                    <div className="dashboard-main">
                      <span
                        className={` ${openMenu ? "d-block" : "d-none"}`}
                        onClick={this.handleToggleMenu}
                      ></span>
                      <DashboardNav
                        user={userProfile}
                        headerTitle={headerTitle ? headerTitle : "Dashboard"}
                        logoutHandler={this.handleLogout}
                        profileHandler={this.handleNavigateToProfile}
                        toggleMenu={this.handleToggleMenu}
                        notifications={notifications}
                        notificationsMeta={notificationsMeta}
                      />
                      <div className="dashboard-body h-85">
                        {isBvn && !isApproved ? (
                          <InformationBar className="mt-3 mb-3 text-white">
                            Your account is awaiting approval, you won't be able
                            to perform some actions.
                          </InformationBar>
                        ) : !isBvn && !isApproved ? (
                          <InformationBar className="mt-3 mb-3 text-white">
                            <span
                              className="complete-account-setup"
                              onClick={this.handleCompleteAccount}
                            >
                              Complete your account setup:
                            </span>{" "}
                            You need to complete your account setup to start
                            investing!
                          </InformationBar>
                        ) : null}

                        {this.props.userProfile?.data && (
                          <Drift
                            appId={CONFIG.DRIFT_ID}
                            userId={
                              this.props.userProfile?.data &&
                              this.props.userProfile?.data.id
                            }
                            attributes={{
                              email: this.props.userProfile?.data?.email,
                              company: "CP Compass",
                              name: `${this.props.userProfile?.data?.firstName} ${this.props.userProfile?.data?.lastName}`,
                            }}
                          />
                        )}
                        <div className="h-100">
                          <Switch>
                            <>
                              <Route path={`${path}/home`}>
                                <Home />
                              </Route>
                              <Route path={`${path}/marketplace`}>
                                <Marketplace />
                              </Route>
                              <Route path={`${path}/portfolio`}>
                                <Portfolio />
                              </Route>
                              <Route path={`${path}/profile`}>
                                <Profile />
                              </Route>
                              <Route path={`${path}/support`}>
                                <Support />
                              </Route>
                              <Route exact path={`${path}/wallet`}>
                                <Wallet />
                              </Route>
                              <Route path={`${path}/wallet/deposit`}>
                                <Deposit />
                              </Route>
                              <Route path={`${path}/wallet/withdraw`}>
                                <Withdraw />
                              </Route>
                              <Route path={`${path}/wallet/transactions`}>
                                <Transactions />
                              </Route>
                              <Route path={`${path}/wallet/cards`}>
                                <Cards />
                              </Route>
                              <Route path={`${path}/profile/segments`}>
                                <Segments />
                              </Route>
                              <Route path={`${path}/profile/risks`}>
                                <Risks />
                              </Route>
                              <Route path={`${path}/calculator`}>
                                <Calculator />
                              </Route>
                              <Route exact path={`${path}/blogs`}>
                                <Insights />
                              </Route>
                              <Route exact path={`${path}/blogs/blog/:slug`}>
                                <SingleInsight />
                              </Route>
                              <Route path={`${path}/blogs/trending`}>
                                <TrendingInsights />
                              </Route>
                              <Route path={`${path}/blogs/latest`}>
                                <LatestInsights />
                              </Route>
                              <Route path={`${path}/blogs/category/:slug`}>
                                <InsightCategory />
                              </Route>
                            </>
                          </Switch>
                        </div>
                      </div>
                    </div>
                  </>
                )}
            </div>
          </>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    user: { authorized, isBvnActive, isStaff, token },
    ui: {
      modal,
      alerts: { ui_SHOW_ALERT },
    },
    app: {
      profile: { userProfile },
      notifications,
    },
  } = state;

  return {
    authorized,
    isBvnActive,
    isStaff,
    showTransferModal: modal.ui_SHOW_TRANSFER,
    userProfile,
    alert: ui_SHOW_ALERT,
    notifications: notifications?.notifications,
    notificationsMeta: notifications?.meta,
    token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout(true)),
    getUserProfile: () => dispatch(getUserProfile()),
    getSegmentQuestions: () => dispatch(getSegmentQuestions()),
    getWalletDetails: () => dispatch(getWalletDetails()),
    getSystemCinfig: () => dispatch(getSystemCinfig()),
    getRiskQuestions: () => dispatch(getRiskQuestions()),
    connectToSocket: () => dispatch(connectToSocket()),
    getDashboardInfo: () => dispatch(getDashboardInfo()),
    getAllNotifications: (limit, page) =>
      dispatch(getAllNotifications(limit, page)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
