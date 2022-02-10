import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/investment/actionTypes";
import { getTermedInvestments } from '#/store/investment/actions'
import MarketSkeleton from '../Skeleton';
import './style.scss';
import MarketplaceCard from '#/components/MarketplaceCard';

class TermedInvestments extends React.Component {

  componentDidMount() {
    if(!this.props.investments) {
      this.props.getTermedInvestments();
    }
  }   

  handleSingleInvestment = (investment) => {
    console.log(investment)
    this.props.history.push({
      pathname: `/app/marketplace/termed-investment/${investment.id}`,
      state: { investment, routeName: 'Marketplace' },
    })
  }

  render() {
    const { loading, investments } = this.props;
    return (
      <div className="termed-investments-page">
        {!investments && loading && <MarketSkeleton />
        }
        {investments &&
        <div className="row">
          {investments &&
          investments.investments?.data.length > 0 ?
          investments.investments?.data.map(investment => (
            <div className="col-md-3 pl-0 mt-3" key={Math.random()*1000} >
              <MarketplaceCard 
                item={investment} 
                handleSelect={() => this.handleSingleInvestment(investment)}
              />
            </div>
          ))
          :
          ( !loading && <div className="text-center w-100 mt-5">
            <p className="text-grey text-medium">No Termed Investments</p>
          </div>)
        }
        </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { app: { investment: { investments } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_ALL_INVESTMENTS_REQUEST),
    investments,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTermedInvestments: () => dispatch(getTermedInvestments()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TermedInvestments));
