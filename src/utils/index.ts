import LocalStorage from './Storage'
import {
  GENDER,
  AUTH,
  MEMBER_STATUS,
  STAFF_STATUS
} from './Constants'
import {
  isEmailValid,
  generateUniqueId,
  copyFile,
  generatePath,
  checkIfFileExist,
  checkIfHasInvalidChar
} from './helpers'

export { t, setI18nConfig } from './i18n'
export { useAppDispatch, useAppSelector } from './store/hooks'
export { LocalStorage }
export { GENDER, AUTH, MEMBER_STATUS, STAFF_STATUS }
export {
  isEmailValid,
  generateUniqueId,
  copyFile,
  generatePath,
  checkIfFileExist,
  checkIfHasInvalidChar
}

