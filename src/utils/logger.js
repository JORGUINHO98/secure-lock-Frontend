/**
 * Logger utility to manage console logs based on environment.
 * Only logs if __DEV__ is true.
 */

const logger = {
  log: (...args) => {
    if (__DEV__) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (__DEV__) {
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (__DEV__) {
      console.warn(...args);
    }
  },
  info: (...args) => {
    if (__DEV__) {
      console.info(...args);
    }
  },
};

export default logger;
