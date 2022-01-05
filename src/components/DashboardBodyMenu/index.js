import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import './style.scss';

class DashboardBodyMenu extends Component {
  render() {
    const { menus, classes } = this.props;

    return (
      <div className={`dashboard-body-menu ${classes}`}>
        {
          menus.map(menu => (
            <NavLink
              exact
              to={{ pathname: menu.path, state: { routeName: menu.title } }}
              key={menu.name}
              activeClassName="dashboard-body-menu__menu-item--active"
            >
              <span className="dashboard-body-menu__menu-item">
                {menu.name}
                {menu.count >= 0 && <span className="dashboard-body-menu__item-count">{menu.count}</span>}
              </span>
            </NavLink>
          ))
        }
      </div>
    )
  }
}

export default withRouter(DashboardBodyMenu);
