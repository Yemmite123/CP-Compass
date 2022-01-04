import React, { useEffect } from 'react';
import { connect } from "react-redux";
import DropdownMenu from '#/components/DropdownMenu';
import Notifications from '../Notifications';
import CPLogo from '#/assets/images/cp-logo.svg';
import NoNofit from '#/assets/icons/notification-bell.svg';
import NewNofit from '#/assets/icons/new-notification.svg';
import { checkUnread } from '#/utils';
import './style.scss';

const DashboardNav = ({ headerTitle, toggleMenu, notifications, notificationsMeta, ...props }) => {
  
  const [ notif, setNotif ] = React.useState(false);

  useEffect(() => {
    const result = checkUnread(notifications)
    if(result) {
      return setNotif(true);
    }
    setNotif(false);
  }, [notifications])

  const hideNotif = () => {
    setNotif(false);
  }

  const menu = [
    {
      name: 'Profile',
      handler: props.profileHandler,
      icon: require('#/assets/icons/profile-menu.svg')
    },
    {
      name: 'Logout',
      handler: props.logoutHandler,
      icon: require('#/assets/icons/logout-menu.svg')
    }
  ]
  return (
    <div className="d-flex dashboard-nav justify-content-between align-items-center">
      <div className="title">
        {headerTitle}
      </div>
      <div className="align-items-center d-flex">
        <img
          src={require("#/assets/icons/hamburger.svg")}
          alt="hamburger icon"
          className="hamburger mr-3"
          onClick={toggleMenu}
        />
        <div className="nav-logo mt-0 pt-0">
          <img src={CPLogo} alt="logo" className="cp-logo" />
        </div>
      </div>
      
      <div className="d-flex align-items-center">
        <Notifications notifications={notifications} meta={notificationsMeta} hideNotif={hideNotif}>
          <img src={notif ? NewNofit : NoNofit} alt="notification" className="mr-4"/>
        </Notifications>
        <div className="user-img mr-2">
            <img src={props.user && props.user.data?.pictureUrl ? props.user.data?.pictureUrl : require('#/assets/icons/profile-icon.svg')} alt="profile"/>
        </div>
        <DropdownMenu menu={menu}>
            <img src={require('#/assets/icons/carret.svg')} alt="dropdown"/>
        </DropdownMenu>
      </div>
    </div>
  )
}

const mapStateToProps = state => {

  const {
    app: { notifications }
  } = state;
  return {
    updatedNotif: notifications?.notifications
  }
}

const mapDispatchToProps = () => {
  return{}
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardNav);
