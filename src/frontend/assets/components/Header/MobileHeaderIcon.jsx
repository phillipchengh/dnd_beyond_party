import React, { useState } from 'react';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import Dragon from '../Graphics/Dragon';
import Tooltip from '../Common/Tooltip';

import './MobileHeaderIcon.less';

export function MobileHeaderIcon() {
  const TooltipTitle = 'D&D Beyond Party';

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
            className="mobile_header_icon"
            onClick={handleOpen}
            type="button"
          >
            <Dragon />
          </button>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}

export default MobileHeaderIcon;
