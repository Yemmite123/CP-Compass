import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Back from './index';

describe('<Back />', () => {
  test('renders the Back component', () => {

    const { queryByText } = render(
        <MemoryRouter >
          <Back />
        </MemoryRouter>
      );

    expect(queryByText(/Back/i)).toBeInTheDocument();
  });
})