import { Collection, MongoClient } from 'mongodb';
import SETTINGS from '../settings';
import { BLOGGERS_PLATFORM } from '../common/variables/variables';
import {
  BlogDbType,
  BlogForUpdateType,
  BlogViewType,
  NewBlogType,
} from '../modules/blogs/types/blogsTypes';
import {
  NewPostType,
  PostDbType,
  PostForUpdateType,
  PostViewType,
} from '../modules/posts/types/postsTypes';

// const mongoUrl = SETTINGS.DB_URL || 'mongodb://0.0.0.0:27017';
// export const client = new MongoClient(mongoUrl);
// export const db = client.db(BLOGGERS_PLATFORM.dbName);
// export const blogsCollection = db.collection(BLOGGERS_PLATFORM.blogs);
// export const postsCollection = db.collection(BLOGGERS_PLATFORM.posts);
// export const usersCollection = db.collection(BLOGGERS_PLATFORM.users);
// export const commentsCollection = db.collection(BLOGGERS_PLATFORM.comments);
// export async function runDB() {
//   try {
//     await client.connect();
//     const adminDb = client.db().admin();
//     const pingResult = await adminDb.command({ ping: 1 });
//     console.log('Ping successful:', pingResult);
//   } catch (error) {
//     console.log('DB connection failed: ', error);
//     await client.close();
//   }
// }

export class DB {
  constructor(public uri: string) {
    this.mongoClient = new MongoClient(uri);
  }
  public mongoClient: MongoClient;
  public db: any;
  public blogsCollection: Collection<Document> | undefined;
  public postsCollection: Collection<Document> | undefined;
  public usersCollection: Collection<Document> | undefined;
  public commentsCollection: Collection<Document> | undefined;

  async runDB() {
    try {
      await this.mongoClient.connect();
      const adminDb = this.mongoClient.db().admin();
      const pingResult = await adminDb.command({ ping: 1 });
      this.db = this.mongoClient.db(BLOGGERS_PLATFORM.dbName);
      this.blogsCollection = this.db.collection(BLOGGERS_PLATFORM.blogs);
      this.postsCollection = this.db.collection(BLOGGERS_PLATFORM.posts);
      this.usersCollection = this.db.collection(BLOGGERS_PLATFORM.users);
      this.commentsCollection = this.db.collection(BLOGGERS_PLATFORM.comments);

      console.log('Ping successful:', pingResult);
    } catch (error) {
      console.log('DB connection failed: ', error);
      await this.mongoClient.close();
    }
  }
}
