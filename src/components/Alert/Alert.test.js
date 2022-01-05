import React from 'react';
import { render } from '@testing-library/react';
import Alert from './index';

describe('<Alert />', () => {
  test('renders the alert component', () => {

    const props = {
      alert: {
        type: 'success',
        message: 'alert works'
      }
    }
    const { queryByText } = render(<Alert alert={props.alert} />);
    expect(queryByText(/alert works/i)).toBeInTheDocument();
  })
});
