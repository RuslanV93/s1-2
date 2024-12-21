// const mongoUrl = SETTINGS.DB_URL || 'mongodb://0.0.0.0:27017';
// export const client = new MongoClient(mongoUrl);
// export const db = client.db(BLOGGERS_PLATFORM.dbName);
// export const blogsCollection = db.collection(BLOGGERS_PLATFORM.blogs);
// export const postsCollection = db.collection(BLOGGERS_PLATFORM.posts);
// export const usersCollection = db.collection(BLOGGERS_PLATFORM.users);
// export const commentsCollection = db.collection(BLOGGERS_PLATFORM.comments);
//
// export async function runDB() {
//   try {
//     await client.connect();
//
//     const adminDb = client.db().admin();
//     const pingResult = await adminDb.command({ ping: 1 });
//     console.log('Ping successful:', pingResult);
//   } catch (error) {
//     console.log('DB connection failed: ', error);
//     await client.close();
//   }
// }
