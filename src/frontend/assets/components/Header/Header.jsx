import React from 'react';
import PropTypes from 'prop-types';

import Updater from '../Updater/Updater';

import './Header.less';

export function Header({
  desktopNavOpen, onDesktopNavOpen, onMobileNavOpen,
}) {
  return (
    // 'header' is used elsewhere
    <header className="site_header">
      {!desktopNavOpen && (
        <button
          className="open_nav_button desktop_open_nav_button"
          onClick={onDesktopNavOpen}
          type="button"
        >
          Desktop Hamburger
        </button>
      )}
      <button
        className="open_nav_button mobile_open_nav_button"
        onClick={onMobileNavOpen}
        type="button"
      >
        Mobile Hamburger
      </button>
      <h1 className="header">D&D Beyond Party</h1>
      <Updater />
    </header>
  );
}

Header.propTypes = {
  desktopNavOpen: PropTypes.bool,
  onDesktopNavOpen: PropTypes.func.isRequired,
  onMobileNavOpen: PropTypes.func.isRequired,
};

Header.defaultProps = {
  desktopNavOpen: false,
};

export default Header;
