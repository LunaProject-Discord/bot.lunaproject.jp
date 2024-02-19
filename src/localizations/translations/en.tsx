import { Localization, Translations } from '@interfaces/localization';
import React, { Fragment } from 'react';

export const translationsEn: Translations = {
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    information: 'Information',
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
    undo: 'Undo',
    redo: 'Redo',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    reset: 'Reset',
    discard_changes: 'Discard Changes',
    open: 'Open',
    close: 'Close',
    move_up: 'Move Up',
    move_down: 'Move Down',
    duplicate: 'Duplicate',


    shard: 'Shard',
    shards: 'Shards',
    ping: 'Ping',
    guild: 'Server',
    guilds: 'Servers',
    channel: 'Channel',
    channels: 'Channels',
    role: 'Role',
    roles: 'Roles',
    emoji: 'Emoji',
    emojis: 'Emojis',
    member: 'Member',
    members: 'Members',
    user: 'User',
    users: 'Users',


    online: 'Online',
    offline: 'Offline',

    status: 'Status',
    status_connecting: 'Connecting...',
    status_connected: 'Connected',
    status_disconnected: 'Disconnected',
    status_waiting_reconnect: 'Waiting for reconnection...',
    status_reconnecting: 'Reconnecting...',
    status_shutting_down: 'Shutting down...',
    status_shutdown: 'Shutdown',
    status_failed_to_login: 'Failed to login',


    permission: 'Permission',
    permissions: 'Permissions',

    permissions_advanced: 'Advanced Permissions',
    permission_8: 'Administrator',

    permissions_general: 'General Permissions',
    permission_32: 'Manage Server',
    permission_16: 'Manage Channels',
    permission_268435456: 'Manage Roles',
    permission_536870912: 'Manage Webhooks',
    permission_1073741824: 'Manage Emoji, Stickers and Sounds',
    permission_128: 'View Audit Log',
    permission_524288: 'View Server Insights',
    permission_2199023255552: 'View Creator Monetization Analytics',
    permission_1024: 'View Channels',

    permissions_membership: 'Membership Permissions',
    permission_1: 'Create Invite',
    permission_67108864: 'Change Nickname',
    permission_134217728: 'Manage Nicknames',
    permission_1099511627776: 'Timeout Members',
    permission_2: 'Kick Members',
    permission_4: 'Ban Members',

    permissions_text: 'Text Channel Permissions',
    permission_2048: 'Send Messages',
    permission_4096: 'Send Text-to-Speech Messages',
    permission_70368744177664: 'Send Voice Messages',
    permission_65536: 'Read Message History',
    permission_32768: 'Attach Files',
    permission_16384: 'Embed Links',
    permission_262144: 'Use External Emoji',
    permission_137438953472: 'Use External Stickers',
    permission_64: 'Add Reactions',
    permission_131072: 'Mention @everyone, @here and All Roles',
    permission_8192: 'Manage Messages',
    permission_2147483648: 'Use Application Commands',

    permissions_thread: 'Thread Permissions',
    permission_274877906944: 'Send Messages in Threads',
    permission_34359738368: 'Create Public Threads',
    permission_68719476736: 'Create Private Threads',
    permission_17179869184: 'Manage Threads',

    permissions_voice: 'Voice Channel Permissions',
    permission_1048576: 'Connect',
    permission_2097152: 'Speak',
    permission_512: 'Stream',
    permission_549755813888: 'Use Activities',
    permission_4398046511104: 'Use Soundboard',
    permission_35184372088832: 'Use External Sounds',
    permission_33554432: 'Use Voice Activity',
    permission_256: 'Priority Speaker',
    permission_4194304: 'Mute Members',
    permission_8388608: 'Deafen Members',
    permission_16777216: 'Move Members',

    permissions_stage: 'Stage Channel Permissions',
    permission_4294967296: 'Request to Speak',

    permissions_events: 'Events Permissions',
    permission_8589934592: 'Manage Events',


    pattern_date: 'EEEE, MMMM d, yyyy',
    pattern_time: 'hh:mm a',
    pattern_datetime: 'EEEE, MMMM d, yyyy hh:mm a',


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

    error_guild_not_found_title: 'Server not found!',
    error_guild_not_found_description: <Fragment>
        The specified server could not be found.<br />
        You are not a member of that server or the server may not exist.<br />
        If it is clear that the server does exist, please switch to another account and try again.
    </Fragment>,
    error_member_not_found_title: 'Member not found!',
    error_member_not_found_description: <Fragment>
        No members matching the specified keywords were found.<br />
        Please change your search keywords and try again.<br />
        If it is obvious that the member has joined the server, try specifying the ID directly.
    </Fragment>,


    welcome: 'Welcome',
    welcome_to_name: 'Welcome to %n!',


    home: 'Home',
    back_to_home: 'Back to Home',


    status_description: 'You can check the status of the Bot.',
    status_all_connected: 'All shards are connected properly.',
    status_any_connected: 'Some shards may not be connected!',
    status_all_disconnected: 'All shards are either in preparation or not connected to Discord!',
    status_shard_with_id: 'Shard #%id',
    status_average_ping: 'Average Ping',
    status_mutual_guilds: 'Mutual Servers',
    status_mutual_guilds_with_count: '%c mutual servers',
    status_mutual_guilds_empty: 'No mutual servers',
    status_mutual_guilds_not_logged_in: 'You can view mutual servers by logging in.',


    leaderboard: 'Leaderboard',
    leaderboard_description: 'Select the server on which you want to display the leaderboard.',
    leaderboard_profile_card: 'Your Information',
    leaderboard_profile_card_total_experience: 'Experience at level %level',
    leaderboard_profile_card_current_experience: 'Experience gained',
    leaderboard_profile_card_remaining_experience: 'Required remaining experience',


    dashboard: 'Dashboard',
    dashboard_error_manage_roles_empty_dialog_title: 'No registered roles!',
    dashboard_error_manage_roles_empty_dialog_description: 'Role can be added by clicking on the button in the upper right corner.',
    dashboard_error_cannot_be_enabled_alert_title: 'This setting cannot be enabled!',


    guild_settings: 'Server Settings',
    guild_settings_description: 'Select the server you wish to configure.',
    add_bot: 'Add Bot',
    back_to_select_guild: 'Back to Select Server',
    settings_basic: 'Basic Settings',
    settings_guild_management: 'Server Management',
    settings_moderation_and_management: 'Moderation & Management',
    settings_features_and_options: 'Features & Options',

    prefix_and_nickname: 'Prefix & Nickname',
    prefix_and_nickname_description: 'You can set how the Bot is called and its nickname.',
    prefix: 'Prefix',
    nickname: 'Nickname',
    nickname_description: <Fragment>
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

    automod: 'AutoMod',

    role_permissions: 'Check Role Permissions',
    role_permissions_description: 'Displaying the roles and their permissions set for the server can be helpful in setting permissions.',
    role_permissions_select_roles: 'Select the permissions you wish to display',
    role_permissions_how_to: 'How to read the table',
    role_permissions_how_to_description_yes: 'is granted that permission.',
    role_permissions_how_to_description_no: 'is not granted that permission.',
    role_permissions_how_to_description_inherited_everyone: 'means that @everyone has been granted permission and therefore inherits it.',
    role_permissions_how_to_description_inherited_administrator: 'means that the role has been granted administrator permission and therefore inherits it.',
    role_permissions_how_to_description_deletable: 'means that the permission has already been granted by some factor and there is no problem with revoking it.',
    role_permissions_grid_yes: 'Permission granted',
    role_permissions_grid_no: 'Permission not granted',
    role_permissions_grid_inherited_everyone: 'Permission granted to @everyone',
    role_permissions_grid_inherited_administrator: 'Administrator permission has been granted for this role',
    role_permissions_grid_deletable: 'I can revoke your permission from this role',

    welcome_message: 'Welcome Message',
    welcome_message_description: 'Messages can be sent when a user joins the server.',
    welcome_message_enabled: 'Enable Welcome Message',
    welcome_message_edit_description: 'Customize the message sent when a user joins the server.',
    welcome_message_edit_hint: <Fragment>
        <b>The following placeholder can be set to replace the user&#39;s name, etc.</b>
        <ul className="mt-1">
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
        <ul className="mt-1">
            <li>Server ID: <code>{'{'}guild:id{'}'}</code></li>
            <li>Server Name: <code>{'{'}guild:name{'}'}</code></li>
            <li>Server Members Count: <code>{'{'}guild:members{'}'}</code></li>
            <li>User ID: <code>{'{'}user:id{'}'}</code></li>
            <li>User Name: <code>{'{'}user:name{'}'}</code></li>
            <li>User Discriminator: <code>{'{'}user:discriminator{'}'}</code></li>
            <li>User Mention: <code>{'{'}user:mention{'}'}</code></li>
        </ul>
    </Fragment>,

    member_join: 'Member Join',
    member_join_description: 'Messages can be sent when a member joins the server.',
    member_join_enabled: 'Enable Member Join',
    member_join_before_pending: 'When you join the server (before agreeing to the rules)',
    member_join_before_pending_enabled: 'Enable settings when joining a server',
    member_join_before_pending_message_enabled: 'Send a message when you join the server',
    member_join_before_pending_message_edit_description: 'Customize the message sent when a member joins the server.',
    member_join_before_pending_roles_enabled: 'Assign roles when you join the server',
    member_join_before_pending_role_type_everyone: '@everyone',
    member_join_before_pending_role_type_user: 'User',
    member_join_before_pending_role_type_bot: 'All Bot',
    member_join_before_pending_role_type_verified_bot: 'Verified Bot',
    member_join_before_pending_role_type_not_verified_bot: 'Unverified Bot',
    member_join_after_pending: 'When you agree to the rules',
    member_join_after_pending_error_cannot_be_enabled_alert_description: <Fragment>
        To continue, please enable the following settings in Discord.
        <ul className="list-disc mt-1 ps-5">
            <li>Community</li>
            <li>Rules Screening</li>
        </ul>
    </Fragment>,
    member_join_after_pending_enabled: 'Enable settings when agreeing to rules',
    member_join_after_pending_message_enabled: 'Send a message when you agree to the rules',
    member_join_after_pending_message_edit_description: 'You can customize the message that is sent when a member agrees to a rule.',
    member_join_after_pending_roles_enabled: 'Assign roles when you agree to the rules',
    member_join_message: 'Send Message',
    member_join_message_edit_hint: <Fragment>
        <b>The following placeholder can be set to replace the user&#39;s name, etc.</b>
        <ul className="mt-1">
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
    member_join_roles: 'Assignment of Roles',
    member_join_manage_roles: 'Manage Roles',

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
    rank: 'Rank',
    level_error_invalid_type_level_or_experience: 'Only whole numbers can be specified for level and experience!',
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
        <ul className="mt-1">
            <li>Server ID: <code>{'{'}guild:id{'}'}</code></li>
            <li>Server Name: <code>{'{'}guild:name{'}'}</code></li>
            <li>User ID: <code>{'{'}user:id{'}'}</code></li>
            <li>User Name: <code>{'{'}user:name{'}'}</code></li>
            <li>User Discriminator: <code>{'{'}user:discriminator{'}'}</code></li>
            <li>User Mention: <code>{'{'}user:mention{'}'}</code></li>
            <li>Tentative ranking before change: <code>{'{'}rank:old{'}'}</code></li>
            <li>Tentative ranking after change: <code>{'{'}rank:new{'}'}</code></li>
            <li>Level before change: <code>{'{'}level:old{'}'}</code></li>
            <li>Level after change: <code>{'{'}level:new{'}'}</code></li>
            <li>Experience before the change: <code>{'{'}xp:old{'}'}</code></li>
            <li>Experience after change: <code>{'{'}xp:new{'}'}</code></li>
            <li>Maximum experience before change: <code>{'{'}max_xp:old{'}'}</code></li>
            <li>Maximum experience after change: <code>{'{'}max_xp:new{'}'}</code></li>
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

    quote: 'Message Quote',
    quote_description: 'You can quote and share messages.',
    quote_enabled: 'Enable Quote',
    quote_reaction: 'Add 📝 reactions to messages to allow quoting',
    quote_message: 'Message sent Read the link and be able to quote it',
    quote_other_guild_to_this_guild: 'Allow users to quote messages sent to other servers',
    quote_this_guild_to_other_guild: 'Allow messages sent to this server to be quoted on other servers',
    quote_manage_disabled_channels_description: 'Disables quoting on the set channel.',
    quote_manage_disabled_roles_description: 'If one of the set positions is assigned to the user, the user will not be able to quote.',

    music: 'Media (Music)',
    music_description: 'Media uploaded on YouTube and other sites can be played on the voice channel.',
    music_enabled: 'Enable Music',
    music_web_panel: 'Enable the web panel to enable playback and other operations',
    music_default_volume: 'Default volume',
    music_timeout_seconds: 'Number of seconds to exit the channel after playback ends',
    music_next_media_notification: 'Send a notification when the next piece of media is to be played',
    music_next_media_notification_description: 'Even if this setting is enabled, you will not be notified if only one song is repeated.',
    music_sources: 'Source to play',
    music_source_youtube: 'YouTube',
    music_source_youtube_error_cannot_be_enabled_alert_description: <Fragment>
        Currently, due to limitations on the YouTube side, it is not possible to playback the video.<br />
        Therefore, this setting is forced to be disabled on all servers.
    </Fragment>,
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


    save_confirm: 'Do you want to save changes?',
    save_confirm_changes: '%c Change(s) Found',
    save_confirm_issues: '%c Problem(s) Found',

    save_confirm_data: 'Do you want to save your data?',
    save_confirm_settings: 'Do you want to save your settings?',
    save_confirm_settings_error_cannot_save_alert_title: 'There is a problem with %c!',
    save_confirm_settings_error_cannot_save_alert_description: 'Cannot save settings.',


    statistics: 'Statistics',
    statistics_description: 'Displays Bot statistics.',
    statistics_mode: 'View Mode',
    statistics_mode_hours: 'Hourly (Last 24 hours)',
    statistics_mode_days: 'Daily',
    statistics_mode_weeks: 'Weekly',
    statistics_mode_months: 'Monthly',
    statistics_period: 'View Period',
    statistics_period_from: 'From',
    statistics_period_to: 'To',
    statistics_widget_live: 'Live value',
    statistics_widget_min: 'Minimum value for this period',
    statistics_widget_max: 'Maximum value for this period',
    statistics_table_date: 'Date',
    statistics_table_total: 'Total',
    statistics_table_shard_with_id: 'Shard #%id',


    send_message_channel: 'Channel to send message',
    manage_disabled_channels: 'Manage Disabled Channels',
    manage_disabled_roles: 'Manage Disabled Roles',


    message_builder: 'Message Builder',
    message_builder_editor: 'Editor',
    message_builder_preview: 'Preview',
    message_builder_light_theme: 'Change to a light theme',
    message_builder_dark_theme: 'Change to a dark theme',
    message_builder_cozy_mode: 'Change to cozy mode',
    message_builder_compact_mode: 'Change to compact mode',

    customize_message: 'Customize Message',
    edit_message: 'Edit Message',


    about_this_settings: 'About this settings',


    lunaproject_services: 'Luna Project Services',
    lunaproject_document: 'Luna Project Document',
    lunaproject_account: 'Luna Project Account',


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
