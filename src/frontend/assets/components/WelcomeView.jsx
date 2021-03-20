import React from 'react';
import PropTypes from 'prop-types';

import ImportWizard from './ImportWizard/ImportWizard';
import FontAwesomeLicense from './FontAwesomeLicense';

import './WelcomeView.less';

export function WelcomeView({ onDone }) {
  return (
    <div className="welcome_view">
      <header className="header_wrapper">
        <h1 className="title">Welcome to D&D Beyond Party</h1>
      </header>
      <FontAwesomeLicense />
      <main>
        <ImportWizard
          onDone={onDone}
          showWelcomeMessage
        />
      </main>
    </div>
  );
}

WelcomeView.propTypes = {
  onDone: PropTypes.func.isRequired,
};

export default WelcomeView;
