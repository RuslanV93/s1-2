import { MongoClient } from 'mongodb';
import SETTINGS from '../settings';
import { BLOGGERS_PLATFORM } from '../variables/variables';
import {
  BlogDbType,
  BlogForUpdateType,
  BlogViewType,
  NewBlogType,
  NewPostType,
  PostDbType,
  PostForUpdateType,
  PostViewType,
} from '../types/db.type';

// export const db: DBType = {
//   posts: [],
//   blogs: [],
// };

// export const dbTest: DBType = {
//   posts: [
//     {
//       id: '1',
//       title: 'title1',
//       shortDescription: 'entertainment',
//       content: 'entertainment content',
//       blogId: '1',
//       blogName: 'Hello',
//     },
//   ],
//   blogs: [
//     {
//       id: '1',
//       name: 'Ruslan',
//       description: 'desc',
//       websiteUrl: 'https://gFBG5yy0Pb59.com',
//     },
//   ],
// };
const mongoUrl = SETTINGS.DB_URL || 'mongodb://0.0.0.0:27017';
export const client = new MongoClient(mongoUrl);
export const db = client.db(BLOGGERS_PLATFORM.dbName);
export const blogsCollection = db.collection(BLOGGERS_PLATFORM.blogs);
export const postsCollection = db.collection(BLOGGERS_PLATFORM.posts);
export async function runDB() {
  try {
    await client.connect();
    const adminDb = client.db().admin();
    const pingResult = await adminDb.command({ ping: 1 });
    console.log('Ping successful:', pingResult);
  } catch (error) {
    console.log('DB connection failed: ', error);
    await client.close();
  }
}
