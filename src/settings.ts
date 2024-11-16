import { config } from 'dotenv';

config();
const SETTINGS = {
  PORT: process.env.PORT || 5000,
  PATH: {
    DEFAULT: '/',
    TESTING: '/testing',
    VIDEOS: '/videos',
    POSTS: '/posts',
    BLOGS: '/blogs',
  },
};
export default SETTINGS;
