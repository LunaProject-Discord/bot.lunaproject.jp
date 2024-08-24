import { LocaleType } from '@/interfaces/localization';

export const getTranslateLanguageName = (locale: LocaleType | Intl.Locale, language: string) => {
    const intlDisplayName = new Intl.DisplayNames(
        typeof locale === 'string' ? new Intl.Locale(locale) : locale,
        {
            type: 'language',
            languageDisplay: 'standard'
        }
    );

    switch (language) {
        case 'zh-CN':
            return intlDisplayName.of('zh-Hans');
        case 'zh-TW':
            return intlDisplayName.of('zh-Hant');
        default:
            return intlDisplayName.of(language);
    }
};
