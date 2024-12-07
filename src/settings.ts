import { config } from 'dotenv';

config();
const SETTINGS = {
  PORT: process.env.PORT || 5000,
  DB_URL: process.env.CLOUD_DB_URL,
  JWT_SECRET: process.env.JWT_SECRET || '123',
  PATH: {
    DEFAULT: '/',
    TESTING: '/testing',
    AUTH: '/auth',
    VIDEOS: '/videos',
    USERS: '/users',
    POSTS: '/posts',
    BLOGS: '/blogs',
    COMMENTS: '/comments',
  },
};
export default SETTINGS;
