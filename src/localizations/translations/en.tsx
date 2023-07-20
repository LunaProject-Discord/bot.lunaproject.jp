import { Localization, Translations } from '@interfaces/localization';
import React, { Fragment } from 'react';

export const translationsEn: Translations = {
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
    default: 'Default',
    add: 'Add',
    remove: 'Remove',
    create: 'Create',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    reset: 'Reset',
    discard_changes: 'Discard Changes',
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


    error_unauthorized_title: 'Login is required!',
    error_unauthorized_description: <Fragment>
        You must be logged in to access this page.<br />
        Please click the button below to log in.
    </Fragment>,
    error_forbidden_title: 'Forbidden!',
    error_forbidden_description: <Fragment>
        You do not have authorization to access this page.<br />
        If you are sure you are authorized, please switch to another account and try again.
    </Fragment>,
    error_not_found_title: 'Page not found!',
    error_not_found_description: <Fragment>
        The specified page could not be found.<br />
        The URL of the page may have changed or the page itself may have been deleted.<br />
        Please click the button below to return to the home page.
    </Fragment>,


    welcome: 'Welcome',
    welcome_to_name: 'Welcome to %n!',


    home: 'Home',
    status: 'Status',
    leaderboard: 'Leaderboard',


    guild_settings: 'Server Settings',
    choose_guild_settings: 'Select the server you wish to configure.',
    settings_basic: 'Basic Settings',
    settings_guild_management: 'Server Management',
    settings_features_and_options: 'Features & Options',

    prefix_and_nickname: 'Prefix & Nickname',
    prefix_and_nickname_description: 'You can set how the Bot is called and its nickname.',
    prefix: 'Prefix',
    nickname: 'Nickname',
    nickname_hint: <Fragment>
        You can use <code>%p</code> to replace the prefix currently set and <code>%n</code> to replace the Bot&#39;s
        name.
    </Fragment>,

    time_and_language: 'Time & Language',
    guild_time_and_language_description: 'You can set the date & time, language used for some functions.',
    date_and_time: 'Date & Time',
    timezone: 'Time Zone',
    timezone_description: 'If you set the time zone to a geographic area you speak frequently, the date and time will be displayed for that area.',
    guild_language_description: 'Server-specific functions, such as the log function, will send messages in the language set here.',

    commands: 'Commands',
    commands_description: 'You can override command permissions and other settings.',
    commands_permissions_channels: 'Channel Permissions',
    commands_permissions_all_channels: 'All Channels',
    commands_permissions_roles: 'Role Permissions',
    commands_permissions_all_roles: '@everyone',
    commands_permissions_members: 'Member Permissions',
    command_manage: 'Manage Command',
    command_enabled: 'Enable Command',
    command_user_permissions: 'Required User Permissions',
    command_bot_permissions: 'Required Bot Permissions',
    command_permissions_channels: 'Channel Permissions Override',
    command_permissions_roles: 'Role Permissions Override',
    command_permissions_members: 'Member Permissions Override',

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
    activity_type: 'Activity Types',
    activity_type_playing_long: 'Playing the game',
    activity_type_playing_short: 'Playing',
    activity_type_playing_description: 'Assigns roles while playing a game with a specific name.',
    activity_type_streaming_long: 'Live Streaming',
    activity_type_streaming_short: 'Streaming',
    activity_type_streaming_description: 'Assign roles while streaming a specific title on YouTube or Twitch.',
    activity_type_listening_long: 'Playing music',
    activity_type_listening_short: 'Listening',
    activity_type_listening_description: 'Assigns roles while playing music with a specific name.',
    activity_type_watching_long: 'Watching video',
    activity_type_watching_short: 'Watching',
    activity_type_watching_description: 'Assigns roles while watching videos of specific titles.',
    activity_type_custom_status_long: 'Custom status being set',
    activity_type_custom_status_short: 'set',
    activity_type_custom_status_description: <Fragment>
        Grant a role when the user&apos;s custom status matches the name you set.
    </Fragment>,

    role_panels: 'Role Panels',

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
    music_default_volume: 'デフォルトの音量',
    music_timeout_seconds: '再生が終了した後にチャンネルから退出するまでの秒数',
    music_next_media_notification: '次のメディアを再生するときに通知を送信する',
    music_next_media_notification_description: 'この設定が有効であっても繰り返しが 1曲のみ の場合は通知されません。',
    music_sources: 'Source to play',
    music_source_youtube: 'YouTube',
    music_source_niconico: 'niconico',
    music_source_soundcloud: 'SoundCloud',
    music_source_twitch: 'Twitch',
    music_source_bandcamp: 'Bandcamp',
    music_source_vimeo: 'Vimeo',

    text_to_speech: 'Text to Speech',

    logging: 'Logging',
    logging_description: 'Events that happen on the server can be sent to a set channel.',
    logging_enabled: 'Enable Logging',
    logging_channel: 'Channel to send logs',
    logging_moderation: 'Moderation',
    logging_moderation_update: 'Change server settings',
    logging_moderation_kick: 'Member Kick',
    logging_moderation_prune: 'Prune Members',
    logging_moderation_ban: 'Member Ban',
    logging_moderation_unban: 'Unban a Member',
    logging_member: 'Member',
    logging_member_join: 'Member Join',
    logging_member_leave: 'Member Leave',
    logging_member_update: 'Update Member',
    logging_member_role_add: 'Assigning roles to members',
    logging_member_role_remove: 'Stripping members of their roles',
    logging_voice: 'Voice',
    logging_voice_join: 'Join Calling Channel',
    logging_voice_leave: 'Leave Calling Channel',
    logging_voice_move: 'Move Calling Channel',
    logging_voice_mute: 'Mute & Unmute Microphone',
    logging_voice_deafen: 'Mute & Unmute Speaker',
    logging_category: 'Category',
    logging_text_channel: 'Text Channel',
    logging_voice_channel: 'Voice Channel',
    logging_channel_permission_update: 'Changing Permission Settings',
    logging_role: 'Role',
    logging_emote: 'Emoji',
    logging_invite: 'Invite',
    logging_webhook: 'Webhook',
    logging_integration: 'Integration',
    logging_object_create: 'Create %n',
    logging_object_delete: 'Delete %n',
    logging_object_update: 'Update %n',
    logging_message: 'Message',
    logging_message_update: 'Edit Message (Change)',
    logging_message_delete: 'Delete Message',
    logging_message_purge: 'Purge Messages',
    logging_message_pin: 'Pinning Message',
    logging_message_unpin: 'Unpin a Message',


    user_settings: 'User Settings',
    user_time_and_language_description: 'You can set the date, time, and language used in the functions performed by the user.',
    user_language_description: 'Responses to commands you execute will be in the language you set here.',


    send_message_channel: 'Channel to send message',
    manage_disabled_channels: 'Manage Disabled Channels',
    manage_disabled_roles: 'Manage Disabled Roles',
    message_builder: 'Message Builder',
    customize_message: 'Customize Message',
    edit_message: 'Edit Message',
    about_this_settings: 'About this settings',
    notifications: 'Notifications',
    manage_account: 'Manage Account',


    site_settings: 'Site Settings',

    design_and_appearance: 'Design & Appearance',
    device_theme: 'Use device theme',
    light_theme: 'Light Theme',
    dark_theme: 'Dark Theme',

    language: 'Language',
    japanese: '🇯🇵 日本語 (日本)',
    english: '🇺🇸 English (United States)'
};

export const localizationEn: Localization = {
    locale: 'en',
    translations: translationsEn
};
