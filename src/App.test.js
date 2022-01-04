import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const mockStore = configureStore([]);

describe('<Login />', () => {
  test('renders the login page', () => {

    let store;

    store = mockStore({
      myState: 'sample text',
      getState: 'random'
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    const loginContainer = container.querySelector('.login-page');
    expect(loginContainer).toBeInTheDocument();
  })
})
