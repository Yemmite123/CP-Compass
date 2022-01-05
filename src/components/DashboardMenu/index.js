import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import CPLogo from '#/assets/images/cp-logo-new.svg'
import { ReactComponent as DashboardIcon } from '#/assets/icons/homeNew.svg';
import { ReactComponent as WalletIcon } from '#/assets/icons/wallet.svg';
import { ReactComponent as MarketIcon } from '#/assets/icons/marketplace.svg';
import { ReactComponent as PortfolioIcon } from '#/assets/icons/portfolio.svg';
import { ReactComponent as ProfileIcon } from '#/assets/icons/profile.svg';
import { ReactComponent as SupportIcon } from '#/assets/icons/support.svg';
import { ReactComponent as BlogIcon } from '#/assets/icons/insights.svg'
import { ReactComponent as CalculatorIcon } from '#/assets/icons/calculator.svg'
import './style.scss';

class DashboardMenu extends Component {

    menus = [
        {
            name: 'Dashboard',
            icon: DashboardIcon,
            path: '/app/home',
        },
        {
            name: 'Wallet',
            icon: WalletIcon,
            path: '/app/wallet',
        },
        {
            name: 'Marketplace',
            icon: MarketIcon,
            path: '/app/marketplace',
        },
        {
            name: 'Portfolio',
            icon: PortfolioIcon,
            path: '/app/portfolio',
        },
        {
            name: 'Profile',
            icon: ProfileIcon,
            path: '/app/profile',
        },
        {
            name: 'Insights',
            icon: BlogIcon,
            path: '/app/insights',
        },
        {
            name: 'Calculator',
            icon: CalculatorIcon,
            path: '/app/calculator',
        },
        {
            name: 'Support',
            icon: SupportIcon,
            path: '/app/support',
        },
    ]

    navigateToHome = () => {
        this.props.history.push({
            pathname: '/app',
            state: { routeName: 'Dashboard' },
        })
    }

    renderMenus = () => this.menus.map(menu => (
        <NavLink 
            to={{ pathname: menu.path, state: { routeName: menu.name || menu.title} }} 
            key={menu.name} 
            activeClassName="dashboard-menu-area__menu--active"
        >
            <div className="dashboard-menu-area__menu mt-2l999999 p-2l99999" onClick={this.props.openMenu ? this.props.handleToggleMenu : ()=>''}>
                <menu.icon className="dashboard-menu-area__menu-icon grey-icon mr-3" />
                <span className="dashboard-menu-area__menu-name">{menu.name}</span>
            </div>
        </NavLink>)
    )

    render() {
        const { openMenu } = this.props;
        return(
            <div className={`dashboard-menu ${openMenu ? 'menu-open' : 'menu-close'}`}>
                <img src={CPLogo} alt="logo" className="cp-logo dashboard-menu__logo cursor-pointer" onClick={this.navigateToHome} />
                <div className="dashboard-menu-area">
                    {this.renderMenus()}
                </div>
            </div>
        )
    }
}

export default withRouter(DashboardMenu);