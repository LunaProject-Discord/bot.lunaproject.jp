export interface WithIdParamProps {
    params: {
        id: string;
    };
}

export type PageParamsProps<Properties extends {}> = {
    params: Properties;
};

export type GenericPageParamsProps = PageParamsProps<{ id: string; }>;

export type NotificationPageParamsProps = GenericPageParamsProps & PageParamsProps<{ notificationId: string; }>;

export type ArticlePageParamsProps = GenericPageParamsProps & PageParamsProps<{ slug: string; }>;

export type ArticleRevisionPageParamsProps = ArticlePageParamsProps & PageParamsProps<{ revisionId: string; }>;
