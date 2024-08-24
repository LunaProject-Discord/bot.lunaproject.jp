'use client';

import { TranslateIcon } from '@/components/icons';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { UserConfigurationTranslate, UserConfigurationTranslateLanguageArray } from '@/interfaces/bot';
import { UserConfigurationViewProps } from '@/interfaces/view';
import { UserConfigurationTranslateSchema } from '@/schemas/bot';
import { getTranslateLanguageName } from '@/utils/translate';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { SectionSelectCard } from '@lunaproject/web-core/dist/components/SectionCard';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import React, { Fragment } from 'react';
import { saveUserConfiguration } from '../utils';

type UserConfigurationTranslateLanguage = 'inherit' | typeof UserConfigurationTranslateLanguageArray[number];

export const View = ({ user, configuration, localization }: UserConfigurationViewProps) => {
    const { translations, locale } = localization;
    const intlLocale = new Intl.Locale(locale);
    const intlCollator = new Intl.Collator(intlLocale);

    const translateConfiguration = configuration.translate;
    const [targetLanguageOverride, setTargetLanguageOverride, resetTargetLanguageOverride] = useResettableState<UserConfigurationTranslateLanguage>(translateConfiguration.target_language_override ?? 'inherit');

    const toObject = (): UserConfigurationTranslate => ({
        target_language_override: targetLanguageOverride === 'inherit' ? null : targetLanguageOverride
    });

    const handleSaveAction = () => saveUserConfiguration({ translate: toObject() });

    const handleCancelAction = () => {
        resetTargetLanguageOverride();
    };

    return (
        <Fragment>
            <PageHeader
                primary={translations.translate}
                secondary={translations.translate_description}
            />
            <Section>
                <SectionContent>
                    <SectionSelectCard<UserConfigurationTranslateLanguage>
                        icon={<TranslateIcon />}
                        primary={translations.user_translate_target_language_override}
                        secondary={translations.user_translate_target_language_override_description}
                        value={targetLanguageOverride}
                        setValue={setTargetLanguageOverride}
                        choices={[
                            {
                                value: 'inherit',
                                children: translations.user_translate_target_language_override_inherit
                            },
                            ...(UserConfigurationTranslateLanguageArray.map((language) => ({
                                value: language,
                                children: getTranslateLanguageName(intlLocale, language)
                            })).sort((a, b) => intlCollator.compare(
                                a.children ?? '',
                                b.children ?? ''
                            )))
                        ]}
                    />
                </SectionContent>
            </Section>

            <SaveConfirmV2
                label={translations.save_confirm_settings}
                source={translateConfiguration}
                target={toObject()}
                schema={UserConfigurationTranslateSchema}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
