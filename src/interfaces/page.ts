export type PageParamsProps<Properties extends {}> = {
    params: Promise<Properties>;
};

export type GenericPageParamsProps = PageParamsProps<{ id: string; }>;

export type NotificationPageParamsProps = GenericPageParamsProps & PageParamsProps<{ notificationId: string; }>;

export type ArticlePageParamsProps = GenericPageParamsProps & PageParamsProps<{ slug: string; }>;

export type ArticleRevisionPageParamsProps = ArticlePageParamsProps & PageParamsProps<{ revisionId: string; }>;

export type CategoryPageParamsProps = GenericPageParamsProps & PageParamsProps<{ categoryId: string; }>;

export type TagPageParamsProps = GenericPageParamsProps & PageParamsProps<{ tagId: string; }>;
