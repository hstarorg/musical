// import * as Localization from 'expo-localization';
import {I18n, TranslateOptions} from 'i18n-js';
import {I18nManager} from 'react-native';

// if English isn't your default language, move Translations to the appropriate language file.
import en, {Translations} from './en';

// console.log(_i18n);

const i18n = new I18n();

// i18n. = true;

// to use regional locales use { "en-US": enUS } etc
i18n.translations = {en, 'en-US': en};

const fallbackLocale = 'en-US';
// const systemLocale = Localization.getLocales()[0];
const systemLocale: any = {};
const systemLocaleTag = systemLocale?.languageTag ?? 'en-US';

if (Object.prototype.hasOwnProperty.call(i18n.translations, systemLocaleTag)) {
  // if specific locales like en-FI or en-US is available, set it
  i18n.locale = systemLocaleTag;
} else {
  // otherwise try to fallback to the general locale (dropping the -XX suffix)
  const generalLocale = systemLocaleTag.split('-')[0];
  if (Object.prototype.hasOwnProperty.call(i18n.translations, generalLocale)) {
    i18n.locale = generalLocale;
  } else {
    i18n.locale = fallbackLocale;
  }
}

// handle RTL languages
export const isRTL = systemLocale?.textDirection === 'rtl';
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

/**
 * Builds up valid keypaths for translations.
 */
export type TxKeyPath = RecursiveKeyOf<Translations>;

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `${TKey}`
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfHandleValue<
  TValue,
  Text extends string,
> = TValue extends any[]
  ? Text
  : TValue extends object
  ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
  : Text;

/**
 * Translates text.
 * @param {TxKeyPath} key - The i18n key.
 * @param {i18n.TranslateOptions} options - The i18n options.
 * @returns {string} - The translated text.
 * @example
 * Translations:
 *
 * ```en.ts
 * {
 *  "hello": "Hello, {{name}}!"
 * }
 * ```
 *
 * Usage:
 * ```ts
 * import { translate } from "i18n-js"
 *
 * translate("common.ok", { name: "world" })
 * // => "Hello world!"
 * ```
 */
export function translate(key: TxKeyPath, options?: TranslateOptions): string {
  return i18n.t(key, options);
}
