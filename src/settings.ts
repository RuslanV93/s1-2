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
  STATUSES: {
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    NOT_FOUNT_404: 404,
    CREATED_201: 201,
    OK_200: 200,
    NO_CONTENT_204: 204,
  },
};
export default SETTINGS;
