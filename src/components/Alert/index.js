import React, { Component, Fragment } from "react";
import './style.scss';

export default class Alert extends Component {
    render() {
        const { alert } = this.props;

        const icons = {
            danger: require("#/assets/icons/error.svg"),
            success: require("#/assets/icons/success.svg"),
            warning: require("#/assets/icons/alert.svg"),
            primary: require("#/assets/icons/info.svg"),
        }
        
        return(
            <div className="cp-alert">
                {alert &&
                    <Fragment>
                        {typeof(alert.message) === "string" &&
                            <p className={`alert ${`alert-${alert.type}`}`}>
                                <img src={icons[alert.type]} className="icon" alt="icon" />
                                {alert.message}
                            </p>
                        }
                    </Fragment>
                }
            </div>
        )
    }
}