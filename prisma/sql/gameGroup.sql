CREATE TABLE `game_group` (
    `id` bigint(18) NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL DEFAULT '',
    `userId` bigint(18),
    `gameServer` varchar(50) NOT NULL DEFAULT '',
    `type` varchar(50) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=gbk
