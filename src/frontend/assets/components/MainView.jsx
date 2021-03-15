import React, { useContext, useState } from 'react';

import PartyContext from '@assets/party/Context';
import { getError } from '@assets/party/selectors';

import Header from './Header/Header';
import Nav from './Nav/Nav';
import CurrentCampaign from './CurrentCampaign/CurrentCampaign';
import WizardMessageDanger from './Message/WizardMessageDanger';

import './MainView.less';

export function MainView() {
  const { state } = useContext(PartyContext);

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

  const mainClasses = ['main_view'];
  if (desktopNavOpen) {
    mainClasses.push('desktop_nav_open');
  } else {
    mainClasses.push('desktop_nav_close');
  }

  const [updateError, setUpdateError] = useState(null);

  const handleUpdateError = (errorMessage) => {
    setUpdateError(errorMessage);
  };

  const error = updateError || getError(state);

  return (
    <>
      <div className={mainClasses.join(' ')}>
        <Header
          desktopNavOpen={desktopNavOpen}
          onDesktopNavOpen={handleDesktopNavOpen}
          onMobileNavOpen={handleMobileNavOpen}
          onUpdateError={handleUpdateError}
        />
        <main>
          {error && (
            <WizardMessageDanger className="global_error_message">
              <p>
                {error}
              </p>
            </WizardMessageDanger>
          )}
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

export default MainView;
