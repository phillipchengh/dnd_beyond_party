export const AUTO_UPDATE_OFF = {
  display: 'Off',
  value: null,
};

// value units in seconds
export const AUTO_UPDATE_OPTIONS = [
  AUTO_UPDATE_OFF,
  {
    display: '5s',
    value: 5,
  },
  {
    display: '10s',
    value: 10,
  },
  {
    display: '30s',
    value: 30,
  },
  {
    display: '1m',
    value: 60,
  },
  {
    display: '5m',
    value: 300,
  },
  {
    display: '15m',
    value: 900,
  },
  {
    display: '30m',
    value: 1800,
  },
  {
    display: '1h',
    value: 3600,
  },
];
