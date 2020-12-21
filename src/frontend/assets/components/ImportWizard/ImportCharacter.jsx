import React, { useState } from 'react';
import PropTypes from 'prop-types';

const validateCharacterId = (id) => {
  const intId = parseInt(id, 10);
  if (intId) {
    return intId;
  }
  const urlId = parseInt(id.match(/\/characters\/([0-9]+)/)?.[1], 10);
  return urlId ?? null;
};

export function ImportCharacter({ onSubmit, requestError }) {
  const [input, setInput] = useState(null);
  const [validCharacterId, setValidCharacterId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validCharacterId) {
      onSubmit(validCharacterId);
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setValidCharacterId(validateCharacterId(value));
    setInput(value);
  };

  const inputId = 'ddb_character_id';

  return (
    <form onSubmit={handleSubmit}>
      <p>
        To import your campaign, please provide a public D&D Beyond character from your campaign.
      </p>
      <p>
        Acceptable formats listed below.
      </p>
      <dl>
        <dt>Character ID Number</dt>
        <dd>
          {'Example: '}
          <strong>
            41160222
          </strong>
        </dd>
        <dt>Shareable Links</dt>
        <dd>
          {'Examples: '}
          <ul>
            <li>
              <strong>
                https://ddb.ac/characters/41160222/vj9Xaj
              </strong>
            </li>
            <li>
              <strong>
                https://www.dndbeyond.com/profile/Scrubbery/characters/41160222
              </strong>
            </li>
            <li>
              <strong>
                https://www.dndbeyond.com/characters/41160222
              </strong>
            </li>
          </ul>
        </dd>
      </dl>
      <label htmlFor={inputId}>D&D Beyond Character Info</label>
      <br />
      <input
        id={inputId}
        onChange={handleChange}
        placeholder="D&D Beyond Character ID"
        required
        type="text"
      />
      <button type="submit">Import</button>
      {input && !validCharacterId && (
        <p>Not a valid input.</p>
      )}
      {requestError && (
        <p>{requestError}</p>
      )}
    </form>
  );
}

ImportCharacter.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  requestError: PropTypes.string,
};

ImportCharacter.defaultProps = {
  requestError: null,
};

export default ImportCharacter;
