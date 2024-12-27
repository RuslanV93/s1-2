import { config } from 'dotenv';

config();

const SETTINGS = {
  PORT: process.env.PORT || 5000,
  WEBSITE_URL: process.env.WEBSITE_VERSEL_URL || 'http://localhost:3003',
  DB_URL: process.env.CLOUD_DB_URL,
  LOCAL_DB_URL: process.env.LOCAL_DB_URL,
  JWT_SECRET: process.env.JWT_SECRET || '123',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'secret',
  PATH: {
    DEFAULT: '/',
    TESTING: '/testing',
    AUTH: '/auth',
    VIDEOS: '/videos',
    USERS: '/users',
    POSTS: '/posts',
    BLOGS: '/blogs',
    COMMENTS: '/comments',
    CONFIRM_REGISTRATION: 'auth/registration-confirmation?code=',
  },
  EMAIL_PASS_CODE: process.env.EMAIL_PASS_CODE,
};
export default SETTINGS;
