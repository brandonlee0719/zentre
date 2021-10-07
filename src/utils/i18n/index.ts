import i18n from "i18n-js";
import {
  I18nManager
} from 'react-native'
import memoize from "lodash.memoize";
import RNLocalize from "react-native-localize";

const translations = {
  "en": () => require("../../../translations/en.json"),
}

export const t = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
)

export function setI18nConfig() {
  const fallback = { languageTag: 'en', isRTL: false };
  const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translations)) || fallback

  t.cache.clear();
  I18nManager.forceRTL(isRTL)

  i18n.translations = { [languageTag]: translations[languageTag]() }

  i18n.locale = languageTag;
}