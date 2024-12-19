import { getApp } from './app';
import SETTINGS from './settings';
import { runDB } from './db/db';

const PORT = SETTINGS.PORT;
const app = getApp();
app.listen(PORT, async () => {
  await runDB();
  console.log(`Server started at ${PORT} port`);
});
