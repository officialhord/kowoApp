import AsyncStorage from '@react-native-async-storage/async-storage';

  export const setLocalData = async ( key, value ) => {
    try {
      await AsyncStorage.setItem(key, ((typeof(value) === 'object') ? JSON.stringify(value) : value) );
      return value;
    } catch (e) {
      // saving error
      return null;
    }
  };

  export const getLocalData = async ( key ) => {
    try {
      const stored = await AsyncStorage.getItem(key);
      if(stored !== null) {
        // value previously stored
        return (parseNested(stored));
      }
      return null;
    } catch(e) {
      // error reading value
      return null;
    }
  };

  export const delLocalData = async ( key ) => {
    try {
      await AsyncStorage.removeItem(key)
      return true;
    } catch(e) {
      // remove error
      return null;
    }
  };

  export const getAllKeys = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch(e) {
      // read key error
    }
  }

  //Functions
  
  function parseNested(str) {
    try {
        return JSON.parse(str, (_, val) => {
            if (typeof val === 'string')
                return parseNested(val)
            return val
        })
    } catch (exc) {
        return str
    }
}