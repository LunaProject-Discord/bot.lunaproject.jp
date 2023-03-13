import type { EmbedAuthor } from '@lunaproject-discord/web-discord/dist/interfaces/message';
import { OutlinedInput } from '@mui/material';
import { TranslatableViewProps } from '../../../../interfaces/view';
import { ItemDisabledProps, ItemVariableProps } from '../../../items';
import { EmbedAccordion, EmbedAccordionDetails, EmbedAccordionSummary } from './accordion';
import { EmbedFormContainer, EmbedFormItem } from './form';

type Props = ItemDisabledProps & ItemVariableProps<EmbedAuthor> & TranslatableViewProps;

export const EmbedAuthorEditor = ({ value, setValue, disabled, translations }: Props) => (
    <EmbedAccordion>
        <EmbedAccordionSummary>{translations.embed_author}</EmbedAccordionSummary>
        <EmbedAccordionDetails>
            <EmbedFormContainer>
                <EmbedFormItem label={translations.embed_author_name} length={value.name.length} maxLength={256}>
                    <OutlinedInput
                        value={value.name}
                        onChange={(e) => setValue({ ...value, name: e.target.value })}
                        type="text"
                        inputProps={{ maxLength: 256 }}
                        disabled={disabled}
                        fullWidth
                        size="small"
                        margin="none"
                    />
                </EmbedFormItem>
                <EmbedFormItem label={translations.embed_author_url} inline>
                    <OutlinedInput
                        value={value.url}
                        onChange={(e) => setValue({ ...value, url: e.target.value })}
                        type="url"
                        disabled={disabled}
                        fullWidth
                        size="small"
                        margin="none"
                    />
                </EmbedFormItem>
                <EmbedFormItem label={translations.embed_author_icon_url} inline>
                    <OutlinedInput
                        value={value.iconUrl}
                        onChange={(e) => setValue({ ...value, iconUrl: e.target.value })}
                        type="url"
                        disabled={disabled}
                        fullWidth
                        size="small"
                        margin="none"
                    />
                </EmbedFormItem>
            </EmbedFormContainer>
        </EmbedAccordionDetails>
    </EmbedAccordion>
);
