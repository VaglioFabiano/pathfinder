import * as FileSystem from 'expo-file-system';
import {Asset} from 'expo-asset';
import * as SQLite from 'expo-sqlite';

const dbPath = `${FileSystem.documentDirectory}db.db`;

async function copyDatabasefile() {
  await FileSystem.deleteAsync(dbPath,{idempotent: true});
  const asset = Asset.fromModule(require('../assets/db.db'));
  await asset.downloadAsync();
  await FileSystem.moveAsync({
    from: asset.localUri ? asset.localUri : '',
    to: dbPath,
  });
}

async function openDatabase() {
  await copyDatabasefile();
  return await SQLite.openDatabaseAsync('db.db', undefined, `${FileSystem.documentDirectory}`);
}

const getDatabase = (() => {
  let dbIstance: any = null;

  return async () => {
    if (!dbIstance) {
      dbIstance = await openDatabase();
    }
    return dbIstance;
  };
})();

export default getDatabase;