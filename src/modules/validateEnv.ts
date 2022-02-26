/**
 * Module to confirm required .env values are set.
 *
 * @returns { boolean } Whether all values are present or not.
 */
export const validateEnv = () => {
  return (
    !!process.env.DISCORD_TOKEN &&
    !!process.env.MONGO_URI &&
    !!process.env.SENTRY_DSN
  );
};
