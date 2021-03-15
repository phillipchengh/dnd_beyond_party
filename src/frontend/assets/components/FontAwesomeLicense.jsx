import React from 'react';

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

  return (
    <Tooltip
      interactive
      leaveDelay={1000}
      leaveTouchDelay={1500}
      title={TooltipTitle}
    >
      <div className="font_awesome_license">
        <D20 />
      </div>
    </Tooltip>
  );
}

export default FontAwesomeLicense;
