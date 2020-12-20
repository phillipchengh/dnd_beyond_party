import React, { useContext, useEffect, useState } from 'react';

import PartyContext from '@assets/party/Context';
import { updateCurrentCampaign } from '@assets/party/sideEffects';

// units in seconds
const TEN_SECONDS = 10;
const ONE_MINUTE = 60;

export function Updater() {
  const context = useContext(PartyContext);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [autoUpdate, setAutoUpdate] = useState(null);

  const handleManualUpdate = async () => {
    updateCurrentCampaign(context);
    setSecondsElapsed(0);
  };

  const handleAutoUpdate = (intervalSeconds) => () => {
    setAutoUpdate(intervalSeconds);
  };

  useEffect(() => {
    let intervalId = null;
    if (autoUpdate) {
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
  }, [autoUpdate]);

  useEffect(() => {
    if (autoUpdate && secondsElapsed >= autoUpdate) {
      updateCurrentCampaign(context);
      setSecondsElapsed(0);
    }
  }, [autoUpdate, secondsElapsed, context]);

  return (
    <>
      <p>Current Campaign Updaters</p>
      <button onClick={handleManualUpdate} type="button">Update Manually</button>
      <button onClick={handleAutoUpdate(TEN_SECONDS)} type="button">Auto-Update Every 10 Seconds</button>
      <button onClick={handleAutoUpdate(ONE_MINUTE)} type="button">Auto-Update Every Minute</button>
      <button onClick={handleAutoUpdate(null)} type="button">Turn off Auto-Update</button>
      {autoUpdate && <p>{`Auto updating current campaign in ${autoUpdate - secondsElapsed} seconds.`}</p>}
      <p>{`Waited ${secondsElapsed} seconds.`}</p>
    </>
  );
}

export default Updater;
