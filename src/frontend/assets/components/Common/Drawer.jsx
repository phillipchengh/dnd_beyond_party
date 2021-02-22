import React from 'react';
import PropTypes from 'prop-types';

import { SwipeableDrawer as MaterialDrawer } from '@material-ui/core';

import './Drawer.less';

export function Drawer({
  children, onClose, onOpen, open, rootClass, variant,
}) {
  return (
    <MaterialDrawer
      classes={{
        paper: 'paper',
        root: `root ${rootClass}`,
      }}
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      variant={variant}
    >
      {children}
    </MaterialDrawer>
  );
}

Drawer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  open: PropTypes.bool,
  rootClass: PropTypes.string,
  variant: PropTypes.string,
};

Drawer.defaultProps = {
  onClose: () => {},
  onOpen: () => {},
  open: true,
  rootClass: '',
  variant: 'persistent',
};

export default Drawer;
