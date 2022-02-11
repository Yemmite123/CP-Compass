import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { getActionLoadingState } from "#/store/selectors";
import { getUserProfile } from "#/store/profile/actions";
import { getDashboardInfo } from '#/store/dashboard/actions';
import actionTypes from "#/store/profile/actionTypes";
import SummaryCard from '#/components/SummaryCard';
import QuickActionCard from '#/components/QuickActionCard';
import HomeSkeleton from './Skeleton';
import InformationBar from '#/components/InformationBar';
import { getTimeOfDay, formatCurrency } from '#/utils';
import './style.scss';
import WalletBG from "#/assets/images/walletBG.svg";
import InvestmentBG from "#/assets/images/InvestmentBG.svg";
import ReturnsBG from "#/assets/images/ReturnsBG.svg";

class Home extends React.Component {

  componentDidMount() {
    this.props.getUserProfile();
    this.props.getDashboardInfo();
  }

  setupInvestment = () => {
    this.props.history.push({
      pathname: `/app/marketplace/termed-investments`,
      state: { routeName: 'Marketplace' },
    })
  }

  setupFinancials = () => {
    this.props.history.push({
      pathname: `/app/marketplace/financial-instruments`,
      state: { routeName: 'Marketplace' },
    })
  }

  setupCustomInvestment = () => {
    const { dashboard } = this.props;

    this.props.history.push({
      pathname: `/app/marketplace/termed-investment/${dashboard?.dashboard?.custom.id}`,
      state: { routeName: 'Marketplace', investment: dashboard?.dashboard?.custom },
    })
  }

  render() {
    const { isBvnActive, data, loading, dashboard } = this.props;
    const walletValue = dashboard ? parseInt(dashboard?.dashboard?.wallet?.NGN?.split(',').join(''), 10) : 0;
    const portfolioValue = dashboard?.dashboard.portfolios.portfolioWorth?.amount ?? 0;
    const walletPercentage = (walletValue * 100) / (walletValue + portfolioValue);
    const portfolioPercentage = (portfolioValue * 100) / (walletValue + portfolioValue);
    const userHasNoFinancialHistory = !walletValue && !dashboard?.dashboard.portfolios.portfolioWorth?.amount;
    console.log(dashboard)
    return (
      <div className="home-dashboard-page">
        {loading && !dashboard && <HomeSkeleton />}
        {dashboard &&
          <>
            {loading && !isBvnActive &&
              <Link to="/app/onboarding" className="text-white">
                <InformationBar className="text-white">
                  <span className="text-small font-medium">Complete your account setup:</span>
                  &nbsp;
                  <span className="text-small font-light">You need to complete your account setup to start investing!</span>
                </InformationBar>
              </Link>
            }

            {/* { isBvnActive && !isApproved && 
          <InformationBar className="mt-3 mb-3 text-white">
            Your account is awaiting approval, you won't be able to perform some actions
          </InformationBar>
        } */}
            <div className="salutation">
              Good {getTimeOfDay()}<span>{data && data.firstName && ` ${data.firstName},`} 🌤 </span>
            </div>
            <div className="summary-container">
              <SummaryCard className="BG"
                title="Wallet Balance"
                showCurrency={true}
                total={dashboard?.dashboard?.wallet?.NGN ? dashboard?.dashboard?.wallet?.NGN : '0.00'}
                percentageDiff="N/A"
                backgroundImage={`url(${WalletBG})`}
                iconColor="#871523"
                iconName="white-wallet"
              />

              <SummaryCard
                title="Total Investment"
                showCurrency={true}
                total={dashboard ? formatCurrency(dashboard?.dashboard?.portfolios.portfolioWorth?.amount) : '0.00'}
                percentageDiff={dashboard?.dashboard.portfolios.portfolioWorth?.percentageDiff}
                backgroundImage={`url(${InvestmentBG})`}
                iconColor="#B0500E"
                iconName="money"
              />
              <SummaryCard
                title="Total Returns"
                showCurrency={true}
                total={dashboard ? formatCurrency(dashboard?.dashboard.portfolios.totalReturns?.amount) : '0.00'}
                percentageDiff={dashboard?.portfolios?.totalReturns ? dashboard.portfolios.totalReturns.percentageDiff : 0}
                backgroundImage={`url(${ReturnsBG})`}
                iconColor="#3F2256"
                iconName="money-arrow"
              />
            </div>

            <div className="row">
              <div className="col-lg-6">
                <div className="section mb-5">
                  <h3 className="section__title">Portfolio</h3>
                  <div className="portfolio">
                    <div className="portfolio__block assets">
                      <div className="assets__top">
                        <h6 className="font-weight-bold">ASSET ALLOCATION</h6>
                        <Link to='/app/portfolio'>
                          {!userHasNoFinancialHistory && <span >View details <img className='ml-2' src={require(`#/assets/icons/right-caret.svg`)} alt="caret" /></span>}
                        </Link>
                      </div>
                      {userHasNoFinancialHistory ?
                        <div className="d-flex justify-content-center align-items-center h-75">
                          <p className="text-grey m-2">No Investment data yet</p>
                        </div>
                        :
                        <div className="assets__chart-box">
                          <div>
                            <div className="assets__chart" style={{ background: `conic-gradient(#5D65AC ${portfolioPercentage}%, #AD3336 ${walletPercentage}%)` }}>
                              <div>
                                <span>Total Investment <br /> <span style={{ fontWeight: '600', fontSize: '16px', lineHeight: '26px', color: '#141414' }}>&#x20A6;{formatCurrency(walletValue + portfolioValue)} </span></span>
                              </div>
                            </div>
                            <div className="assets__chart-bottom mb-4">
                              <span>Total Portfolio Value</span> <br />
                              <span style={{ fontWeight: '600', fontSize: '18px', lineHeight: '35px', color: '#141414' }} className="font-medium">&#x20A6;{formatCurrency(walletValue + portfolioValue)} / 100%</span>
                            </div>
                          </div>
                          <div className="assets__legend">
                            <div className="assets__legend-block">
                              <span className="assets__legend-key--investment"></span>
                              <span>Aspire Goals</span>
                              <span className="assets__legend-value">&#x20A6;{formatCurrency(portfolioValue)} / {portfolioPercentage.toFixed(2)}%</span>
                            </div>
                            <div className="assets__legend-block">
                              <span className="assets__legend-key--wallet"></span>
                              <span>Wallet</span>
                              <span className="assets__legend-value">&#x20A6;{formatCurrency(walletValue)} / {walletPercentage.toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-12">
                    <div className="section">
                      <div className="">
                        <h3 className="section__title">Quick Actions</h3>
                        <div className="section__cards">
                          <QuickActionCard
                            onclick={this.setupInvestment}
                            title="Setup Investments Plans"
                            iconName="setup-investment"
                          />
                          <QuickActionCard
                            onclick={() => this.props.history.push('marketplace/financial-instruments')}
                            title={<span>Invest in <br></br> Financial Instruments</span>}
                            iconName="light-bulb"
                          />
                          <QuickActionCard
                            onclick={this.setupCustomInvestment}
                            title={<span>Create a custom <br></br> Investment Plan</span>}
                            iconName="custom-plan"
                          />
                          <QuickActionCard
                            onclick={() => this.props.history.push('marketplace/termed-investments')}
                            title={<span>Join a tribe and <br></br> start investing</span>}
                            iconName="tribe"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="portfolio__block invite">
                      <div className="invite__image">
                        <img src={require(`#/assets/images/compass-app.svg`)} className="" alt="hand holding phone with compass app on screen" />
                      </div>
                      <div className="invite__body">
                        <h6 className="invite__heading">Join our large <br></br> tribe of Investors</h6>
                        <img src={require(`#/assets/icons/arc.svg`)} className="invite__arc" alt="arc" />
                        <p className="invite__info">
                          An app built to suit your lifestyle, specially designed for you!
                          Features to help you hit your short or long term goals.
                        </p>
                        <div>
                          <a href="#"><img src={require(`#/assets/icons/play-store.png`)} className="invite__link" alt="google play store" /></a>
                          <a href="#"><img src={require(`#/assets/icons/app-store.png`)} className="invite__link" alt="apple app store" /></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {
    app: {
      profile: { userProfile: { data } },
      dashboard,
    }
  } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_USER_PROFILE_REQUEST),
    isBvnActive: data && data.bvn ? true : false,
    data,
    dashboard: dashboard?.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserProfile: () => dispatch(getUserProfile()),
    getDashboardInfo: () => dispatch(getDashboardInfo()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
