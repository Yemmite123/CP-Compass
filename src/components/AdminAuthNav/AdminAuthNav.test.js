import React from 'react';
import { render } from '@testing-library/react';
import AdminAuthNav from './index';

describe('<AdminAuthNav />', () => {
  test('renders the admin auth nav', () => {

    const { queryByText } = render(<AdminAuthNav />);
    expect(queryByText(/CPInvest/i)).toBeInTheDocument();
  })
})