import { Localization, Translations } from '@interfaces/localization';
import React, { Fragment } from 'react';

export const translationsJa: Translations = {
    success: '成功',
    warning: '警告',
    error: 'エラー',
    info: '情報',
    loading: '読み込み中...',
    login: 'ログイン',
    logout: 'ログアウト',
    yes: 'はい',
    no: 'いいえ',
    enabled: '有効',
    disabled: '無効',
    default: 'デフォルト',
    add: '追加',
    remove: '削除',
    create: '作成',
    delete: '削除',
    edit: '編集',
    confirm: '確認',
    cancel: 'キャンセル',
    save: '保存',
    reset: 'リセット',
    discard_changes: '変更を破棄する',
    open: '開く',
    close: '閉じる',
    move_up: '上に移動',
    move_down: '下に移動',

    guild: 'サーバー',
    guilds: 'サーバー',
    channel: 'チャンネル',
    channels: 'チャンネル',
    role: '役職',
    roles: '役職',
    member: 'メンバー',
    members: 'メンバー',
    user: 'ユーザー',
    users: 'ユーザー',


    pattern_date: 'yyyy年M月d日 (E)',
    pattern_time: 'HH:mm',
    pattern_datetime: 'yyyy年M月d日 (E) HH:mm',


    search: '検索',
    search_channels: 'チャンネルを検索...',
    search_roles: '役職を検索...',
    search_members: 'メンバーを検索...',


    embeds: 'Embeds',
    embed: 'Embed',
    embed_add: 'Embed を追加',
    embed_author: '作者',
    embed_author_name: '作者の名前',
    embed_author_url: '作者の URL',
    embed_author_icon_url: '作者のアイコン URL',
    embed_body: '本文',
    embed_body_title: 'タイトル',
    embed_body_description: '説明',
    embed_body_url: 'URL',
    embed_body_color: '色',
    embed_fields: 'フィールド',
    embed_field: 'フィールド',
    embed_field_add: 'フィールドを追加',
    embed_field_name: 'フィールドの名前',
    embed_field_value: 'フィールドの内容',
    embed_field_inline: 'インライン',
    embed_image: '画像とサムネイル',
    embed_image_image_url: '画像の URL',
    embed_image_thumbnail_url: 'サムネイルの URL',
    embed_footer: 'フッター',
    embed_footer_text: 'フッターのテキスト',
    embed_footer_icon_url: 'フッターのアイコン URL',
    embed_footer_timestamp: 'タイムスタンプ',


    error_unauthorized_title: 'ログインが必要です',
    error_unauthorized_description: <Fragment>
        このページにアクセスするにはログインが必要です。<br />
        下のボタンを押してログインをしてください。
    </Fragment>,
    error_forbidden_title: '権限がありません',
    error_forbidden_description: <Fragment>
        このページにアクセスするための権限がありません。<br />
        あなたに権限が付与されていることが確実な場合は、ほかのアカウントに切り替えて再度お試しください。
    </Fragment>,
    error_not_found_title: 'ページが見つかりません',
    error_not_found_description: <Fragment>
        指定されたページが見つかりませんでした。<br />
        ページのURLが変更されたか、ページそのものが削除された可能性があります。<br />
        お手数ですが、下のボタンからホームに戻ってください。
    </Fragment>,


    welcome: 'ようこそ',
    welcome_to_name: 'ようこそ、%n さん！',


    home: 'ホーム',
    status: 'ステータス',
    leaderboard: 'リーダーボード',
    choose_guild_leaderboard: 'リーダーボードを表示したいサーバーを選択してください。',


    guild_settings: 'サーバー設定',
    choose_guild_settings: '設定したいサーバーを選択してください。',
    settings_basic: '基本の設定',
    settings_guild_management: 'サーバー管理',
    settings_features_and_options: '機能とオプション',

    prefix_and_nickname: 'プレフィックスとニックネーム',
    prefix_and_nickname_description: 'Bot の呼び出し方やニックネームを設定できます。',
    prefix: 'プレフィックス',
    nickname: 'ニックネーム',
    nickname_hint: <Fragment>
        <code>%p</code> で設定中のプレフィックスへ、<code>%n</code> で Bot の名前へ置き換えができます。
    </Fragment>,

    time_and_language: '時刻と言語',
    guild_time_and_language_description: '一部の機能で使用される日時や言語の設定ができます。',
    date_and_time: '日付と時刻',
    timezone: 'タイムゾーン',
    timezone_description: 'タイムゾーンをよく話す地域圏に設定すると、その地域に合わせた日時が表示されます。',
    guild_language_description: 'ログ機能などのサーバー専用の機能では、ここで設定した言語でメッセージが送信されます。',

    commands: 'コマンド',
    commands_description: 'コマンドの権限などの設定を上書きすることができます。',
    commands_permissions_channels: 'チャンネルの権限',
    commands_permissions_all_channels: 'すべてのチャンネル',
    commands_permissions_roles: '役職の権限',
    commands_permissions_all_roles: '@everyone',
    commands_permissions_members: 'メンバーの権限',
    command_manage: 'コマンドの管理',
    command_enabled: 'コマンドを有効にする',
    command_user_permissions: 'このコマンドを使うのに必要な権限',
    command_bot_permissions: 'Bot に必要な権限',
    command_permissions_channels: 'チャンネルの権限オーバーライド',
    command_permissions_roles: '役職の権限オーバーライド',
    command_permissions_members: 'メンバーの権限オーバーライド',

    welcome_message: 'ようこそメッセージ (参加)',
    welcome_message_description: 'ユーザーがサーバーに参加したときにメッセージを送信できます。',
    welcome_message_enabled: 'ようこそメッセージを有効にする',
    welcome_message_edit_description: 'ユーザーがサーバーに参加したときに送信されるメッセージをカスタマイズできます。',
    welcome_message_edit_hint: <Fragment>
        <b>下記のプレースホルダーを設定することでユーザーの名前などに置き換えできます。</b>
        <ul style={{ marginTop: 4, marginBottom: 0, padding: 0, listStyle: 'none' }}>
            <li>サーバーのID: <code>{'{'}guild:id{'}'}</code></li>
            <li>サーバーの名前: <code>{'{'}guild:name{'}'}</code></li>
            <li>サーバーのメンバー数: <code>{'{'}guild:members{'}'}</code></li>
            <li>ルールチャンネルのメンション (設定されている場合のみ): <code>{'{'}guild:rules{'}'}</code></li>
            <li>ユーザーのID: <code>{'{'}user:id{'}'}</code></li>
            <li>ユーザーの名前: <code>{'{'}user:name{'}'}</code></li>
            <li>ユーザーのタグ: <code>{'{'}user:discriminator{'}'}</code></li>
            <li>ユーザーのメンション: <code>{'{'}user:mention{'}'}</code></li>
        </ul>
    </Fragment>,

    goodbye_message: 'さよならメッセージ (退出)',
    goodbye_message_description: 'ユーザーがサーバーから退出したときにメッセージを送信できます。',
    goodbye_message_enabled: 'さよならメッセージを有効にする',
    goodbye_message_edit_description: 'ユーザーがサーバーから退出したときに送信されるメッセージをカスタマイズできます。',
    goodbye_message_edit_hint: <Fragment>
        <b>下記のプレースホルダーを設定することでユーザーの名前などに置き換えできます。</b>
        <ul style={{ marginTop: 4, marginBottom: 0, padding: 0, listStyle: 'none' }}>
            <li>サーバーのID: <code>{'{'}guild:id{'}'}</code></li>
            <li>サーバーの名前: <code>{'{'}guild:name{'}'}</code></li>
            <li>サーバーのメンバー数: <code>{'{'}guild:members{'}'}</code></li>
            <li>ユーザーのID: <code>{'{'}user:id{'}'}</code></li>
            <li>ユーザーの名前: <code>{'{'}user:name{'}'}</code></li>
            <li>ユーザーのタグ: <code>{'{'}user:discriminator{'}'}</code></li>
            <li>ユーザーのメンション: <code>{'{'}user:mention{'}'}</code></li>
        </ul>
    </Fragment>,

    activity: 'アクティビティ ロール',
    activity_description: 'ゲームのプレイ中や音楽の再生中に役職を付与することができます。',
    activity_enabled: 'アクティビティ ロールを有効にする',
    activity_manage_roles: '役職の管理',
    activity_type: 'アクティビティの種類',
    activity_type_playing_long: 'ゲームをプレイ中',
    activity_type_playing_short: 'プレイ中',
    activity_type_playing_description: '特定の名前のゲームをプレイ中に役職を付与します。',
    activity_type_streaming_long: '配信中',
    activity_type_streaming_short: '配信中',
    activity_type_streaming_description: 'YouTube か Twitch で特定のタイトルで配信中に役職を付与します。',
    activity_type_listening_long: '音楽を再生中',
    activity_type_listening_short: '再生中',
    activity_type_listening_description: '特定の名前の音楽を再生中に役職を付与します。',
    activity_type_watching_long: '動画を視聴中',
    activity_type_watching_short: '視聴中',
    activity_type_watching_description: '特定のタイトルの動画を視聴中に役職を付与します。',
    activity_type_custom_status_long: 'カスタム ステータスを設定中',
    activity_type_custom_status_short: '設定中',
    activity_type_custom_status_description: <Fragment>
        ユーザーのカスタム ステータスが<br className="desktop" />
        設定した名前と一致したときに役職を付与します。
    </Fragment>,

    role_panels: '役職 (ロール) パネル',

    level: 'レベル',
    experience: '経験値',
    rank: '順位',
    level_description: 'メンバーの発言数に応じた経験値を付与し、サーバーのアクティブ化に役立てることができます。',
    level_enabled: 'レベルを有効にする',
    level_experience_per_message: 'メッセージあたりの経験値',
    level_manage: 'レベルの管理',
    level_manage_disabled_channels_description: '設定されたチャンネルのいずれかで発言した場合、レベルが上がらないようにします。',
    level_manage_disabled_roles_description: '設定された役職のいずれかがユーザーに付与されている場合、レベルが上がらないようにします。',
    level_reward: '報酬',
    level_reward_type: '役職の付与方法',
    level_reward_type_stack: '以前の役職を維持する',
    level_reward_type_stack_description: '以前に報酬として付与された役職を維持しながら新しい役職を付与します。',
    level_reward_type_replace: '以前の役職を置き換える',
    level_reward_type_replace_description: 'ユーザーのレベルに一番近い役職のみが付与され、これまでに獲得した役職はすべて剥奪します。',
    level_reward_remove_role_demoted: 'レベルが下がるときに役職を剥奪する',
    level_reward_manage_roles: '役職の管理',
    level_notification: '通知',
    level_notification_type: '通知の方法',
    level_notification_type_disabled: '通知しない',
    level_notification_type_direct_message: 'ダイレクト メッセージ',
    level_notification_type_latest_channel: '最後にメッセージを送信したチャンネル',
    level_notification_type_custom_channel: '設定したチャンネル',
    level_notification_channel: '通知を送信するチャンネル',
    level_notification_edit_description: 'メンバーのレベルが上がったときに送信されるメッセージをカスタマイズできます。',
    level_notification_edit_hint: <Fragment>
        <b>下記のプレースホルダーを設定することでユーザーの名前などに置き換えできます。</b>
        <ul style={{ marginTop: 4, marginBottom: 0, padding: 0, listStyle: 'none' }}>
            <li>サーバーのID: <code>{'{'}guild:id{'}'}</code></li>
            <li>サーバーの名前: <code>{'{'}guild:name{'}'}</code></li>
            <li>ユーザーのID: <code>{'{'}user:id{'}'}</code></li>
            <li>ユーザーの名前: <code>{'{'}user:name{'}'}</code></li>
            <li>ユーザーのタグ: <code>{'{'}user:discriminator{'}'}</code></li>
            <li>ユーザーのメンション: <code>{'{'}user:mention{'}'}</code></li>
            <li>変更前の暫定順位: <code>{'{'}rank:old{'}'}</code></li>
            <li>変更後の暫定順位: <code>{'{'}rank:new{'}'}</code></li>
            <li>変更前のレベル: <code>{'{'}level:old{'}'}</code></li>
            <li>変更後のレベル: <code>{'{'}level:new{'}'}</code></li>
            <li>変更前の経験値: <code>{'{'}xp:old{'}'}</code></li>
            <li>変更後の経験値: <code>{'{'}xp:new{'}'}</code></li>
            <li>変更前の最大経験値: <code>{'{'}max_xp:old{'}'}</code></li>
            <li>変更後の最大経験値: <code>{'{'}max_xp:new{'}'}</code></li>
        </ul>
    </Fragment>,
    level_leaderboard: 'リーダーボード',
    level_leaderboard_view: 'リーダーボードを見る',
    level_leaderboard_public: 'サーバーに参加していないユーザーに向けてリーダーボードを公開する',
    level_leaderboard_allow_join: 'リーダーボードからサーバーに参加できるようにする',
    level_leaderboard_vanity_code: 'リーダーボードのカスタム招待コード',

    translate: '翻訳',
    translate_description: 'コマンドや国旗のリアクションを使ってテキストを翻訳できます。',
    translate_enabled: '翻訳を有効にする',
    translate_reaction: 'メッセージにリアクションを追加して翻訳をできるようにする',
    translate_manage_disabled_channels_description: '設定されたチャンネルではリアクションを使用した翻訳をできないようにします。',
    translate_manage_disabled_roles_description: '設定された役職のいずれかがユーザーに付与されている場合、リアクションを使用した翻訳をできないようにします。',

    vote: '投票',
    vote_description: 'コマンドで投票を作成してメンバーの意見を聞くことができます。',
    vote_enabled: '投票を有効にする',

    quote: '引用',
    quote_description: '送信されたメッセージを引用して共有することができます。',
    quote_enabled: '引用を有効にする',
    quote_reaction: 'メッセージに 📝 リアクションを追加して引用をできるようにする',
    quote_message: '送信されたメッセージ リンクを読み取って引用をできるようにする',
    quote_other_guild_to_this_guild: 'ほかのサーバーに送信されたメッセージを引用できるようにする',
    quote_this_guild_to_other_guild: 'このサーバーに送信されたメッセージをほかのサーバーで引用できるようにする',
    quote_manage_disabled_channels_description: '設定されたチャンネルでは引用をできないようにします。',
    quote_manage_disabled_roles_description: '設定された役職のいずれかがユーザーに付与されている場合、引用をできないようにします。',

    music: '音楽',
    music_description: 'YouTube などにアップロードされているメディアをボイスチャンネルで再生することができます。',
    music_enabled: '音楽を有効にする',
    music_web_panel: 'Web パネルを有効にして再生などの操作をできるようにする',
    music_default_volume: 'デフォルトの音量',
    music_timeout_seconds: '再生が終了した後にチャンネルから退出するまでの秒数',
    music_next_media_notification: '次のメディアを再生するときに通知を送信する',
    music_next_media_notification_description: 'この設定が有効であっても繰り返しが 1曲のみ の場合は通知されません。',
    music_sources: '再生するソース',
    music_source_youtube: 'YouTube',
    music_source_niconico: 'ニコニコ動画',
    music_source_soundcloud: 'SoundCloud',
    music_source_twitch: 'Twitch',
    music_source_bandcamp: 'Bandcamp',
    music_source_vimeo: 'Vimeo',

    text_to_speech: 'メッセージの読み上げ',

    logging: 'ログ',
    logging_description: 'サーバーで起きたできごとを設定したチャンネルに送信することができます。',
    logging_enabled: 'ログを有効にする',
    logging_channel: 'ログを送信するチャンネル',
    logging_moderation: 'モデレーション',
    logging_moderation_update: 'サーバー設定の変更',
    logging_moderation_kick: 'メンバーのキック',
    logging_moderation_prune: 'メンバーの一括キック',
    logging_moderation_ban: 'メンバーのBan',
    logging_moderation_unban: 'メンバーのBan解除',
    logging_member: 'メンバー',
    logging_member_join: 'メンバーの参加',
    logging_member_leave: 'メンバーの退出',
    logging_member_update: 'メンバーの更新',
    logging_member_role_add: 'メンバーへ役職の付与',
    logging_member_role_remove: 'メンバーから役職の剥奪',
    logging_voice: 'ボイス',
    logging_voice_join: '通話チャンネルへ参加',
    logging_voice_leave: '通話チャンネルから退出',
    logging_voice_move: '通話チャンネルの移動',
    logging_voice_mute: 'マイクのミュート & ミュート解除',
    logging_voice_deafen: 'スピーカーのミュート & ミュート解除',
    logging_category: 'カテゴリ',
    logging_text_channel: 'テキストチャンネル',
    logging_voice_channel: 'ボイスチャンネル',
    logging_channel_permission_update: '権限設定の変更',
    logging_role: '役職',
    logging_emote: '絵文字',
    logging_invite: '招待',
    logging_webhook: 'Webhook',
    logging_integration: '連携サービス',
    logging_object_create: '%nの作成',
    logging_object_delete: '%nの削除',
    logging_object_update: '%nの変更',
    logging_message: 'メッセージ',
    logging_message_update: 'メッセージの編集 (変更)',
    logging_message_delete: 'メッセージの削除',
    logging_message_purge: 'メッセージの一括削除',
    logging_message_pin: 'メッセージのピン留め',
    logging_message_unpin: 'メッセージのピン留め解除',


    user_settings: 'ユーザー設定',
    user_time_and_language_description: 'ユーザーが実行した機能で使用される日時や言語の設定ができます。',
    user_language_description: 'あなたが実行したコマンドの応答は、ここで設定した言語で行われます。',


    send_message_channel: 'メッセージを送信するチャンネル',
    manage_disabled_channels: '無効なチャンネルの管理',
    manage_disabled_roles: '無効な役職の管理',
    message_builder: 'メッセージ ビルダー',
    customize_message: 'メッセージをカスタマイズ',
    edit_message: 'メッセージを編集',
    about_this_settings: 'この設定について',
    notifications: '通知',
    manage_account: 'アカウントの管理',


    site_settings: 'サイトの設定',

    design_and_appearance: 'デザインと外観',
    device_theme: 'デバイスのモードを利用する',
    light_theme: 'ライトテーマ',
    dark_theme: 'ダークテーマ',

    language: '言語',
    japanese: '🇯🇵 日本語 (日本)',
    english: '🇺🇸 English (United States)'
};

export const localizationJa: Localization = {
    locale: 'ja',
    translations: translationsJa
};

