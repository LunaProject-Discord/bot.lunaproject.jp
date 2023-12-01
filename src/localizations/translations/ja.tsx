import { Localization, Translations } from '@interfaces/localization';
import React, { Fragment } from 'react';

export const translationsJa: Translations = {
    success: '成功',
    warning: '警告',
    error: 'エラー',
    information: '情報',
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
    duplicate: '複製',


    shard: 'シャード',
    shards: 'シャード',
    ping: 'Ping',
    guild: 'サーバー',
    guilds: 'サーバー',
    channel: 'チャンネル',
    channels: 'チャンネル',
    role: '役職',
    roles: '役職',
    emoji: '絵文字',
    emojis: '絵文字',
    member: 'メンバー',
    members: 'メンバー',
    user: 'ユーザー',
    users: 'ユーザー',


    online: 'オンライン',
    offline: 'オフライン',

    status: 'ステータス',
    status_connecting: '接続中...',
    status_connected: '接続済み',
    status_disconnected: '切断済み',
    status_waiting_reconnect: '再接続の待機中...',
    status_reconnecting: '再接続中...',
    status_shutting_down: 'シャットダウン中...',
    status_shutdown: 'シャットダウン済み',
    status_failed_to_login: 'ログイン失敗',


    permission: '権限',
    permissions: '権限',

    permissions_advanced: '高度な権限',
    permission_8: '管理者',

    permissions_general: 'サーバー全般',
    permission_32: 'サーバーの管理',
    permission_16: 'チャンネルの管理',
    permission_268435456: '役職の管理',
    permission_536870912: 'Webhook の管理',
    permission_1073741824: '絵文字やステッカー、サウンドの管理',
    permission_128: 'サーバーログの表示',
    permission_524288: 'サーバー統計の表示',
    permission_2199023255552: 'クリエイター収益分析の表示',
    permission_1024: 'チャンネルの表示',

    permissions_membership: 'メンバーシップ',
    permission_1: '招待リンクを作成',
    permission_67108864: 'ニックネームの変更',
    permission_134217728: 'ニックネームの管理',
    permission_1099511627776: 'メンバーをタイムアウト',
    permission_2: 'メンバーをキック',
    permission_4: 'メンバーを Ban',

    permissions_text: 'テキストチャンネル',
    permission_2048: 'メッセージの送信',
    permission_4096: '音声読み上げメッセージの送信',
    permission_70368744177664: 'ボイスメッセージの送信',
    permission_65536: 'メッセージ履歴の表示',
    permission_32768: 'ファイルの添付',
    permission_16384: '埋め込みリンクの送信',
    permission_262144: '外部の絵文字の使用',
    permission_137438953472: '外部のスタンプの使用',
    permission_64: 'リアクションの追加',
    permission_131072: '役職・全員宛メンション',
    permission_8192: 'メッセージの管理',
    permission_2147483648: 'アプリケーションコマンドの使用',

    permissions_thread: 'スレッド',
    permission_274877906944: 'スレッドでメッセージを送信',
    permission_34359738368: '公開スレッドの作成',
    permission_68719476736: '非公開スレッドの作成',
    permission_17179869184: 'スレッドの管理',

    permissions_voice: 'ボイスチャンネル',
    permission_1048576: '接続',
    permission_2097152: '発言',
    permission_512: '配信',
    permission_549755813888: 'アクティビティの使用',
    permission_4398046511104: 'サウンドボードの使用',
    permission_35184372088832: '外部のサウンドの使用',
    permission_33554432: '音声検出の使用',
    permission_256: '優先スピーカー',
    permission_4194304: 'メンバーをミュート',
    permission_8388608: 'メンバーのスピーカーをミュート',
    permission_16777216: 'メンバーの移動',

    permissions_stage: 'ステージチャンネル',
    permission_4294967296: 'スピーカーへの参加をリクエスト',

    permissions_events: 'イベント',
    permission_8589934592: 'イベントの管理',


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
    back_to_home: 'ホームに戻る',


    status_description: 'Bot のステータスを確認できます。',
    status_all_connected: 'すべてのシャードは正常に接続されています。',
    status_any_connected: 'いくつかのシャードが接続されていない可能性があります！',
    status_all_disconnected: 'すべてのシャードが準備中であるか Discord に接続されていません！',
    status_shard_with_id: 'シャード #%id',
    status_average_ping: '平均 Ping',
    status_mutual_guilds: '共通のサーバー',
    status_mutual_guilds_with_count: '%c つの共通なサーバー',
    status_mutual_guilds_empty: '共通のサーバーはありません',
    status_mutual_guilds_not_logged_in: 'ログインをすることで共通のサーバーを表示することができます。',


    leaderboard: 'リーダーボード',
    leaderboard_description: 'リーダーボードを表示したいサーバーを選択してください。',


    dashboard: 'ダッシュボード',
    dashboard_error_manage_roles_empty_dialog_title: <Fragment>
        登録されている<br className="mobile" />
        役職がありません
    </Fragment>,
    dashboard_error_manage_roles_empty_dialog_description: '右上のボタンから役職を追加できます。',
    dashboard_error_cannot_be_enabled_alert_title: 'この設定を有効にすることはできません',


    guild_settings: 'サーバー設定',
    guild_settings_description: '設定したいサーバーを選択してください。',
    back_to_select_guild: 'サーバー選択に戻る',
    settings_basic: '基本の設定',
    settings_guild_management: 'サーバー管理',
    settings_moderation_and_management: 'モデレーションと管理',
    settings_features_and_options: '機能とオプション',

    prefix_and_nickname: 'プレフィックスとニックネーム',
    prefix_and_nickname_description: 'Bot の呼び出し方やニックネームを設定できます。',
    prefix: 'プレフィックス',
    nickname: 'ニックネーム',
    nickname_description: <Fragment>
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

    automod: 'AutoMod',

    role_permissions: '役職の権限を確認',
    role_permissions_description: 'サーバーに設定されている役職とその権限を表示することで、権限の設定に役立てることができます。',
    role_permissions_select_roles: '表示する権限を選択',
    role_permissions_how_to: '表の見方について',
    role_permissions_how_to_description_yes: 'はその権限が役職に付与されています。',
    role_permissions_how_to_description_no: 'はその権限が役職に付与されていません。',
    role_permissions_how_to_description_inherited_everyone: 'は @everyone に権限が付与されているため、それを継承していることを意味します。',
    role_permissions_how_to_description_inherited_administrator: 'は役職に管理者権限が付与されているため、それを継承していることを意味します。',
    role_permissions_how_to_description_deletable: 'は何らかの要因によってすでに権限が付与されているため、剥奪しても問題がないことを意味します。',
    role_permissions_grid_yes: '権限が付与されています',
    role_permissions_grid_no: '権限が付与されていません',
    role_permissions_grid_inherited_everyone: '権限が @everyone に付与されています',
    role_permissions_grid_inherited_administrator: 'この役職に管理者権限が付与されています',
    role_permissions_grid_deletable: 'この役職から権限を剥奪できます',

    welcome_message: 'ようこそ (参加) メッセージ',
    welcome_message_description: 'ユーザーがサーバーに参加したときにメッセージを送信できます。',
    welcome_message_enabled: 'ようこそメッセージを有効にする',
    welcome_message_edit_description: 'ユーザーがサーバーに参加したときに送信されるメッセージをカスタマイズできます。',
    welcome_message_edit_hint: <Fragment>
        <b>下記のプレースホルダーを設定することでユーザーの名前などに置き換えできます。</b>
        <ul className="mt-1">
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

    goodbye_message: 'さよなら (退出) メッセージ',
    goodbye_message_description: 'ユーザーがサーバーから退出したときにメッセージを送信できます。',
    goodbye_message_enabled: 'さよならメッセージを有効にする',
    goodbye_message_edit_description: 'ユーザーがサーバーから退出したときに送信されるメッセージをカスタマイズできます。',
    goodbye_message_edit_hint: <Fragment>
        <b>下記のプレースホルダーを設定することでユーザーの名前などに置き換えできます。</b>
        <ul className="mt-1">
            <li>サーバーのID: <code>{'{'}guild:id{'}'}</code></li>
            <li>サーバーの名前: <code>{'{'}guild:name{'}'}</code></li>
            <li>サーバーのメンバー数: <code>{'{'}guild:members{'}'}</code></li>
            <li>ユーザーのID: <code>{'{'}user:id{'}'}</code></li>
            <li>ユーザーの名前: <code>{'{'}user:name{'}'}</code></li>
            <li>ユーザーのタグ: <code>{'{'}user:discriminator{'}'}</code></li>
            <li>ユーザーのメンション: <code>{'{'}user:mention{'}'}</code></li>
        </ul>
    </Fragment>,

    member_join: 'メンバーの参加',
    member_join_description: 'メンバーがサーバーに参加したときにメッセージを送信できます。',
    member_join_enabled: 'メンバーの参加を有効にする',
    member_join_before_pending: 'サーバーに参加したとき (ルールに同意する前)',
    member_join_before_pending_enabled: 'サーバーに参加したときの設定を有効にする',
    member_join_before_pending_message_enabled: 'サーバーに参加したときにメッセージを送信する',
    member_join_before_pending_message_edit_description: 'メンバーがサーバーに参加したときに送信されるメッセージをカスタマイズできます。',
    member_join_before_pending_roles_enabled: 'サーバーに参加したときに役職を付与する',
    member_join_before_pending_role_type_everyone: '全員',
    member_join_before_pending_role_type_user: 'ユーザー',
    member_join_before_pending_role_type_bot: 'すべてのBot',
    member_join_before_pending_role_type_verified_bot: '認証済みBot',
    member_join_before_pending_role_type_not_verified_bot: '未認証Bot',
    member_join_after_pending: 'ルールに同意したとき',
    member_join_after_pending_error_cannot_be_enabled_alert_description: <Fragment>
        続けるには、下記の設定を Discord で有効にしてください。
        <ul className="list-disc mt-1 ps-5">
            <li>コミュニティ</li>
            <li>ルール スクリーニング</li>
        </ul>
    </Fragment>,
    member_join_after_pending_enabled: 'ルールに同意したときの設定を有効にする',
    member_join_after_pending_message_enabled: 'ルールに同意したときにメッセージを送信する',
    member_join_after_pending_message_edit_description: 'メンバーがルールに同意したときに送信されるメッセージをカスタマイズできます。',
    member_join_after_pending_roles_enabled: 'ルールに同意したときに役職を付与する',
    member_join_message: 'メッセージの送信',
    member_join_message_edit_hint: <Fragment>
        <b>下記のプレースホルダーを設定することでユーザーの名前などに置き換えできます。</b>
        <ul className="mt-1">
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
    member_join_roles: '役職の付与',
    member_join_manage_roles: '付与する役職の管理',

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
        <ul className="mt-1">
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

    quote: 'メッセージの引用',
    quote_description: '送信されたメッセージを引用して共有することができます。',
    quote_enabled: '引用を有効にする',
    quote_reaction: 'メッセージに 📝 リアクションを追加して引用をできるようにする',
    quote_message: '送信されたメッセージ リンクを読み取って引用をできるようにする',
    quote_other_guild_to_this_guild: 'ほかのサーバーに送信されたメッセージを引用できるようにする',
    quote_this_guild_to_other_guild: 'このサーバーに送信されたメッセージをほかのサーバーで引用できるようにする',
    quote_manage_disabled_channels_description: '設定されたチャンネルでは引用をできないようにします。',
    quote_manage_disabled_roles_description: '設定された役職のいずれかがユーザーに付与されている場合、引用をできないようにします。',

    music: 'メディア (音楽)',
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


    statistics: '統計',
    statistics_description: 'Bot の統計を表示します。',
    statistics_mode: '表示する方法',
    statistics_mode_hours: '時間計 (過去24時間)',
    statistics_mode_days: '日計',
    statistics_mode_weeks: '週計',
    statistics_mode_months: '月計',
    statistics_period: '表示する期間',
    statistics_period_from: 'から',
    statistics_period_to: 'まで',
    statistics_widget_live: '速報値',
    statistics_widget_min: 'この期間の最小値',
    statistics_widget_max: 'この期間の最大値',
    statistics_table_date: '日時',
    statistics_table_total: '合計',
    statistics_table_shard_with_id: 'シャード #%id',


    send_message_channel: 'メッセージを送信するチャンネル',
    manage_disabled_channels: '無効なチャンネルの管理',
    manage_disabled_roles: '無効な役職の管理',


    message_builder: 'メッセージ ビルダー',
    message_builder_editor: '編集',
    message_builder_preview: 'プレビュー',
    message_builder_light_theme: 'ライトテーマに変更する',
    message_builder_dark_theme: 'ダークテーマに変更する',
    message_builder_cozy_mode: '通常モードに変更する',
    message_builder_compact_mode: 'コンパクトモードに変更する',

    customize_message: 'メッセージをカスタマイズ',
    edit_message: 'メッセージを編集',


    about_this_settings: 'この設定について',


    lunaproject_services: 'Luna Project のサービス',
    lunaproject_document: 'Luna Project ドキュメント',
    lunaproject_account: 'Luna Project アカウント',


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
