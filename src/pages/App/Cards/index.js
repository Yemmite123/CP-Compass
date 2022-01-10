import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Back from '#/components/Back';
import Card from '#/components/Card';
import DebitCard from '#/components/DebitCard';
import { getActionLoadingState } from "#/store/selectors";
import { getCards, depositFunds, depositFundsCard } from '#/store/wallet/actions'
import actionTypes from '#/store/wallet/actionTypes';
import './style.scss';

class Cards extends React.Component {

  componentDidMount () {
    if(!this.props.history.location.state) {
      this.props.history.goBack();
    }
    this.props.getCards();
  }

  handleDeposit = () => {
    const { location: { state } } = this.props.history
    const payload = { amount: state?.amount, currency: 'NGN' }

    this.props.depositFunds(payload)
  }

  handleSelectCard = (card) => {
    const { location: { state } } = this.props.history
    const payload = { amount: state?.amount, cardId: card.id }
    console.log(payload);
    this.props.depositFundsCard(payload, this.props.history)
  }

  render() {
    const { loading, cards, payLoading, error } = this.props;

    return (
      <div className="select-card">
        <div className="row">
          <div className="col-md-2">
            <Back />
          </div>
          <div className="col-md-8 text-center">
            <h3 className="text-medium text-deep-blue ">Select a Card</h3>
          </div>
        </div>
        <Card classes="mt-4 col col-md-9 ml-auto mr-auto">
          <div className="p-3">
            {!cards && loading && 
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary spinner-border-md text-center"></div>
            </div>
            }

          {
            cards &&
            cards.cards.length > 0 && 
            cards.cards.map(card => (
              <DebitCard card={card} handleSelect={this.handleSelectCard} key={card.id}/> 
            ))
          }
          {
            !loading &&
            <div className="d-flex justify-content-between align-items-center cursor-pointer" onClick={this.handleDeposit}>
              <div className="d-flex align-items-center">
                <img src={require('#/assets/icons/add-card.svg')} className="img-fluid mr-3" alt="card"/>
                <p className="text-deep-blue text-medium mb-0">Add money from a new debit card</p>
              </div>
              <img src={require('#/assets/icons/right-arrow.svg')} className="img-fluid cursor-pointer" alt="arrow"/>
            </div>
          }
          </div>
          {error && typeof error === 'string' && <p className="text-error mt-2">{error}</p>}
          {payLoading && 
            <div className="d-flex justify-content-center mt-4">
              <div className="spinner-border text-primary spinner-border-md text-center"></div>
            </div>
            }
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { app: { wallet: { cards, error } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_ALL_CARDS_REQUEST),
    payLoading: getActionLoadingState(state, actionTypes.DEPOSIT_CARD_REQUEST),
    cards,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCards: () => dispatch(getCards()),
    depositFunds: (payload) => dispatch(depositFunds(payload)),
    depositFundsCard: (payload, history) => dispatch(depositFundsCard(payload, history))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cards));
