import React, { useState } from 'react';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import D20 from './Graphics/D20';
import Tooltip from './Common/Tooltip';

import './FontAwesomeLicense.less';

export function FontAwesomeLicense() {
  const TooltipTitle = (
    <span className="font_awesome_tooltip_blurb">
      {'Font Awesome tells me I need to share their '}
      <a className="font_awesome_link" href="https://fontawesome.com/license">license</a>
      {' for using their icons.'}
    </span>
  );

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      {/* div used for click away ref */}
      <div>
        <Tooltip
          disableFocusListener
          disableHoverListener
          disableTouchListener
          interactive
          leaveDelay={2000}
          leaveTouchDelay={2000}
          onClose={handleClose}
          open={open}
          title={TooltipTitle}
        >
          <button
            className="font_awesome_license"
            onClick={handleOpen}
            type="button"
          >
            <D20 />
          </button>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}

export default FontAwesomeLicense;
