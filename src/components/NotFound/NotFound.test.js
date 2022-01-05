import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './index';

describe('<NotFound />', () => {
  test('renders the not found component', () => {

    const { queryByText } = render(
      <MemoryRouter >
        <NotFound />
      </MemoryRouter>);

    expect(queryByText(/Page not found/i)).toBeInTheDocument();
  })
})