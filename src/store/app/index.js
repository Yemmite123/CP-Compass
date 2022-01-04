import onboarding from '#/store/onboarding';
import profile from '#/store/profile';
import wallet from '#/store/wallet';
import investment from '#/store/investment';
import security from '#/store/security';
import portfolio from '#/store/portfolio';
import support from '#/store/support';
import config from '#/store/config';
import blog from '#/store/blog';
import notifications from '#/store/notifications';
import dashboard from '#/store/dashboard';
import ppi from '#/store/ppi';

export default (state = {}, action) => {
  return {
    notifications: notifications(state.notifications, action),
    investment: investment(state.investment, action),
    onboarding: onboarding(state.onboarding, action),
    portfolio: portfolio(state.portfolio, action),
    dashboard: dashboard(state.dashboard, action),
    security: security(state.security, action),
    profile: profile(state.profile, action),
    support: support(state.support, action),
    wallet: wallet(state.wallet, action),
    config: config(state.config, action),
    blog: blog(state.blog, action),
    ppi: ppi(state.ppi, action),
  }
}