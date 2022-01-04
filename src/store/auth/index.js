import login from '#/store/login'
import register from '#/store/register'

export default (state = {}, action) => {
  return {
    login: login(state.login, action),
    register: register(state.register, action),
  }
}