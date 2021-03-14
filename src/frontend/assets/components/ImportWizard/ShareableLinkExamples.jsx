import React from 'react';

import './ShareableLinkExamples.less';

export function ShareableLinkExamples() {
  return (
    <div className="shareable_link_examples">
      <p>Or a shareable link like one of these:</p>
      <ul>
        <li>
          <a className="link" href="https://ddb.ac/characters/41160222/vj9Xaj">
            https://ddb.ac/characters/41160222/vj9Xaj
          </a>
        </li>
        <li>
          <a className="link" href="https://www.dndbeyond.com/profile/Scrubbery/characters/41160222">
            https://www.dndbeyond.com/profile/Scrubbery/characters/41160222
          </a>
        </li>
        <li>
          <a className="link" href="https://www.dndbeyond.com/characters/41160222">
            https://www.dndbeyond.com/characters/41160222
          </a>
        </li>
      </ul>
    </div>
  );
}

export default ShareableLinkExamples;
