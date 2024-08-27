// Translate
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

// Language
import { frenchTranslate } from '../locales/french';
import { englishTranslate } from '../locales/english';

const textTranslate = new I18n({
    en: englishTranslate,
    fr: frenchTranslate,
});

const loc = getLocales()[0].languageCode
//console.log(loc)
if(loc != null){
    textTranslate.locale = loc
}

export default textTranslate