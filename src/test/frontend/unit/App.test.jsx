import React from 'react';
import { render } from '@testing-library/react';
import { App } from '@assets/components/App';

describe('App', () => {
  it('renders without crashing', () => {
    // makes react-modal stop complaining about appElement
    document.body.innerHTML = '<div id="dnd_beyond_party_app"></div>';
    Element.prototype.scrollIntoView = jest.fn();
    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
