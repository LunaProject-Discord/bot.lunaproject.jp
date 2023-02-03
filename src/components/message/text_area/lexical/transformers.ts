import {
    BOLD_ITALIC_STAR,
    BOLD_STAR,
    CODE,
    ElementTransformer,
    INLINE_CODE,
    ITALIC_STAR,
    ITALIC_UNDERSCORE,
    QUOTE,
    STRIKETHROUGH,
    TextFormatTransformer,
    TextMatchTransformer,
    Transformer
} from '@lexical/markdown';

const UNDERLINE_UNDERSCORE: TextFormatTransformer = {
    format: ['underline'],
    intraword: false,
    tag: '__',
    type: 'text-format'
};

const ITALIC_UNDERLINE_UNDERSCORE: TextFormatTransformer = {
    format: ['italic', 'underline'],
    intraword: false,
    tag: '___',
    type: 'text-format'
};

const ELEMENT_TRANSFORMERS: ElementTransformer[] = [
    QUOTE,
    CODE
];

// Order of text format transformers matters:
//
// - code should go first as it prevents any transformations inside
// - then longer tags match (e.g. ** or __ should go before * or _)
const TEXT_FORMAT_TRANSFORMERS: TextFormatTransformer[] = [
    INLINE_CODE,
    BOLD_ITALIC_STAR,
    ITALIC_UNDERLINE_UNDERSCORE,
    BOLD_STAR,
    UNDERLINE_UNDERSCORE,
    ITALIC_STAR,
    ITALIC_UNDERSCORE,
    STRIKETHROUGH
];

const TEXT_MATCH_TRANSFORMERS: TextMatchTransformer[] = [];

export const TRANSFORMERS: Transformer[] = [
    ...ELEMENT_TRANSFORMERS,
    ...TEXT_FORMAT_TRANSFORMERS,
    ...TEXT_MATCH_TRANSFORMERS
];
