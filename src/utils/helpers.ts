import RNFS from 'react-native-fs'

const CACHE_DIR = RNFS.CachesDirectoryPath + '/'

export const invalidChars = ['"', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', "'"]

export const generateUniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const generatePath = () => {
  return CACHE_DIR + generateUniqueId()
}

export const checkIfHasInvalidChar = (value): boolean => {
  let isInclude = false
  for (let index = 0; index < invalidChars.length; index++) {
    if (value.includes(invalidChars[index])) {
      isInclude = true
    }
  }

  return isInclude
}

export const isEmailValid = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const copyFile = (filePath: string, destPath: string): Promise<void> => {
  return new Promise(resolve => {
    RNFS.copyFile(filePath, destPath)
      .then(res => {
        resolve()
        console.debug('Success-CopyFile: ', res)
      }).catch(err => {
        resolve()
        console.debug('Error-CopyFile: ', err)
      })
  })
}

export const checkIfFileExist = (filePath: string) => {
  RNFS.exists(filePath)
    .then(res => {
      console.debug('Success: ', res)
    })
    .catch(err => {
      console.debug('Error-CheckIfFileExist: ', err)
    })
}