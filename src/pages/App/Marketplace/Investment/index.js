import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/investment/actionTypes";
import { getInvestmentDetails } from '#/store/investment/actions'
import Back from '#/components/Back';
import Card from '#/components/Card';
import InvestmentItem from '#/components/Investment';
import Collections from "#/pages/App/Marketplace/Collections"
import Predefined from "#/pages/App/Marketplace/Predefined"
import Custom from "#/pages/App/Marketplace/Custom"
import Modal from '#/components/Modal';
import HexBG from "#/assets/images/hex.svg";
import { openOffCanvas } from "#/utils";
import './style.scss';

class Investment extends React.Component {

  state = {
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
    if (!isBvnActive) {
      return this.toggleBvnModal()
    }

    openOffCanvas(`offcanvas-${state.investment.id}`)

    // if (state.investment.type === 'collection') {
    //   return this.props.history.push({
    //     pathname: `/app/marketplace/${state.investment.type}/${state.investment.id}`,
    //     state: { investment: state.investment, routeName: 'Marketplace' },
    //   })
    // }
    // return this.props.history.push({
    //   pathname: `/app/marketplace/${state.investment.type}/${state.investment.id}`,
    //   state: { investment: state.investment, routeName: 'Marketplace' },
    // })
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
            <div className="text-right pb-3">
              <img src={require('#/assets/icons/close.svg')} alt="close" onClick={this.toggleBvnModal} className="cursor-pointer" />
            </div>
            <div className="px-3">
              <div className="d-flex justify-content-center">
                <img src={require('#/assets/icons/bank-transfer.svg')} alt="bank" className="pb-3" />
              </div>
              <div className="text-center">
                <div className='mb-3'>
                  <h5 className="text-blue font-bolder">Please setup your BVN to continue</h5>
                </div>
                <div className="mt-4">
                  <button className="btn btn-primary btn-block py-3 mt-3" onClick={this.handleBvnSetup}>
                    Setup BVN
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        }
        <div className="row">
          <div className="col-md-2">
            <Back />
          </div>
        </div>
        <div className="mt-4 col col-md-12 p-4">
          <div className="pt-2 pb-2 d-flex flex-wrap mb-4">
            <div className="overflow-hidden img-section mr-4">
              <img src={require(`#/assets/icons/setup-investment.svg`)} alt="custom-investment" className="img-fluid mr-3 investment-img" />
            </div>
            <div className="d-flex flex-column justify-content-center">
              <h3 className="text-blue text-capitalize mb-0">{state?.investment.name}</h3>
              <p className="text-black text-small text-wrap">{state?.investment.description}</p>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-md-3 mt-4">
              <Card classes={`bg-default investment-item cursor-pointer ${investmentList ? investmentList.investments.length ? "multiple" : "" : ""}`} onclick={this.handleNewInvestment} backgroundImage={`url(${HexBG})`}>
                <div className="text-right" onClick={this.handleNewInvestment}>
                  <img src={require('#/assets/icons/plus-circle.svg')} alt="plus" className="img-fluid" onClick={this.handleNewInvestment} />
                </div>
                <h3 className="text-white text-medium pr-4" onClick={this.handleNewInvestment}>Create a new {state?.investment.name} plan</h3>
              </Card>
            </div>
            {investmentList &&
              investmentList.investments?.map((investment) => {
                return (<div className="col-md-3 mt-4" key={investment && investment.id}>
                  <InvestmentItem investment={investment && investment} navigateToInvestment={this.handleNavigatetoInvestment} />
                </div>)
              })
            }
          </div>
        </div>
        {
          state.investment.type === 'collection' ? <Collections /> : state.investment.type === 'custom' ? <Custom /> : <Predefined />
        }
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
    getInvestmentDetails: (id) => dispatch(getInvestmentDetails(id)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Investment));
