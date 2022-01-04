import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import BankTransferModal from './index';

const mockStore = configureStore([]);

describe('<BankTransferModal />', () => {
  test('renders the bank transfer modal component without props', () => {

    let store;

    store = mockStore({
      myState: 'sample text',
      getState: 'random'
    });

    const { queryByText } = render(
      <Provider store={store}>
        <MemoryRouter >
          <BankTransferModal />
        </MemoryRouter>
      </Provider>
      );

    expect(queryByText(/no account number yet/i)).toBeInTheDocument();
    expect(queryByText(/no account name yet/i)).toBeInTheDocument();
    expect(queryByText(/no bank name yet/i)).toBeInTheDocument();
  });

  test('renders the bank transfer modal component with props', () => {

    let store;

    store = mockStore({
      myState: 'sample text',
      getState: 'random'
    });

    const props = {
      details: {
        accountNumber: '098765432',
        accountName: 'jackson man',
        BankName: 'good bank'
      }
    }
    const { queryByText } = render(
      <Provider store={store}>
        <MemoryRouter >
          <BankTransferModal details={props.details}/>
        </MemoryRouter>
      </Provider>
      );

    expect(queryByText(/098765432/i)).toBeInTheDocument();
    expect(queryByText(/jackson man/i)).toBeInTheDocument();
    expect(queryByText(/good bank/i)).toBeInTheDocument();
  })
})