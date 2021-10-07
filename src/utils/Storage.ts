import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

class LocalStorage {
  private static instance: LocalStorage;
  private readonly storage: Storage
  private constructor() {
    this.storage = new Storage({
      size: 1000,
      storageBackend: AsyncStorage,
      defaultExpires: null, // never expire
      enableCache: true,
      sync: {

      }
    })
  }

  public static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  public save(key: string, data: any, expire?: number) {
    this.storage.save({
      key: key,
      data: data,
      expires: expire || 1000 * 3600 * 12 // 12 hour
    })
  }

  public load(key: string): Promise<any> {
    return new Promise(resolve => {
      this.storage.load({
        key: key,
        autoSync: true,
        syncInBackground: true,
      }).then(ret => {
        return resolve(ret)
      }).catch(err => {
        switch (err.name) {
          case 'NotFoundError':
            break
          case 'ExpiredError':
            break
        }
        return resolve(undefined)
      })
    })
  }
}

export default LocalStorage