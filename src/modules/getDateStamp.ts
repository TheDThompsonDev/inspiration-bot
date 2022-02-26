/**
 * Module to generate a Discord timestamp based on the provided hour.
 *
 * @param {number} hour The specific hour to show in the timestamp.
 * @returns {string} A Discord-formatted timestamp string.
 */
export const getDateStamp = (hour: number): string => {
  const dateNow = new Date(Date.now());
  const date = Date.UTC(
    dateNow.getUTCFullYear(),
    dateNow.getUTCMonth(),
    dateNow.getUTCDate(),
    hour
  );
  const timestamp = `<t:${date / 1000}:t>`;
  return timestamp;
};
