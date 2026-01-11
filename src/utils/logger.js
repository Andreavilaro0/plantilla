/**
 * Logger utility - conditionally logs based on environment
 * Only shows logs in development mode
 */

/**
 * Log messages (only in development)
 * @param {...any} args - Arguments to log
 */
export const log = (...args) => {
  // Logs silenciados
};

export const warn = (...args) => {
  // Advertencias silenciadas
};

/**
 * Log errors (always shown, even in production)
 * @param {...any} args - Arguments to error
 */
export const error = (...args) => {
  console.error(...args);
};
