import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { MenuItem as MaterialMenuItem } from '@material-ui/core';

import './MenuItem.less';

// forward ref to play nice with Material's Menu
// https://stackoverflow.com/questions/56307332/how-to-use-custom-functional-components-within-material-ui-menu
export const MenuItem = forwardRef(({
  children, onClick, rootClass, selected,
}, ref) => (
  (
    <MaterialMenuItem
      classes={{
        root: `menu_item ${rootClass}`,
        selected: 'selected',
      }}
      onClick={onClick}
      selected={selected}
      ref={ref}
    >
      {children}
    </MaterialMenuItem>
  )
));

MenuItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
  rootClass: PropTypes.string,
  selected: PropTypes.bool.isRequired,
};

MenuItem.defaultProps = {
  rootClass: '',
};

export default MenuItem;
