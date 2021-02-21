import React from 'react';
import PropTypes from 'prop-types';

import { Menu as MaterialMenu } from '@material-ui/core';

import './Menu.less';

export function Menu({
  anchorEl, children, onClose, open,
}) {
  return (
    <MaterialMenu
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      classes={{
        list: 'list',
        paper: 'paper',
      }}
      getContentAnchorEl={null}
      onClose={onClose}
      open={open}
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      variant="selectedMenu"
    >
      {children}
    </MaterialMenu>
  );
}

Menu.propTypes = {
  anchorEl: PropTypes.shape({}),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

Menu.defaultProps = {
  anchorEl: null,
};

export default Menu;
