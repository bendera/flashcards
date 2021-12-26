/* eslint-disable no-undef */
class StorageWrapper {
  private sync = false;

  private storageImpl: 'chromeExt' | 'ffExt' | 'localStorage';

  constructor() {
    // TODO: ffExt
    if (chrome && chrome.storage) {
      this.storageImpl = 'chromeExt';
    } else {
      this.storageImpl = 'localStorage';
    }
  }

  setItem(key: string, value: unknown): Promise<unknown> {
    if (this.storageImpl === 'chromeExt') {
      const storage = this.sync ? chrome.storage.sync : chrome.storage.local;

      return new Promise((resolve, reject) => {
        storage.set({ [key]: value }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(value);
          }
        });
      });
    }

    return new Promise((resolve, reject) => {
      try {
        const json = JSON.stringify(value);

        localStorage.setItem(key, json);
        resolve(value);
      } catch (error) {
        reject(error);
      }
    });
  }

  getItem(key: string): Promise<unknown> {
    if (this.storageImpl === 'chromeExt') {
      const storage = this.sync ? chrome.storage.sync : chrome.storage.local;

      return new Promise((resolve, reject) => {
        storage.get(key, (value) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(value);
          }
        });
      });
    }

    return new Promise((resolve, reject) => {
      try {
        const json = localStorage.getItem(key);
        const value = JSON.parse(json as string);

        resolve(value);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default StorageWrapper;
