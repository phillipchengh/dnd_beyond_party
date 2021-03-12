import React from 'react';

import WizardMessage from './WizardMessage';

import './WizardMessageLoading.less';

export function WizardMessageLoading() {
  return (
    <WizardMessage className="wizard_message_loading" scrollIntoView>
      {/* for unsighted users */}
      <span className="loading_text">Loading</span>
      <span className="typing_dot" />
      <span className="typing_dot" />
      <span className="typing_dot" />
    </WizardMessage>
  );
}

export default WizardMessageLoading;
