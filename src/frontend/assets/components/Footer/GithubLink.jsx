import React from 'react';

import Tooltip from '../Common/Tooltip';
import Github from '../Graphics/Github';

import './GithubLink.less';

const description = 'Visit the source of this magic on github';

export function GithubLink() {
  return (
    <Tooltip
      // these listeners suck for links
      // use only hover
      disableFocusListener
      disableTouchListener
      title={description}
    >
      <a className="github_link" href="https://github.com/phillipchengh/dnd_beyond_party">
        <span className="link_text">{description}</span>
        <Github />
      </a>
    </Tooltip>
  );
}

export default GithubLink;
