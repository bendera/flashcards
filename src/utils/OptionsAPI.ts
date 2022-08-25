const STORAGE_KEY = 'simplecard_options';

export type OptionKey = 'boxes' | 'darkMode' | 'progress' | 'firstRun';

interface Options {
  boxes: boolean;
  darkMode: boolean;
  progress: boolean;
  firstRun: boolean;
}

const defaults: Options = {
  boxes: false,
  darkMode: false,
  progress: false,
  firstRun: true,
};

class OptionsAPI {
  public async setOption(name: OptionKey, value: boolean) {
    const prevContent = localStorage.getItem(STORAGE_KEY);
    const options = prevContent ? JSON.parse(prevContent) : defaults;
    const nextOptions = { ...options, [name]: value };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOptions));

    return nextOptions;
  }

  public async getAllOptions(): Promise<Options> {
    const content = localStorage.getItem(STORAGE_KEY);

    if (content) {
      return JSON.parse(content);
    }

    return defaults;
  }
}

export default OptionsAPI;
