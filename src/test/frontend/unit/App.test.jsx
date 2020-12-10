import React from 'react';
import { render } from '@testing-library/react';
import { App } from '@assets/components/App';

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
