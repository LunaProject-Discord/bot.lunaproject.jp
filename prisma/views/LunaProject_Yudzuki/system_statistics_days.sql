SELECT `A`.`id`                                  AS `id`,
       date_format(`A`.`created_at`, '%Y-%m-%d') AS `group_by`,
       `A`.`statuses`                            AS `statuses`,
       `A`.`pings`                               AS `pings`,
       `A`.`guilds`                              AS `guilds`,
       `A`.`channels`                            AS `channels`,
       `A`.`roles`                               AS `roles`,
       `A`.`emojis`                              AS `emojis`,
       `A`.`users`                               AS `users`,
       `A`.`updated_at`                          AS `updated_at`,
       `A`.`created_at`                          AS `created_at`
FROM (
         `lunaproject_yudzuki`.`system_statistics` `A`
             JOIN (SELECT max(`lunaproject_yudzuki`.`system_statistics`.`id`) AS `id`,
                          max(
                                  `lunaproject_yudzuki`.`system_statistics`.`created_at`
                          )                                                   AS `created_at`
                   FROM `lunaproject_yudzuki`.`system_statistics`
                   GROUP BY date_format(
                                    `lunaproject_yudzuki`.`system_statistics`.`created_at`,
                                    '%Y-%m-%d'
                            )) `B` ON (`A`.`id` = `b`.`id`)
         )
