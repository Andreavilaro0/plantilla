/**
 * Logger utility - conditionally logs based on environment
 * Only shows logs in development mode
 */

/**
 * Log messages (only in development)
 * @param {...any} args - Arguments to log
 */
export const log = (...args) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

/**
 * Log warnings (only in development)
 * @param {...any} args - Arguments to warn
 */
export const warn = (...args) => {
  if (import.meta.env.DEV) {
    console.warn(...args);
  }
};

/**
 * Log errors (always shown, even in production)
 * @param {...any} args - Arguments to error
 */
export const error = (...args) => {
  console.error(...args);
};
