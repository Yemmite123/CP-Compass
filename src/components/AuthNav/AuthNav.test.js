import React from 'react';
import { render } from '@testing-library/react';
import AuthNav from './index';

describe('<AuthNav />', () => {
  test('renders the auth nav', () => {

    const { queryByText } = render(<AuthNav />);
    expect(queryByText(/CPInvest/i)).toBeInTheDocument();
  })
})