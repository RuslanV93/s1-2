import { app } from './app';
import SETTINGS from './settings';
import { Database } from './db/db';

const PORT = SETTINGS.PORT;

export const indexDb = new Database(SETTINGS.DB_URL || 'mongodb://0.0.0.0:27017');

app.listen(PORT, async () => {
  await indexDb.runDb();
  console.log(`Server started at ${PORT} port`);
});
