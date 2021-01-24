import React from 'react';

import Nav from './Nav/Nav';
import CurrentCampaign from './CurrentCampaign/CurrentCampaign';

import './Main.less';

export function Main() {
  return (
    <main className="main">
      <Nav />
      <CurrentCampaign />
    </main>
  );
}

export default Main;
