import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/investment/actionTypes";
import { getInvestmentDetails } from '#/store/investment/actions'
import Back from '#/components/Back';
import Card from '#/components/Card';
import InvestmentItem from '#/components/Investment';
import Modal from '#/components/Modal';
import './style.scss';

class Investment extends React.Component {

  state= {
    showNoBvn: false,
  }
  componentDidMount() {
    const { location: { state } } = this.props.history
    if (!state || !state.investment) {
      return this.props.history.push('/app/marketplace/termed-investments')
    }
    this.props.getInvestmentDetails(state.investment.id)
  }

  handleBvnSetup = () => {
    this.props.history.push('/app/onboarding');
  }
  
  handleNewInvestment = () => {
    const { location: { state } } = this.props.history
    const { isBvnActive } = this.props;
    if(!isBvnActive){
      return this.toggleBvnModal()
    }

    if (state.investment.type === 'collection') {
      return this.props.history.push({
        pathname: `/app/marketplace/${state.investment.type}/${state.investment.id}`,
        state: { investment: state.investment, routeName: 'Marketplace' },
      })
    }
    return this.props.history.push({
      pathname: `/app/marketplace/${state.investment.type}/${state.investment.id}`,
      state: { investment: state.investment, routeName: 'Marketplace' },
    })
  }

  handleNavigatetoInvestment = (investmentId) => {
    this.props.history.push({
      pathname: `/app/portfolio/investment/${investmentId}`,
      state: { routeName: 'Portfolio' },
    })
  }

  toggleBvnModal = () => {
    this.setState(prevState => ({ showNoBvn: !prevState.showNoBvn }))
  }

  render() {
    const { location: { state } } = this.props.history
    const { investmentList } = this.props;
    const { showNoBvn } = this.state;

    return (
      <div className="single-investment-page">
        {showNoBvn &&
          <Modal classes="bvn-active" onClose={this.toggleBvnModal}>
            <div className="text-center">
              <h3 className="text-deep-blue">Please Setup your BVN to continue</h3>
              <button className="btn btn-primary btn-sm btn-block mt-4" onClick={this.handleBvnSetup}>
                Setup BVN
              </button>
            </div>
          </Modal>
        }
        <div className="row">
          <div className="col-md-2">
            <Back />
          </div>
        </div>
        <Card classes="mt-4 col col-md-12 p-4 card">
          <div className="border-bottom pt-2 pb-2 d-flex flex-wrap">
            <div className="overflow-hidden img-section">
              <img src={state?.investment.icon} alt="custom-investment" className="img-fluid mr-3 investment-img" />
            </div>
            <div>
              <h3 className="text-deep-blue text-medium text-capitalize">{state?.investment.name}</h3>
              <p className="text-black text-small text-wrap">{state?.investment.description}</p>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-4">
              <Card classes="bg-default investment-item cursor-pointer" onclick={this.handleNewInvestment}>
                <div className="text-right" onClick={this.handleNewInvestment}>
                  <img src={require('#/assets/icons/plus-white.svg')} alt="plus" className="img-fluid" onClick={this.handleNewInvestment} />
                </div>
                <h3 className="text-white text-medium mt-5 pt-2" onClick={this.handleNewInvestment}>Create new {state?.investment.name} plan</h3>
              </Card>
            </div>
            {investmentList && 
              investmentList.investments?.map((investment) => {
                return (<div className="col-md-4" key={investment.id}>
                  <InvestmentItem investment={investment} navigateToInvestment={this.handleNavigatetoInvestment} />
                </div>)
              })
            }
          </div>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { app: { investment: { investments, investmentList }, profile: { userProfile: { data } } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_INVESTMENT_DETAILS_REQUEST),
    investments,
    investmentList,
    isBvnActive: data && data.bvn ? true : false,
    isApproved: data && data.isApproved === 1 ? true : false,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInvestmentDetails: (id)=> dispatch(getInvestmentDetails(id)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Investment));
