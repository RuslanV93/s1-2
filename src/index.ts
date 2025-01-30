import { app } from './app';
import SETTINGS from './settings';
import { runDb } from './db/db';
const PORT = SETTINGS.PORT;
//@ts-ignore
const url: string = SETTINGS.LOCAL_DB_URL;

app.listen(PORT, async () => {
  await runDb(url);
  console.log(`Server started at ${PORT} port`);
});
