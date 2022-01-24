import React from 'react';
import { connect } from 'react-redux';
import { removeAlert } from '#/store/ui/actions';
import './style.scss';


//TODO
class FloatingToastAlert extends React.Component {

  componentDidMount() {
    if (this.props.alert) {
      setTimeout(() => {
        this.props.removeAlert();
      }, 3000);
    }
  }

  componentDidUpdate() {
    if (this.props.alert) {
      setTimeout(() => {
        this.props.removeAlert();
      }, 3000);
    }
  }

  render() {
    const { alert } = this.props
    return (
      <div className="floating-popup">
        <div className={`floating-popup--${alert.type}`}>
          <div className="floating-popup__message font-md">
            {alert.message}
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = () => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeAlert: () => dispatch(removeAlert()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FloatingToastAlert);
