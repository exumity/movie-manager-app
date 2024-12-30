export interface Configuration {
  mongoURI?: string;
  jwtAccessSecret?: string;
  jwtRefreshSecret?: string;
  jwtAccessTtlInSeconds?: number;
  JwtRefreshTtlInSeconds?: number;
}

export default (): Configuration => ({
  mongoURI: process.env.MONGO_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessTtlInSeconds: process.env.JWT_ACCESS_TTL_IN_SECONDS
    ? parseInt(process.env.JWT_ACCESS_TTL_IN_SECONDS)
    : undefined,
  JwtRefreshTtlInSeconds: process.env.JWT_REFRESH_TTL_IN_SECONDS
    ? parseInt(process.env.JWT_REFRESH_TTL_IN_SECONDS)
    : undefined,
});
