import React, { useState } from 'react';

import Header from './Header/Header';
import Nav from './Nav/Nav';
import CurrentCampaign from './CurrentCampaign/CurrentCampaign';

import './Main.less';

export function Main() {
  const [desktopNavOpen, setDesktopNavOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleDesktopNavOpen = () => {
    setDesktopNavOpen(true);
  };

  const handleDesktopNavClose = () => {
    setDesktopNavOpen(false);
  };

  const handleMobileNavOpen = () => {
    setMobileNavOpen(true);
  };

  const handleMobileNavClose = () => {
    setMobileNavOpen(false);
  };

  const mainClasses = ['main'];
  if (desktopNavOpen) {
    mainClasses.push('desktop_nav_open');
  } else {
    mainClasses.push('desktop_nav_close');
  }

  return (
    <>
      <div className={mainClasses.join(' ')}>
        <Header
          desktopNavOpen={desktopNavOpen}
          onDesktopNavOpen={handleDesktopNavOpen}
          onMobileNavOpen={handleMobileNavOpen}
        />
        <main>
          <CurrentCampaign />
        </main>
      </div>
      <Nav
        desktopOpen={desktopNavOpen}
        mobileOpen={mobileNavOpen}
        onDesktopClose={handleDesktopNavClose}
        onDesktopOpen={handleDesktopNavOpen}
        onMobileClose={handleMobileNavClose}
        onMobileOpen={handleMobileNavOpen}
      />
    </>
  );
}

export default Main;
