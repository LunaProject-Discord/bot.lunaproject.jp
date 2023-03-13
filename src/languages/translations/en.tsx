import React, { Fragment } from 'react';
import { Translation } from '../../interfaces/language';

const En: Translation = {
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    info: 'Info',
    loading: 'Loading...',
    login: 'Login',
    logout: 'Logout',
    yes: 'Yes',
    no: 'No',
    enabled: 'Enabled',
    disabled: 'Disabled',
    add: 'Add',
    remove: 'Remove',
    edit: 'Edit',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    reset: 'Reset',
    open: 'Open',
    close: 'Close',
    move_up: 'Move Up',
    move_down: 'Move Down',

    pattern_date: 'yyyy/MM/dd (E)',
    pattern_time: 'HH:mm',
    pattern_datetime: 'yyyy/MM/dd (E) HH:mm',

    search: 'Search',
    search_channels: 'Search channels...',
    search_roles: 'Search roles...',
    search_members: 'Search members...',

    embeds: 'Embeds',
    embed: 'Embed',
    embed_add: 'Add Embed',
    embed_author: 'Author',
    embed_author_name: 'Author Name',
    embed_author_url: 'Author URL',
    embed_author_icon_url: 'Author Icon URL',
    embed_body: 'Body',
    embed_body_title: 'Title',
    embed_body_description: 'Description',
    embed_body_url: 'URL',
    embed_body_color: 'Color',
    embed_fields: 'Fields',
    embed_field: 'Field',
    embed_field_add: 'Add Field',
    embed_field_name: 'Field Name',
    embed_field_value: 'Field Value',
    embed_field_inline: 'Inline?',
    embed_image: 'Image & Thumbnail',
    embed_image_image_url: 'Image URL',
    embed_image_thumbnail_url: 'Thumbnail URL',
    embed_footer: 'Footer',
    embed_footer_text: 'Footer Text',
    embed_footer_icon_url: 'Footer Icon URL',
    embed_footer_timestamp: 'Timestamp',

    welcome_to_name: 'Welcome to %n!',

    home: 'Home',
    status: 'Status',
    leaderboard: 'Leaderboard',
    server_settings: 'Server Settings',
    choose_server_settings: 'Select the server you wish to configure.',
    settings_basic: 'Basic Settings',
    prefix_and_nickname: 'Prefix & Nickname',
    prefix_and_nickname_description: 'You can set how the Bot is called and its nickname.',
    prefix: 'Prefix',
    nickname: 'Nickname',
    nickname_hint: <Fragment>
        You can use <code>%p</code> to replace the prefix currently set and <code>%n</code> to replace the Bot&#39;s
        name.
    </Fragment>,
    time_and_language: 'Time & Language',
    time_and_language_description: 'You can set the date & time, language used for some functions.',
    date_and_time: 'Date & Time',
    timezone: 'Time Zone',
    timezone_description: 'If you set the time zone to a geographic area you speak frequently, the date and time will be displayed for that area.',
    language_description: 'Server-specific functions, such as the log function, will send messages in the language set here.',
    settings_server_management: 'Server Management',
    welcome_message: 'Welcome Message',
    welcome_message_description: 'Messages can be sent when a user joins the server.',
    welcome_message_enabled: 'Enable Welcome Message',
    welcome_message_edit_description: 'Customize the message sent when a user joins the server.',
    welcome_message_edit_hint: <Fragment>
        <b>The following placeholder can be set to replace the user&#39;s name, etc.</b>
        <ul style={{ marginTop: 4, marginBottom: 0, padding: 0, listStyle: 'none' }}>
            <li>Server ID: <code>{'{'}guild:id{'}'}</code></li>
            <li>Server Name: <code>{'{'}guild:name{'}'}</code></li>
            <li>Server Members Count: <code>{'{'}guild:members{'}'}</code></li>
            <li>Rule channel mentions (if set): <code>{'{'}guild:rules{'}'}</code></li>
            <li>User ID: <code>{'{'}user:id{'}'}</code></li>
            <li>User Name: <code>{'{'}user:name{'}'}</code></li>
            <li>User Discriminator: <code>{'{'}user:discriminator{'}'}</code></li>
            <li>User Mention: <code>{'{'}user:mention{'}'}</code></li>
        </ul>
    </Fragment>,
    goodbye_message: 'Goodbye Message',
    goodbye_message_description: 'A message can be sent when a user leaves the server.',
    goodbye_message_enabled: 'Enable Goodbye Message',
    goodbye_message_edit_description: 'Customize the message sent when a user leaves the server.',
    goodbye_message_edit_hint: <Fragment>
        <b>The following placeholder can be set to replace the user&#39;s name, etc.</b>
        <ul style={{ marginTop: 4, marginBottom: 0, padding: 0, listStyle: 'none' }}>
            <li>Server ID: <code>{'{'}guild:id{'}'}</code></li>
            <li>Server Name: <code>{'{'}guild:name{'}'}</code></li>
            <li>Server Members Count: <code>{'{'}guild:members{'}'}</code></li>
            <li>User ID: <code>{'{'}user:id{'}'}</code></li>
            <li>User Name: <code>{'{'}user:name{'}'}</code></li>
            <li>User Discriminator: <code>{'{'}user:discriminator{'}'}</code></li>
            <li>User Mention: <code>{'{'}user:mention{'}'}</code></li>
        </ul>
    </Fragment>,
    activity: 'Activity Roles',
    activity_description: 'Roles can be assigned during game play or music playback.',
    activity_enabled: 'Enable Activity Roles',
    activity_manage_roles: 'Manage Roles',
    role_panels: 'Role Panels',
    settings_features_and_options: 'Features & Options',
    level: 'Level',
    experience: 'Experience',
    level_description: 'Experience is awarded based on the number of statements made by members, which can be used to activate the server.',
    level_enabled: 'Enable Level',
    level_experience_per_message: 'Experience per message',
    level_manage: 'Manage Levels',
    level_manage_disabled_channels_description: 'If you speak on one of the set channels, the level will not be raised.',
    level_manage_disabled_roles_description: 'If one of the set roles is assigned to the user, the level will not be raised.',
    level_reward: 'Reward',
    level_reward_type: 'Method of Assignment of Roles',
    level_reward_type_stack: 'Stack previous roles',
    level_reward_type_stack_description: 'The new roles is granted while maintaining the roles previously granted as compensation.',
    level_reward_type_replace: 'Replace previous roles',
    level_reward_type_replace_description: 'Only roles closest to the user\'s level will be awarded, and all previously earned roles will be stripped.',
    level_reward_remove_role_demoted: 'Revoke the role when the level is demoted',
    level_reward_manage_roles: 'Manage Roles',
    level_notification: 'Notification',
    level_notification_type: 'Notification Methods',
    level_notification_type_disabled: 'Disabled',
    level_notification_type_direct_message: 'Direct Message',
    level_notification_type_latest_channel: 'Channel on which the last message was sent',
    level_notification_type_custom_channel: 'Send to the set channel',
    level_notification_channel: 'The channel to which notifications will be sent',
    level_notification_edit_description: 'You can customize the message sent when a member\'s level is raised.',
    level_notification_edit_hint: <Fragment>
        <b>The following placeholder can be set to replace the user&#39;s name, etc.</b>
        <ul style={{ marginTop: 4, marginBottom: 0, padding: 0, listStyle: 'none' }}>
            <li>Server ID: <code>{'{'}guild:id{'}'}</code></li>
            <li>Server Name: <code>{'{'}guild:name{'}'}</code></li>
            <li>User ID: <code>{'{'}user:id{'}'}</code></li>
            <li>User Name: <code>{'{'}user:name{'}'}</code></li>
            <li>User Discriminator: <code>{'{'}user:discriminator{'}'}</code></li>
            <li>User Mention: <code>{'{'}user:mention{'}'}</code></li>
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
    level_leaderboard: 'Leaderboard',
    level_leaderboard_view: 'View Leaderboard',
    level_leaderboard_public: 'Make leaderboards available to users who have not joined the server',
    level_leaderboard_allow_join: 'Allow people to join the server from the leaderboard',
    level_leaderboard_vanity_code: 'Custom Invitation Codes for Leaderboards',
    translate: 'Translate',
    translate_description: 'You can translate text using commands and flag reactions.',
    translate_enabled: 'Enable Translate',
    translate_reaction: 'Add reactions to messages to allow translation',
    translate_manage_disabled_channels_description: 'Disables translation using reactions on the set channel.',
    translate_manage_disabled_roles_description: 'If one of the configured roles is assigned to a user, he/she will not be able to translate using reactions.',
    vote: 'Vote (Poll)',
    vote_description: 'Command to create a poll and get member input.',
    vote_enabled: 'Enable Vote (Poll)',
    quote: 'Quote',
    quote_description: 'You can quote and share messages.',
    quote_enabled: 'Enable Quote',
    quote_reaction: 'Add 📝 reactions to messages to allow quoting',
    quote_message: 'Message sent Read the link and be able to quote it',
    quote_other_guild_to_this_guild: 'Allow users to quote messages sent to other servers',
    quote_this_guild_to_other_guild: 'Allow messages sent to this server to be quoted on other servers',
    quote_manage_disabled_channels_description: 'Disables quoting on the set channel.',
    quote_manage_disabled_roles_description: 'If one of the set positions is assigned to the user, the user will not be able to quote.',
    music: 'Music',
    music_description: 'Media uploaded on YouTube and other sites can be played on the voice channel.',
    music_enabled: 'Enable Music',
    music_web_panel: 'Enable the web panel to enable playback and other operations',
    music_sources: 'Select the source to play',
    music_source_youtube: 'YouTube',
    music_source_niconico: 'niconico',
    music_source_soundcloud: 'SoundCloud',
    music_source_twitch: 'Twitch',
    music_source_bandcamp: 'Bandcamp',
    music_source_vimeo: 'Vimeo',
    text_to_speech: 'Text to Speech',
    logging: 'Logging',
    logging_description: 'サーバーで起こった出来事を設定したチャンネルに送信することができます。',
    logging_enabled: 'Enable Logging',
    logging_moderation: 'Moderation',
    logging_moderation_update: 'サーバー設定の変更',
    logging_moderation_kick: 'メンバーのキック',
    logging_moderation_prune: 'メンバーの一括キック',
    logging_moderation_ban: 'メンバーのBan',
    logging_moderation_unban: 'メンバーのBan解除',
    logging_member: 'Member',
    logging_member_join: 'メンバーの参加',
    logging_member_leave: 'メンバーの退出',
    logging_member_update: 'メンバーの更新',
    logging_member_role_add: 'メンバーへの役職の追加',
    logging_member_role_remove: 'メンバーから役職の剥奪',
    logging_voice: 'Voice',
    logging_voice_join: '通話チャンネルへ参加',
    logging_voice_leave: '通話チャンネルから退出',
    logging_voice_move: '通話チャンネルの移動',
    logging_voice_mute: 'マイクのミュート & ミュート解除',
    logging_voice_deafen: 'スピーカーのミュート & ミュート解除',
    logging_category: 'Category',
    logging_text_channel: 'Text Channel',
    logging_voice_channel: 'Voice Channel',
    logging_channel_permission_update: '権限設定の変更',
    logging_role: 'Role',
    logging_emote: 'Emoji',
    logging_invite: 'Invite',
    logging_webhook: 'Webhook',
    logging_integration: 'Integration',
    logging_object_create: 'Create %n',
    logging_object_delete: 'Delete %n',
    logging_object_update: 'Update %n',
    logging_message: 'Message',
    logging_message_update: 'メッセージの編集 (変更)',
    logging_message_delete: 'メッセージの削除',
    logging_message_purge: 'メッセージの一括削除',
    logging_message_pin: 'メッセージのピン留め',
    logging_message_unpin: 'メッセージのピン留め解除',
    send_message_channel: 'Channel to send message',
    manage_disabled_channels: 'Manage Disabled Channels',
    manage_disabled_roles: 'Manage Disabled Roles',
    message_builder: 'Message Builder',
    customize_message: 'Customize Message',
    edit_message: 'Edit Message',
    about_this_settings: 'About this settings',
    notifications: 'Notifications',
    site_settings: 'Site Settings',
    design_and_appearance: 'Design & Appearance',
    device_theme: 'Use device theme',
    light_theme: 'Light Theme',
    dark_theme: 'Dark Theme',
    language: 'Language',
    japanese: '🇯🇵 日本語 (日本)',
    english: '🇺🇸 English (United States)'
};

export default En;
