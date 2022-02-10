import React from 'react';
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { Doughnut } from 'react-chartjs-2';
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/portfolio/actionTypes";
import { fetchPortfolio } from '#/store/portfolio/actions'
import DashboardBodyMenu from '#/components/DashboardBodyMenu';
import Card from '#/components/Card';
import TermedInvestments from './TermedInvestments';
import FinancialInstruments from './FinancialInstruments';
import SingleInvestment from './SingleInvestment';
import LiquidateInvestment from './LiquidateInvestment';
import { portfolioPieOptions, formatCurrency, isNegative, portfolioPie } from '#/utils';

class Portfolio extends React.Component {

  state = {
    selectedStatus: 'all',
  }

  handleChangestatus = (event) => {
    const { name, value } = event.target
    const { history: { location } } = this.props;
    this.setState({ [name]: value }, () => {
      if (location.pathname === '/app/portfolio/termed-investments') {
        return this.props.fetchPortfolio(`${value}`)
      }
      return;
    });
  }

  componentDidMount() {
    this.props.fetchPortfolio('all');
  }

  render() {
    const { match: { path }, data, loading, location, wallet } = this.props;
    const walletValue = wallet ? parseInt(wallet.replaceAll(',', ''), 10) : 0;

    const menus = [
      {
        name: 'Overview',
        path: '/app/portfolio/overview',
        title: 'Overview',
      },
      {
        name: 'Aspire Goals',
        path: '/app/portfolio/termed-investments',
        title: 'Aspire Goals',
      },

    ]
    const { selectedStatus } = this.state;
    return (
      <Switch>
        <Route exact path={path}>
          <Redirect to={{ pathname: `${path}/overview`, state: { routeName: 'Portfolio' } }} />
        </Route>
        {(location.pathname.split('/').includes('termed-investments')
          || location.pathname.split('/').includes('financial-instruments') || location.pathname.split('/').includes('overview'))
          &&
          <>
            <div className="portfiolio-page">
              <div className="d-flex justify-content-between align-items-center mt-0 flex-wrap" style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.125)" }}>
                <DashboardBodyMenu menus={menus} classes="mt-0" />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-0 flex-wrap" >

                <p className="my-2">{location.pathname.split('/').includes('termed-investments') ? "Track the progress of your goals." : "Track your growing net worth daily"}</p>
                {location.pathname.split('/').includes('termed-investments') && <select className="selectbox p-1 text-small border-grey text-black" defaultValue={selectedStatus} name="selectedStatus" onChange={this.handleChangestatus}>
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="booked">Booked</option>
                  <option value="matured">Matured</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="terminated">Terminated</option>
                </select>}
              </div>
              <div className="row">
                <div className="col-md-12 mt-3">
                  <div className="">
                    <div className="mt-2">
                      <Switch>
                        <Route path={`${path}/termed-investments`}>
                          <TermedInvestments investments={data?.investments} loading={loading} />
                        </Route>
                        <Route path={`${path}/overview`}>
                          <div className="col-md-6 mt-3">
                            <div className="card p-4">
                              <h3 className="text-deep-blue text-small">Portfolio Allocation</h3>
                              <div className="mt-4">
                                {!walletValue && !data?.portfolios?.portfolioWorth?.amount ?
                                  <div className="d-flex justify-content-center w-100">
                                    <p className="text-center text-grey">No Investment data yet</p>
                                  </div>
                                  :
                                  <Doughnut data={portfolioPie(walletValue, data?.portfolios?.portfolioWorth.amount)} options={portfolioPieOptions} />
                                }
                                <div className="row">
                                  <div className="col-lg-6 col-md-6">
                                    <Card classes="border-blue mt-3">
                                      <p className="text-grey text-small mb-0">Total Portfolio Value</p>
                                      <p className="text-deep-blue text-large mb-0">&#x20A6;{data && data.portfolios?.portfolioWorth ? formatCurrency(data.portfolios?.portfolioWorth.amount) : 0}</p>
                                      <div className="d-flex mt-2 align-items-baseline">
                                        <img
                                          src={isNegative(data && data?.portfolios?.portfolioWorth.percentageDiff) === 'neutral'
                                            ? require('#/assets/icons/flatline.svg') :
                                            isNegative(data && data?.portfolios?.totalReturns.percentageDiff)
                                              ? require('#/assets/icons/fall-red-small.svg')
                                              : require('#/assets/icons/rise-green.svg')
                                          }
                                          className="img-fluid mr-2"
                                          alt="difference" />
                                        <p
                                          className={`text-small  mr-2 mb-0 
                                      ${isNegative(data && data?.portfolios?.portfolioWorth.percentageDiff) === 'neutral' ? 'text-grey' :
                                              isNegative(data && data?.portfolios?.portfolioWorth.percentageDiff) ? 'text-red' : 'text-green'}
                                      `}
                                        >
                                          {data && data?.portfolios?.portfolioWorth.percentageDiff}%
                                        </p>
                                        <p
                                          className={`text-small mb-0 
                                    ${isNegative(data && data?.portfolios?.portfolioWorth.percentageDiff) === 'neutral' ? 'text-grey' :
                                              isNegative(data && data?.portfolios?.portfolioWorth.percentageDiff) ? 'text-red' : 'text-green'}
                                    `}>
                                          (Last 7 days)
                                        </p>
                                      </div>
                                    </Card>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <Card classes="bg-default mt-3">
                                      <p className="text-white text-small mb-0">Total Returns</p>
                                      <p className="text-white text-large mb-0">&#x20A6;{data && data.portfolios?.totalReturns ? formatCurrency(data.portfolios?.totalReturns.amount) : 0}</p>
                                      <div className="d-flex mt-2 align-items-baseline">
                                        <img
                                          src={isNegative(data && data?.portfolios?.portfolioWorth.percentageDiff === 'neutral')
                                            ? require('#/assets/icons/flatline-white.svg') :
                                            isNegative(data && data?.portfolios?.totalReturns.percentageDiff)
                                              ? require('#/assets/icons/fall-white-small.svg')
                                              : require('#/assets/icons/rise-white-small.svg')
                                          }
                                          className="img-fluid mr-2"
                                          alt="difference" />
                                        <p className="text-small text-white mr-2 mb-0">
                                          {data && data.portfolios?.totalReturns ? data.portfolios?.totalReturns.percentageDiff : 0}%
                                        </p>
                                        <p className="text-small text-white mb-0">(Last 7 days)</p>
                                      </div>
                                    </Card>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Route>
                      </Switch>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        }
        <Route path={`${path}/investment/:investmentId`} >
          <SingleInvestment />
        </Route>
        <Route path={`${path}/liquidate/:investmentId`} >
          <LiquidateInvestment />
        </Route>
      </Switch>
    )
  }
}

const mapStateToProps = state => {
  const { app: { portfolio: { data }, wallet: { walletDetails } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.FETCH_PORTFOLIO_REQUEST),
    data,
    wallet: walletDetails?.wallet?.NGN,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPortfolio: (status) => dispatch(fetchPortfolio(status)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Portfolio));
