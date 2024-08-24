SELECT `A`.`guild_id`   AS `guild_id`,
       `A`.`user_id`    AS `user_id`,
       `b`.`rank` AS `rank`,
       `A`.`level`      AS `level`,
       `A`.`experience` AS `experience`,
       `A`.`updated_at` AS `updated_at`,
       `A`.`created_at` AS `created_at`
FROM (
         `lunaproject_yudzuki`.`guild_levels` `A`
             JOIN (SELECT `lunaproject_yudzuki`.`guild_levels`.`guild_id` AS `guild_id`,
                          `lunaproject_yudzuki`.`guild_levels`.`user_id`  AS `user_id`,
                          rank() over (
                              PARTITION by `lunaproject_yudzuki`.`guild_levels`.`guild_id`
                              ORDER BY
                                  `lunaproject_yudzuki`.`guild_levels`.`level` DESC,
                                  `lunaproject_yudzuki`.`guild_levels`.`experience` DESC
                              )                                           AS `rank`
                   FROM `lunaproject_yudzuki`.`guild_levels`) `B` ON (
             `A`.`guild_id` = `b`.`guild_id`
                 AND `A`.`user_id` = `b`.`user_id`
             )
         )
ORDER BY `b`.`rank`,
         `A`.`user_id`
