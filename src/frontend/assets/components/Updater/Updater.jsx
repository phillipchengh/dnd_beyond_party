import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import PartyContext from '@assets/party/Context';
import { actions } from '@assets/party/ducks';
import { updateCurrentCampaign } from '@assets/party/sideEffects';
import { getError } from '@assets/party/selectors';

// units in seconds
const TEN_SECONDS = 10;
const ONE_MINUTE = 60;

export function Updater() {
  const context = useContext(PartyContext);
  const { dispatch, state } = context;
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [autoUpdate, setAutoUpdate] = useState(null);
  const [requestError, setRequestError] = useState(null);

  const handleUpdate = useCallback(() => {
    try {
      updateCurrentCampaign(context);
      setSecondsElapsed(0);
    } catch (e) {
      setRequestError(e.message);
    }
  }, [context]);

  const clearErrors = () => {
    dispatch(actions.clearError());
    setRequestError(null);
  };

  const handleAutoUpdate = (intervalSeconds) => () => {
    clearErrors();
    setAutoUpdate(intervalSeconds);
  };

  const error = requestError || getError(state);
  // don't continue auto update if there's an error
  const runAutoUpdate = autoUpdate && !error;

  useEffect(() => {
    let intervalId = null;
    if (runAutoUpdate) {
      intervalId = setInterval(() => {
        // need to reference the previous seconds value due to stale state in useEffect
        setSecondsElapsed((prevSecondsElapsed) => (prevSecondsElapsed + 1));
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [runAutoUpdate]);

  useEffect(() => {
    if (runAutoUpdate && secondsElapsed >= autoUpdate) {
      handleUpdate();
    }
  }, [autoUpdate, handleUpdate, runAutoUpdate, secondsElapsed]);

  return (
    <>
      <p>Current Campaign Updaters</p>
      <button onClick={handleUpdate} type="button">Update Manually</button>
      <button onClick={handleAutoUpdate(TEN_SECONDS)} type="button">Auto-Update Every 10 Seconds</button>
      <button onClick={handleAutoUpdate(ONE_MINUTE)} type="button">Auto-Update Every Minute</button>
      <button onClick={handleAutoUpdate(null)} type="button">Turn off Auto-Update</button>
      {autoUpdate && <p>{`Auto updating current campaign in ${autoUpdate - secondsElapsed} seconds.`}</p>}
      <p>{`Waited ${secondsElapsed} seconds.`}</p>
      {error && (
        <p>{error}</p>
      )}
    </>
  );
}

export default Updater;
