import { Collection, MongoClient, ObjectId } from 'mongodb';
import { NewUserType, UserDbType } from '../features/users/types/usersTypes';
import { BlogDbType, NewBlogType } from '../features/blogs/types/blogsTypes';
import { NewPostType, PostDbType } from '../features/posts/types/postsTypes';
import {
  CommentDbType,
  NewCommentType,
} from '../features/comments/types/commentsTypes';
import { BLOGGERS_PLATFORM, DEVICE_CONTROL } from '../common/variables/variables';
import {
  ApiRequestControlDbType,
  NewApiRequestControlType,
} from '../features/devices/types/apiRequestControlTypes';
import { DeviceDbType, NewDeviceType } from '../features/devices/types/deviceTypes';
import mongoose from 'mongoose';
import SETTINGS from '../settings';

/** Init collection */
export let usersCollection: Collection<UserDbType | NewUserType>;
export let blogsCollection: Collection<BlogDbType | NewBlogType>;
export let postsCollection: Collection<PostDbType | NewPostType>;
export let commentsCollection: Collection<CommentDbType | NewCommentType>;
export let apiRequestsCollection: Collection<
  ApiRequestControlDbType | NewApiRequestControlType
>;
export let devicesCollection: Collection<DeviceDbType | NewDeviceType>;

let client: MongoClient;

const mongooseUrl =
  'mongodb+srv://ruslanvak93:3lWTPDW3SX3caJsA@cluster0.t6d7t.mongodb.net/bloggers-platform?retryWrites=true&w=majority&appName=Cluster0';
/** using mongoose */

export const runDb = async (url: string) => {
  client = new MongoClient(url);
  const db = client.db(BLOGGERS_PLATFORM.dbName);

  usersCollection = db.collection(BLOGGERS_PLATFORM.users);
  blogsCollection = db.collection(BLOGGERS_PLATFORM.blogs);
  postsCollection = db.collection(BLOGGERS_PLATFORM.posts);
  commentsCollection = db.collection(BLOGGERS_PLATFORM.comments);
  apiRequestsCollection = db.collection(DEVICE_CONTROL.apiRequestControl);
  devicesCollection = db.collection(DEVICE_CONTROL.devices);

  try {
    await client.connect();
    await mongoose.connect(url + '/' + BLOGGERS_PLATFORM.dbName);
    await db.command({ ping: 1 });
    console.log('Connected to DB');
    await apiRequestsCollection.createIndex({ date: 1 }, { expireAfterSeconds: 30 });
  } catch (err) {
    console.error(err);
    await client.close();
  }
};

export const stopDb = async () => {
  try {
    if (client) {
      await mongoose.disconnect();
      await client.close();
    }
  } catch (err) {
    console.error('Error while stopping the database:', err);
  }
};
