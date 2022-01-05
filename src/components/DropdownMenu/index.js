import React, { Component } from 'react'
import './style.scss';

class DropdownMenu extends Component {
  state = {
    showMenu: false,
  }
  dropdown = React.createRef()

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.hide);
  }

  show = (e) => {
    this.setState((state) => ({showMenu: !state.showMenu}));
    document.addEventListener('mousedown', this.hide);
  }

  hide = (e) => {
    if (!this.dropdown.current.contains(e.target)) {
      this.setState({showMenu: false});
    }
    document.removeEventListener('mousedown', this.hide);
  }

  render() {
    const {menu} = this.props;
    return (
        <div className="custom-dropdown-menu" ref={this.dropdown} onClick={this.show}>
            {this.props.children}
            {this.state.showMenu && <ul className="custom-dropdown-menu__box">
              {
                menu.map(menuItem => (<li 
                  className="custom-dropdown-menu__item" 
                  key={menuItem.name} 
                  onClick={menuItem.handler}
                >
                  <img src={menuItem.icon} alt="dashboard nav" className="img-fluid mr-2"/>
                  {menuItem.name}
                </li>))
              }
            </ul>}
        </div>
    )
  }
}
export default DropdownMenu;