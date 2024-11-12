import { app } from './app';
import SETTINGS from './settings';

const PORT = SETTINGS.PORT;
app.listen(PORT, () => {
  console.log(`Server started at ${PORT} port`);
});
