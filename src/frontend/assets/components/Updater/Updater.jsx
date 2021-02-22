import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import PartyContext from '@assets/party/Context';
import { actions } from '@assets/party/ducks';
import { updateCurrentCampaign } from '@assets/party/sideEffects';
import { getError, hasCurrentCampaign } from '@assets/party/selectors';

import Menu from '../Common/Menu';
import MenuItem from '../Common/MenuItem';
import Tooltip from '../Common/Tooltip';

import Caret from '../Graphics/Caret';
import D6 from '../Graphics/D6';
import Refresh from '../Graphics/Refresh';

import './Updater.less';

import {
  AUTO_UPDATE_OFF,
  AUTO_UPDATE_OPTIONS,
} from './utilities';

export function Updater() {
  const context = useContext(PartyContext);
  const { dispatch, state } = context;
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [autoUpdate, setAutoUpdate] = useState(AUTO_UPDATE_OFF);

  const { value: autoUpdateValue, display: autoUpdateDisplay } = autoUpdate;

  // checks if there's actually a current campaign selected
  const hasCurrentCampaignToUpdate = hasCurrentCampaign(state);

  const clearErrors = useCallback(() => {
    dispatch(actions.clearError());
    setRequestError(null);
  }, [dispatch]);

  const handleUpdate = useCallback(async () => {
    if (isUpdating || !hasCurrentCampaignToUpdate) {
      return;
    }
    setIsUpdating(true);
    clearErrors();
    try {
      await updateCurrentCampaign(context);
      setSecondsElapsed(0);
    } catch (e) {
      setRequestError(e.message);
    } finally {
      setIsUpdating(false);
    }
  }, [clearErrors, context, hasCurrentCampaignToUpdate, isUpdating]);

  const handleAutoUpdate = (intervalSeconds) => {
    clearErrors();
    setAutoUpdate(intervalSeconds);
  };

  const error = requestError || getError(state);
  // don't continue auto update if there's an error
  const runAutoUpdate = autoUpdateValue && !error && hasCurrentCampaignToUpdate;

  useEffect(() => {
    let intervalId = null;
    if (runAutoUpdate) {
      intervalId = setInterval(() => {
        // need to reference the previous seconds value due to stale state in useEffect
        setSecondsElapsed((prevSecondsElapsed) => (prevSecondsElapsed + 5));
      }, 5000); // updating too often leads to poor performance... 5 seconds seems okay
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [runAutoUpdate]);

  useEffect(() => {
    if (runAutoUpdate && secondsElapsed >= autoUpdateValue) {
      handleUpdate();
    }
  }, [autoUpdateValue, handleUpdate, runAutoUpdate, secondsElapsed]);

  const [menuAnchorElement, setMenuAnchorElement] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorElement(null);
  };

  const handleMenuSelect = (autoUpdateSelection) => () => {
    handleAutoUpdate(autoUpdateSelection);
    setMenuAnchorElement(null);
  };

  const isMenuOpen = !!menuAnchorElement;

  let tooltipText;

  if (isUpdating) {
    tooltipText = 'Updating Campaign!';
  } else if (runAutoUpdate) {
    const waitTotalSeconds = autoUpdateValue - secondsElapsed;
    const waitMinutes = Math.max(Math.floor(waitTotalSeconds / 60), 0);
    const waitSeconds = Math.max(waitTotalSeconds - (waitMinutes * 60), 0);
    const waitTime = `${waitMinutes ? `${waitMinutes}m` : ''} ${waitSeconds}s`;

    tooltipText = `Updating Campaign in about ${waitTime}`;
  } else {
    tooltipText = 'Update Campaign';
  }

  return (
    <div className="updater">
      <div className="update_buttons">
        <Tooltip
          title={tooltipText}
        >
          <button
            className={`manual_update_button ${runAutoUpdate ? 'auto_update_on' : 'auto_update_off'} ${isUpdating ? 'is_updating' : ''}`}
            onClick={handleUpdate}
            type="button"
          >
            <Refresh />
            <span className="button_text">Update Manually</span>
          </button>
        </Tooltip>
        <Tooltip
          title="Set Auto Update"
        >
          <button
            className={`auto_update_button ${isMenuOpen ? 'open' : 'close'}`}
            onClick={handleMenuOpen}
            type="button"
          >
            <div className="button_text">{autoUpdateDisplay}</div>
            <Caret />
          </button>
        </Tooltip>
      </div>
      <Menu
        anchorEl={menuAnchorElement}
        onClose={handleMenuClose}
        open={isMenuOpen}
        variant="selectedMenu"
      >
        {AUTO_UPDATE_OPTIONS.map(({ display, value }) => {
          const isSelected = value === autoUpdateValue;
          return (
            <MenuItem
              rootClass={`${value ? 'on' : 'off'}`}
              onClick={handleMenuSelect({ display, value })}
              key={value}
              selected={isSelected}
            >
              <div className="display_value">
                {display}
                <div className="selected_icon">
                  <D6 />
                </div>
              </div>
            </MenuItem>
          );
        })}
      </Menu>
      {error && (
        <p>{error}</p>
      )}
    </div>
  );
}

export default Updater;
