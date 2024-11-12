import { config } from 'dotenv';

config();
const SETTINGS = {
  PORT: process.env.PORT || 3004,
  AUTH: 'admin:qwerty',
  PATH: {
    DEFAULT: '/',
    VIDEOS: '/videos',
    POSTS: '/posts',
    BLOGS: '/blogs',
  },
};
export default SETTINGS;
