import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/notifications/actionTypes";
import { updateNotification, getAllNotifications } from '#/store/notifications/actions'
import Unread from '#/assets/icons/unread.svg';
import './style.scss';

class Notifications extends Component {
  state = {
    showNotifications: false,
    newNotif: false,
  }

  dropdown = React.createRef()

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.hide);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.closeNotif)
  }

  updateNotification = (id, read) => {
    if(read)return;

    this.props.updateNotification(id, { read: true })
    .then(data => {
      this.props.getAllNotifications(20,1)
    })
  }

  show = (e) => {
    this.setState((state) => ({ showNotifications: !state.showNotifications }));
    this.props.hideNotif();
  }

  hide = (e) => {
    if (!this.dropdown.current.contains(e.target)) {
      this.setState({ showNotifications: false });
    }
    document.removeEventListener('mousedown', this.hide);
  }

  closeNotif = (e) => {
    if(e.target.classList.contains("mr-3")) return;
    if(e.target.classList.contains("notification-info")) return;
    if(e.target.classList.contains("notifications__box")) return;
    if(e.target.classList.contains("notifications__item")) return;
    if(e.target.classList.contains("notifications__title")) return;
    if(e.target.classList.contains("notifications__content")) return;
    if(e.target.classList.contains("notifications__no-notif")) return;
    if(e.target.classList.contains("notif-section")) return;
    this.setState({ showNotifications: false });
  }

  render() {
    const { notifications } = this.props;

    return (
      <div className="notifications" ref={this.dropdown}>
        <div onClick={this.show}>
        {this.props.children}
        </div>
        {this.state.showNotifications &&
        <div className="safe-area" onClick={this.closeNotif}>
          <ul className="notifications__box mt-2">
            {
              notifications && Object.keys(notifications).length > 0 ?
                (Object.keys(notifications).map(day => {
                  return (
                    <div key={day} className="notification-info p-3">
                      <p className="text-blue text-small mt-3 mb-0">{day}</p>
                      <div>
                        {notifications[day].length > 0 ?
                          notifications[day].map(notif => (
                            <div
                              className="notifications__item d-flex align-items-baseline border-bottom "
                              key={notif.id}
                              onClick={() => this.updateNotification(notif.id, notif.read)}
                            >
                              {!notif.read && <img src={Unread} alt="notifications read" className="img-fluid mr-3" />}

                              <div className="w-100 notif-section">
                                <p className={`mb-2 font-weight-bold text-small notifications__title ${notif.read && 'text-grey'}`}>{notif?.data.title}</p>
                                <p className={`mb-2 text-l-small notifications__content ${notif.read && 'text-grey'}`}>{notif?.data.message}</p>
                              </div>
                            </div>))
                          :
                          <p className="text-grey text-small text-center mt-2 no-notif">No notifications for {day}</p>
                        }
                      </div>
                    </div>
                  )
                })
                )
                :
                <p className="text-grey text-small text-center mt-2">No notifications</p>
            }
          </ul>
          </div>
          }
      </div>
    )
  }
}

const mapStateToProps = state => {

  return {
    loading: getActionLoadingState(state, actionTypes.GET_RECOMMENDED_INVESTMENTS_REQUEST),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateNotification: (id, payload) => dispatch(updateNotification(id, payload)),
    getAllNotifications: (limit, page) => dispatch(getAllNotifications(limit, page)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Notifications));