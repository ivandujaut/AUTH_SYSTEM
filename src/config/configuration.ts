export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  environment: process.env.NODE_ENV || 'development',
});
