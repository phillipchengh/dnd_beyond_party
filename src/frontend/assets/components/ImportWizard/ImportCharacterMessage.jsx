import React, { useState } from 'react';
import PropTypes from 'prop-types';

import UserMessage from '../Message/UserMessage';

import './ImportCharacterMessage.less';

const validateCharacterId = (id) => {
  const intId = parseInt(id, 10);
  if (intId) {
    return intId;
  }
  const urlId = parseInt(id.match(/\/characters\/([0-9]+)/)?.[1], 10);
  return urlId ?? null;
};

export function ImportCharacterMessage({ onSubmit }) {
  const [input, setInput] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [validCharacterId, setValidCharacterId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validCharacterId) {
      setSubmitted(true);
      onSubmit(validCharacterId);
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setValidCharacterId(validateCharacterId(value));
    setInput(value);
  };

  const inputId = 'ddb_character_id';

  const ariaAttributes = {};

  const invalid = input && !validCharacterId;

  let labelText = 'Enter D&D Beyond Character';

  if (invalid) {
    labelText = 'Hmm, check your format.';
    ariaAttributes['aria-invalid'] = true;
    ariaAttributes['aria-describedby'] = 'hidden_error_text';
  } else if (validCharacterId) {
    labelText = 'That looks ready to import!';
  }

  return (
    <UserMessage>
      <form className="import_character" onSubmit={handleSubmit}>
        <label htmlFor={inputId}>{labelText}</label>
        <span
          aria-live="polite"
          className="hidden_error_text"
          id="hidden_error_text"
        >
          {invalid && labelText}
        </span>
        <div className="input_submit_wrapper">
          <input
            disabled={submitted}
            id={inputId}
            onChange={handleChange}
            placeholder="Character ID or Link"
            required
            type="text"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...ariaAttributes}
          />
          <button
            className="submit_button"
            disabled={!validCharacterId || submitted}
            type="submit"
          >
            Import
          </button>
        </div>
      </form>
    </UserMessage>
  );
}

ImportCharacterMessage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ImportCharacterMessage;
