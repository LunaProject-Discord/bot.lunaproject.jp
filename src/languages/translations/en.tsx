'use client';

import React, { Fragment } from 'react';
import { Code } from '../../components/text';
import { Translation } from '../../interfaces/language';

const En: Translation = {
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    info: 'Info',
    loading: 'Loading...',
    login: 'Login',
    logout: 'Logout',
    enabled: 'Enabled',
    disabled: 'Disabled',
    add: 'Add',
    remove: 'Remove',
    edit: 'Edit',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    reset: 'Reset',


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
        You can use <Code>%p</Code> to replace the prefix currently set and <Code>%n</Code> to replace the Bot&#39;s
        name.
    </Fragment>,
    time_and_language: 'Time & Language',
    time_and_language_description: 'You can set the date & time, language used for some functions.',
    date_and_time: 'Date & Time',
    timezone: 'Time Zone',
    timezone_description: 'If you set the time zone to a geographic area you speak frequently, the date and time will be displayed for that area.',
    language_description: 'Server-specific functions, such as the log function, will send messages in the language set here.',
    settings_features_and_options: 'Features & Options',
    welcome_message: 'Welcome Message',
    welcome_message_description: 'Messages can be sent when a user joins the server.',
    welcome_message_enabled: 'Enable Welcome Message',
    welcome_message_hint: <Fragment>
        <b>The following placeholder can be set to replace the user&#39;s name, etc.</b>
        <ul style={{ marginTop: 4, marginBottom: 0, padding: 0, listStyle: 'none' }}>
            <li>Server ID: <Code>{'{'}guild:id{'}'}</Code></li>
            <li>Server Name: <Code>{'{'}guild:name{'}'}</Code></li>
            <li>Server Members Count: <Code>{'{'}guild:members{'}'}</Code></li>
            <li>Rule channel mentions (if set): <Code>{'{'}guild:rules{'}'}</Code></li>
            <li>User ID: <Code>{'{'}user:id{'}'}</Code></li>
            <li>User Name: <Code>{'{'}user:name{'}'}</Code></li>
            <li>User Discriminator: <Code>{'{'}user:discriminator{'}'}</Code></li>
            <li>User Mention: <Code>{'{'}user:mention{'}'}</Code></li>
        </ul>
    </Fragment>,
    goodbye_message: 'Goodbye Message',
    goodbye_message_description: 'A message can be sent when a user leaves the server.',
    goodbye_message_enabled: 'Enable Goodbye Message',
    goodbye_message_hint: <Fragment>
        <b>The following placeholder can be set to replace the user&#39;s name, etc.</b>
        <ul style={{ marginTop: 4, marginBottom: 0, padding: 0, listStyle: 'none' }}>
            <li>Server ID: <Code>{'{'}guild:id{'}'}</Code></li>
            <li>Server Name: <Code>{'{'}guild:name{'}'}</Code></li>
            <li>Server Members Count: <Code>{'{'}guild:members{'}'}</Code></li>
            <li>User ID: <Code>{'{'}user:id{'}'}</Code></li>
            <li>User Name: <Code>{'{'}user:name{'}'}</Code></li>
            <li>User Discriminator: <Code>{'{'}user:discriminator{'}'}</Code></li>
            <li>User Mention: <Code>{'{'}user:mention{'}'}</Code></li>
        </ul>
    </Fragment>,
    level: 'Level',
    level_description: 'Experience is awarded based on the number of statements made by members, which can be used to activate the server.',
    level_enabled: 'Enable Level',
    level_experience_per_message: 'Experience per message',
    level_manage: 'Manage Levels',
    level_manage_disabled_channels_description: 'If you speak on one of the set channels, the level will not be raised.',
    level_manage_disabled_roles_description: 'If one of the set roles is assigned to the user, the level will not be raised.',
    level_reward: 'Reward',
    level_reward_type: 'Method of Assignment of Roles',
    level_reward_type_stack: 'Retain previous roles',
    level_reward_type_stack_description: 'The new roles is granted while maintaining the roles previously granted as compensation.',
    level_reward_type_replace: 'Replaces a previous roles',
    level_reward_type_replace_description: 'Only roles closest to the user\'s level will be awarded, and all previously earned roles will be stripped.',
    level_reward_remove_role_demoted: 'Revoke the role when the level is demoted',
    level_reward_manage_roles: 'Manage Roles',
    level_notification: 'Notification',
    level_notification_type: 'Notification Methods',
    level_notification_type_disabled: 'Disabled',
    level_notification_type_direct_message: 'Send to direct message',
    level_notification_type_latest_channel: 'Channel on which the last message was sent',
    level_notification_type_custom_channel: 'Send to the set channel',
    level_notification_channel: 'The channel to which notifications will be sent',
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
    quote: 'Quote',
    music: 'Music',
    text_to_speech: 'Text to Speech',
    logging: 'Logging',
    send_message_channel: 'Channel to send message',
    manage_disabled_channels: 'Manage Disabled Channels',
    manage_disabled_roles: 'Manage Disabled Roles',
    message_builder: 'Message Builder',
    edit_message: 'Edit Message',
    about_this_settings: 'About this settings',
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
