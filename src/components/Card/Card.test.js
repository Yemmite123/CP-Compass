import React from 'react';
import { render } from '@testing-library/react';
import Card from './index';

describe('<Card />', () => {
  test('renders the alert component', () => {

    const Children = () => (<p>the card is here</p>)
    const props = {
      children: <Children />
    }
    const { queryByText } = render(
      <Card>
        {props.children}
      </Card>
    );
    expect(queryByText(/the card is here/i)).toBeInTheDocument();
  })
});
