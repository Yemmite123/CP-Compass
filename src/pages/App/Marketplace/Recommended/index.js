import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/investment/actionTypes";
import { getRecommendedInvestments } from '#/store/investment/actions'
import MarketSkeleton from '../Skeleton';
import './style.scss';
import MarketplaceCard from '#/components/MarketplaceCard';

class Recommended extends React.Component {

  componentDidMount() {
    this.props.getRecommendedInvestments();
  }

  handleSingleInvestment = (investment) => {
    this.props.history.push({
      pathname: `/app/marketplace/termed-investment/${investment.id}`,
      state: { investment, routeName: 'Marketplace' },
    })
  }

  render() {
    const { recommended, loading } = this.props;

    return (
      <div className="recommended-investments-page" >
        {loading && !recommended && <MarketSkeleton />
        }
        {recommended &&
          <div className="row gx-5">
            {
              (recommended && recommended.recommendations?.length > 0 &&
                recommended.recommendations?.map(investment => (
                  <div className="col-md-3 mt-3 pl-0" key={Math.random() * 1000} >
                    <MarketplaceCard
                      key={Math.random() * 1000}
                      item={investment}
                      handleSelect={() => this.handleSingleInvestment(investment)}
                    />
                  </div>
                ))
              )
            }
          </div>
        }
        {!loading && !recommended &&
          <div className="text-center d-flex justify-content-center" style={{ minHeight: "69vh" }}>
            <div className='align-self-center'>
              <img
                src={require("#/assets/icons/receipt.svg")}
                alt="no-tickets"
                className="img-fluid"
              />
              <p className="" style={{ color: "rgba(229, 229, 229, 1)" }}>
                You have no recomendations yet
              </p>
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { app: { investment: { recommended } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_RECOMMENDED_INVESTMENTS_REQUEST),
    recommended,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRecommendedInvestments: () => dispatch(getRecommendedInvestments()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Recommended));
