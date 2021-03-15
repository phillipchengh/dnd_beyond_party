import React from 'react';
import PropTypes from 'prop-types';

import Updater from '../Updater/Updater';
import OpenNavButton from './OpenNavButton';
import Tooltip from '../Common/Tooltip';
import Dragon from '../Graphics/Dragon';

import './Header.less';

export function Header({
  desktopNavOpen, onDesktopNavOpen, onMobileNavOpen, onUpdateError,
}) {
  return (
    // 'header' is used elsewhere
    <header className="site_header">
      {!desktopNavOpen && (
        <OpenNavButton
          className="desktop_open_nav_button"
          onClick={onDesktopNavOpen}
        />
      )}
      <OpenNavButton
        className="mobile_open_nav_button"
        onClick={onMobileNavOpen}
      />
      <h1 className="header">
        <div className="header_text">D&D Beyond Party</div>
        <Tooltip title="D&D Beyond Party">
          <div className="icon_wrapper">
            <Dragon />
          </div>
        </Tooltip>
      </h1>
      <Updater onUpdateError={onUpdateError} />
    </header>
  );
}

Header.propTypes = {
  desktopNavOpen: PropTypes.bool,
  onDesktopNavOpen: PropTypes.func.isRequired,
  onMobileNavOpen: PropTypes.func.isRequired,
  onUpdateError: PropTypes.func.isRequired,
};

Header.defaultProps = {
  desktopNavOpen: false,
};

export default Header;
