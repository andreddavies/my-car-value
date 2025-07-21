import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'my-car-value-test.db.sqlite'));
  } catch (err) {
    console.log(err);
  }
});
