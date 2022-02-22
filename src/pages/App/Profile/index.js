import React from 'react';
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import { getUserProfile, getAllBanks } from "#/store/profile/actions";
import actionTypes from "#/store/profile/actionTypes";
import AppBodyMenu from '#/components/AppBodyMenu';
import BioData from './BioData';
import NextOfKin from './NextOfKin';
import EmploymentDetails from './EmploymentDetails';
import KycVerification from './KycVerification';
import PoliticalStatus from './PoliticalStatus';
import Security from './Security';
import Risk from './Risk';
import './style.scss';

class Profile extends React.Component {

  componentDidMount() {
    this.props.getUserProfile();
    this.props.getAllBanks();
  }

  render() {
    const { match: { path }, data, loading } = this.props;
    const menus = [
      {
        name: 'Personal Information',
        path: '/app/profile/personal-info',
        title: 'Profile',
      },
      {
        name: 'KYC Verification',
        path: '/app/profile/verification-information',
        title: 'Profile',
      },
      {
        name: 'Security',
        path: '/app/profile/security',
        title: 'Profile',
      },
      {
        name: 'Trybe & Risk Profile',
        path: '/app/profile/risk-profile',
        title: 'Profile',
      },
    ]
    return (
      <div className="profile-page">
        <AppBodyMenu menus={menus} />
        <div>
          {!data && loading && 
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary spinner-border-md text-center"></div>
            </div>
          }
          { data &&
            <Switch>
            <Route exact path={path}>
              <Redirect to={{ pathname:`${path}/personal-info`, state: { routeName: 'Profile' }}} />
            </Route>
            <Route path={`${path}/personal-info`}>
              <BioData userInfo={data}/>
              <NextOfKin userInfo={data.nextOfKin}/>
              <EmploymentDetails userInfo={data.employment} />
              <PoliticalStatus userInfo={data.politicalStatus} />
            </Route>
            <Route path={`${path}/verification-information`}>
              <KycVerification userName={data?.firstName ? `${data.firstName} ${data.lastName}` : ''} isApproved={data && data.isApproved === 1 ? true : false} bvn={data.bvn} documents={data.documents} bankInfo={data.bankInfo}/>
            </Route>
            <Route path={`${path}/security`}>
              <Security />
            </Route>
            <Route path={`${path}/risk-profile`}>
                        <Risk segment={data.segment} risk={data.risk} bioData={data} sex={data.gender} dob={data.dateOfBirth}/>
            </Route>
          </Switch>
          }
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { app: { profile: { userProfile: { error, data } } } } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.GET_USER_PROFILE_REQUEST),
    error,
    data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserProfile: () => dispatch(getUserProfile()),
    getAllBanks: () => dispatch(getAllBanks()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
