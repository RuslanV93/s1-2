import { Collection, Document, MongoClient } from 'mongodb';
import SETTINGS from '../settings';
import { BLOGGERS_PLATFORM } from '../common/variables/variables';

import { MongoMemoryServer } from 'mongodb-memory-server';
import { BlogDbType } from '../modules/blogs/types/blogsTypes';

/** Database Class */
export class Database {
  private client: MongoClient;
  private mongoUrl: string;
  constructor(mongoUrl: string) {
    this.mongoUrl = mongoUrl;
    this.client = new MongoClient(mongoUrl);
  }
  public async runDb() {
    try {
      await this.client.connect();
      console.log(this.mongoUrl);
      console.log('Database Connected');
      const adminDb = this.client.db().admin();
      const pingResult = await adminDb.command({ ping: 1 });
      console.log('Ping successful:', pingResult);
    } catch (error) {
      console.log('DB connection failed: ', error);
      await this.client.close();
    }
  }
  public async stopDB() {
    await this.client.close();
    console.log('DB connection closed.');
  }

  /** Database collections */
  public get bloggers_platform_db() {
    return this.client.db(BLOGGERS_PLATFORM.dbName);
  }
  public get blogsCollection() {
    return this.client
      .db(BLOGGERS_PLATFORM.dbName)
      .collection(BLOGGERS_PLATFORM.blogs);
  }
  public get postsCollection() {
    return this.client
      .db(BLOGGERS_PLATFORM.dbName)
      .collection(BLOGGERS_PLATFORM.posts);
  }
  public get commentsCollection() {
    return this.client
      .db(BLOGGERS_PLATFORM.dbName)
      .collection(BLOGGERS_PLATFORM.comments);
  }
  public get usersCollection() {
    return this.client
      .db(BLOGGERS_PLATFORM.dbName)
      .collection(BLOGGERS_PLATFORM.users);
  }
}

export const getDbUrl = async () => {
  if (process.env.NODE_ENV === 'test') {
    const server = await MongoMemoryServer.create();
    return server.getUri();
  }
  return SETTINGS.DB_URL || 'mongodb://0.0.0.0:27017';
};
// @ts-ignore
let bloggers_platform_db: Db;
let blogsCollection: Collection;
let postsCollection: Collection;
let commentsCollection: Collection;
let usersCollection: Collection;

const db = getDbUrl().then((url) => {
  const db = new Database(url);
  bloggers_platform_db = db.bloggers_platform_db;
  blogsCollection = db.blogsCollection;
  postsCollection = db.postsCollection;
  commentsCollection = db.commentsCollection;
  usersCollection = db.usersCollection;
});
export {
  blogsCollection,
  postsCollection,
  commentsCollection,
  usersCollection,
  bloggers_platform_db,
};
