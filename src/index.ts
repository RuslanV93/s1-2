import { app } from './app';
import SETTINGS from './settings';
import { runDB } from './db/db';

const PORT = SETTINGS.PORT;

app.listen(PORT, async () => {
  await runDB();
  console.log(`Server started at ${PORT} port`);
});
