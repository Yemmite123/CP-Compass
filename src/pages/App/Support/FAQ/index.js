import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/support/actionTypes";
import { getAllFaqs  } from '#/store/support/actions'
import CONFIG from '#/config';
import Accordion from '#/components/Accordion';
import './style.scss';

class FAQ extends React.Component {

  state = {
    selectedItem: null
  }
  componentDidMount() {
    this.props.getAllFaqs();
  }

  handleSelectItem = (id) => {
    this.setState({ selectedItem: parseInt(id, 10) });
  }
  closeItem = () => {
    this.setState({ selectedItem: null })
  }

  render() {
    const { faq, loading } = this.props;
    const { selectedItem } = this.state;
    return (
      <div className="faq-page">
        <div>
          {loading &&
            <div className="text-center p-4">
              <div className="spinner-border spinner-border-primary text-primary spinner-border-md mr-2"></div>
            </div>
          }
          {faq && faq?.faq.length > 0 ?
            faq?.faq.slice(0,4).map((item, index) => (
              <Accordion
                item={item}
                key={item.id}
                selectedItem={selectedItem}
                selectItem={this.handleSelectItem}
                open={selectedItem === item.id}
                closeItem={this.closeItem}
              />
            ))
          :
          (!loading && 
            <div className="text-center mt-3">
            <p className="font-light text-medium">No FAQs available</p>
          </div>
          )
          }
        </div>
        <div className="text-center mt-5">
          {!loading &&
            <a href={`${CONFIG.WEBSITE_URL}/faqs`} target="_blank" rel="noopener noreferrer">
              <button className="btn btn-sm btn-primary">
                Learn more
              </button>
            </a>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { app: { support: { faq } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_ALL_FAQS_REQUEST),
    faq,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllFaqs: () => dispatch(getAllFaqs()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FAQ));
