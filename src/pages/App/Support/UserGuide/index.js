import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/support/actionTypes";
import { getAllUserGuides } from '#/store/support/actions'
import DashboardBodyMenu from '#/components/DashboardBodyMenu';
import Back from '#/components/Back';
import './style.scss';

class UserGuide extends React.Component {

  state = {
    stageOne: true,
    stageTwo: false,
    stageThree: false,
    selectedGuide: null,
    selectedGuideItem: null,
  }

  componentDidMount() {
    this.props.getAllUserGuides()
  }

  handleSelectGuide = (id) => {
    const { guides } = this.props;
    const foundGuide = guides && guides.find(guide => guide.id === id)
    this.setState({ selectedGuide: foundGuide }, () => {
      this.toggleStageOne();
      this.toggleStageTwo();
    })
  }

  handleSelectedGuideItem = (id) => {
    const { selectedGuide } = this.state;
    const foundGuideItem = selectedGuide && selectedGuide.guides.find(guide => guide.id === id)
    this.setState({ selectedGuideItem: foundGuideItem}, () => {
      this.toggleStageTwo();
      this.toggleStageThree();
    })
  }

  handleViewGuideinfo = () => {
    this.toggleStageThree();
    this.toggleStageTwo();
  }

  handleHome = () => {
    const { stageThree } = this.state;
    if(stageThree) {
      this.toggleStageThree();
      return this.toggleStageOne();
    }
    this.toggleStageTwo();
    return this.toggleStageOne();
  }

  toggleStageOne = () => {
    this.setState(prevstate => ({ stageOne: !prevstate.stageOne }))
  }

  toggleStageTwo = () => {
    this.setState(prevstate => ({ stageTwo: !prevstate.stageTwo }))
  }

  toggleStageThree = () => {
    this.setState(prevstate => ({ stageThree: !prevstate.stageThree }))
  }

  render() {
    const { guides, loading } = this.props;
    const { stageOne, stageTwo, stageThree, selectedGuide, selectedGuideItem } = this.state;
    const menus = [
      {
        name: 'Tickets',
        path: '/app/support/tickets',
        title: 'Support',
      },
      {
        name: 'User Guide',
        path: '/app/support/user-guide',
        title: 'Support',
      },
      {
        name: 'FAQs',
        path: '/app/support/faqs',
        title: 'Support',
      },
    ]

    return (
      <>
        <Back onClick={this.handleHome}/>
        <div className="mb-4"/>

        <DashboardBodyMenu menus={menus} />
        <div className="user-guide-page mt-4">
          {loading &&
              <div className="text-center p-4">
                <div className="spinner-border spinner-border-primary text-primary spinner-border-md mr-2"></div>
              </div>
            }
          {stageOne &&
            <div className="row">
              {guides && guides.length > 0 ?
                guides.map(guide => (
                  <div className="col-md-4 mt-3" key={guide.id}>
                    <div className="guide-item p-3 d-flex flex-column justify-content-between">
                      {guide.image && <img src={guide.image} alt="" className="img-fluid attachment-img" />}
                      <h3 className="text-medium mt-3">{guide.title}</h3>
                      <p className="font-light">{guide?.content?.length > 40 ? `${guide?.content?.substring(0,40)}...` : guide?.content}</p>
                      <p className="text-blue font-light cursor-pointer" onClick={() => this.handleSelectGuide(guide.id)}>View More</p>
                    </div>
                  </div>
                ))
                :
                (!loading &&
                  <div className="text-center mt-2">
                    <p className="font-light">No user guides available</p>
                  </div>
                )
              }
            </div>
          }
          {stageTwo &&
            <div className="stage-two">
              <p className="text-small">
                <span className="text-grey">
                  <span className="cursor-pointer" onClick={this.handleHome}>Home</span>
                </span> {'>'} <span className="text-blue"> {selectedGuide && selectedGuide.title}</span> 
              </p>
              <h3 className="text-center text-medium font-weight-bold text-uppercase">Topic: {selectedGuide && selectedGuide.title}</h3>
              <p className="font-light text-center">General information about {selectedGuide && selectedGuide.title}</p>
              {selectedGuide && selectedGuide.guides?.length > 0 ?
                selectedGuide.guides.map(guide => (
                  <div className="d-flex align-items-center mb-2" key={guide.id}>
                    <img src={require('#/assets/icons/external-link.svg')} className="mr-2" alt="link"/>
                    <p className="text-blue mb-0 cursor-pointer" onClick={() => this.handleSelectedGuideItem(guide.id)}>{guide.title}</p>
                  </div>
                ))
                : <p> No items for this guide</p>
              }
            </div>  
          }
          {stageThree && 
            <div className="stage-three">
              <p className="text-small">
                <span className="text-grey">
                  <span className="cursor-pointer" onClick={this.handleHome}>Home</span> {'>'} <span className="cursor-pointer" onClick={this.handleViewGuideinfo}>{selectedGuide && selectedGuide.title}</span> {'>'}
                  </span><span className="text-blue"> {selectedGuideItem && selectedGuideItem.title}
                </span>
              </p>
              <h3 className="text-center text-medium font-weight-bold text-uppercase mb-4">{selectedGuideItem && selectedGuideItem.title}</h3>
              <p>{selectedGuideItem && selectedGuideItem.content}</p>
              <div>
              {selectedGuideItem?.image && <img src={selectedGuideItem?.image} alt="attachment" className="attachment-img img-fluid" />}
              </div>
            </div>
          }
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  const { app: { support: { guides, error } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_ALL_USER_GUIDES_REQUEST),
    error,
    guides,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllUserGuides: () => dispatch(getAllUserGuides()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserGuide));
