import React, { Fragment } from 'react';
import { Translation } from '../../interfaces/language';

const Ja: Translation = {
    success: '成功',
    warning: '警告',
    error: 'エラー',
    info: '情報',
    loading: '読み込み中…',
    login: 'ログイン',
    logout: 'ログアウト',
    enabled: '有効',
    disabled: '無効',
    add: '追加',
    remove: '削除',
    edit: '編集',
    confirm: '確認',
    cancel: 'キャンセル',
    save: '保存',
    reset: 'リセット',

    home: 'ホーム',
    status: 'ステータス',
    leaderboard: 'リーダーボード',
    server_settings: 'サーバー設定',
    settings_basic: '基本の設定',
    choose_server_settings: '設定したいサーバーを選択してください。',
    prefix_and_nickname: 'プレフィックスとニックネーム',
    prefix_and_nickname_description: 'Bot の呼び出し方やニックネームを設定できます。',
    prefix: 'プレフィックス',
    nickname: 'ニックネーム',
    nickname_hint: <Fragment>
        <code>%p</code> で設定中のプレフィックスへ、<code>%n</code> で Bot の名前へ置き換えができます。
    </Fragment>,
    time_and_language: '時刻と言語',
    time_and_language_description: '一部の機能で使用される日時や言語の設定ができます。',
    date_and_time: '日付と時刻',
    timezone: 'タイムゾーン',
    timezone_description: 'タイムゾーンをよく話す地域圏に設定すると、その地域に合わせた日時が表示されます。',
    language_description: 'ログ機能などのサーバー専用の機能では、ここで設定した言語でメッセージが送信されます。',
    settings_server_management: 'サーバー管理',
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
    role_panels: '役職 (ロール) パネル',
    settings_features_and_options: '機能とオプション',
    level: 'レベル',
    experience: '経験値',
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
    level_notification_type_direct_message: 'ダイレクト メッセージに送信',
    level_notification_type_latest_channel: '最後にメッセージを送信したチャンネル',
    level_notification_type_custom_channel: '設定したチャンネルに送信',
    level_notification_channel: '通知を送信するチャンネル',
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
    text_to_speech: 'メッセージの読み上げ',
    logging: 'ログ',
    send_message_channel: 'メッセージを送信するチャンネル',
    manage_disabled_channels: '無効なチャンネルの管理',
    manage_disabled_roles: '無効な役職の管理',
    message_builder: 'メッセージ ビルダー',
    customize_message: 'メッセージをカスタマイズ',
    edit_message: 'メッセージを編集',
    about_this_settings: 'この設定について',
    site_settings: 'サイトの設定',
    design_and_appearance: 'デザインと外観',
    device_theme: 'デバイスのモードを利用する',
    light_theme: 'ライトテーマ',
    dark_theme: 'ダークテーマ',
    language: '言語',
    japanese: '🇯🇵 日本語 (日本)',
    english: '🇺🇸 English (United States)'
};

export default Ja;
