import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import './style.scss';

const AppBodyMenu = ({menus}) => {
  return (
    <div className="app-body-memu">
      {menus.map((menu) => (
        <NavLink
          exact
          to={{ pathname: menu.path, state: { routeName: menu.title } }}
          key={menu.name}
          activeClassName="app-body-memu__menu-item--active"
        >
          <div className="app-body-memu__menu-item">
            {menu.name}
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default withRouter(AppBodyMenu);
