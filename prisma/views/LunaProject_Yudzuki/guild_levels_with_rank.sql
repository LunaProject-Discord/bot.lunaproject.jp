SELECT `A`.`guild_id`   AS `guild_id`,
       `A`.`user_id`    AS `user_id`,
       `B`.`rank`       AS `rank`,
       `A`.`level`      AS `level`,
       `A`.`experience` AS `experience`,
       `A`.`updated_at` AS `updated_at`,
       `A`.`created_at` AS `created_at`
FROM (
         `LunaProject_Yudzuki`.`guild_levels` `A`
             JOIN (SELECT `LunaProject_Yudzuki`.`guild_levels`.`guild_id` AS `guild_id`,
                          `LunaProject_Yudzuki`.`guild_levels`.`user_id`  AS `user_id`,
                          rank() OVER (
                              PARTITION BY `LunaProject_Yudzuki`.`guild_levels`.`guild_id`
                              ORDER BY
                                  `LunaProject_Yudzuki`.`guild_levels`.`level` DESC,
                                  `LunaProject_Yudzuki`.`guild_levels`.`experience` DESC
                              )                                           AS `rank`
                   FROM `LunaProject_Yudzuki`.`guild_levels`) `B` ON (
             (
                 (`A`.`guild_id` = `B`.`guild_id`)
                     AND (`A`.`user_id` = `B`.`user_id`)
                 )
             )
         )
ORDER BY `B`.`rank`,
         `A`.`user_id`
