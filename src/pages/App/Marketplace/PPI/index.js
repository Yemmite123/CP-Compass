import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/ppi/actionTypes";
import { getActivePpi, getSinglePpi } from "#/store/ppi/actions";
import SingleMutualFund from "#/pages/App/Marketplace/SingleMutualFund";
import "./style.scss";
import MarketSkeleton from "../Skeleton";
import PpiCard from "#/components/PpiCard";
import Back from '#/components/Back';


class PPI extends React.Component {
  state = {
    stageOne: true,
    stageTwo: false,
    selectFund: null,
    limit: 10,
    page: 1,
  };

  componentDidMount() {
    const { page, limit } = this.state;
    this.props.getActivePpi(page, limit);
  }

  handleSingleFund = (fund) => {
    this.setState({ selectFund: fund }, () => {
      this.setState({ stageTwo: true, stageOne: false }, () => {
        this.props.togglePpiMenu();
      });
      this.props.getSinglePpi(fund.slug);
    });
  };

  navigateBack = () => {
    this.setState({ stageTwo: false, stageOne: true }, () => {
      this.props.togglePpiMenu();
    });
  };

  fetchMore = () => {
    this.setState({ page: this.state.page + 1 }, () => {
      this.props.getActivePpi(this.state.page, this.state.limit);
    });
  };

  fetchPrevious = () => {
    if (this.state.page === 1) {
      return;
    }
    this.setState({ page: this.state.page - 1 }, () => {
      this.props.getActivePpi(this.state.page, this.state.limit);
    });
  };

  //TODO:
  render() {
    const { loading, funds, fund, fundLoading, data } = this.props;
    console.log(data);
    const { stageOne, stageTwo } = this.state;
    return (
      <div className="ppi-page">
        {stageOne && (
          <>
            {!funds && loading && <MarketSkeleton />}
            <div className="row">
              {funds && funds.length > 0
                ? funds.map((fund) => (
                  <div className="col-md-3 pl-0 mt-3" key={Math.random() * 1000} >
                    <PpiCard
                      item={fund}
                      handleSelect={() => this.handleSingleFund(fund)}
                    />
                  </div>
                ))
                : !loading && (
                  <div className="w-100 text-center d-flex justify-content-center" style={{ minHeight: "69vh" }}>
                    <div className='align-self-center'>
                      <img
                        src={require("#/assets/icons/receipt.svg")}
                        alt="no-tickets"
                        className="img-fluid"
                      />
                      <p className="" style={{ color: "rgba(229, 229, 229, 1)" }}>
                        There are no ne issues at this time
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {(funds && funds.length > 0) ? <div className="text-center d-flex justify-content-between align-items-center mt-3">
              <div>
                <button
                  className="btn btn-primary btn-sm mr-2"
                  onClick={this.fetchPrevious}
                  disabled={loading || this.state.page === 1}
                >
                  Prev
                </button>
                <button
                  className="btn btn-primary btn-sm ml-2"
                  onClick={this.fetchMore}
                  disabled={
                    loading ||
                    this.state.page === data?.lastPage ||
                    !data?.total
                  }
                >
                  Next
                </button>
              </div>
              <p className="text-grey text-small">Page {this.state.page}</p>
            </div>
              : <></>
            }
          </>
        )}

        {stageTwo && (
          <>
            {fundLoading && (
              <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-primary spinner-border-md text-center"></div>
              </div>
            )}

            <Back onClick={this.navigateBack} />
            {fund && <SingleMutualFund fund={fund} />}
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    app: {
      ppi: { funds, data, fund },
    },
  } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_ACTIVE_PPI_REQUEST),
    fundLoading: getActionLoadingState(
      state,
      actionTypes.GET_SINGLE_PPI_REQUEST
    ),
    funds,
    data,
    fund,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getActivePpi: (page, limit) => dispatch(getActivePpi(page, limit)),
    getSinglePpi: (slug) => dispatch(getSinglePpi(slug)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PPI));
