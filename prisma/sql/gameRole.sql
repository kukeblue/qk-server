CREATE TABLE `game_role` (
    `id` bigint(18) NOT NULL AUTO_INCREMENT,
    `accoutId`  bigint(18),
    `userId` bigint(18),
    `gameServer` varchar(50) NOT NULL DEFAULT '',
    `work`  varchar(50) NOT NULL DEFAULT '',
    `status`  varchar(50) NOT NULL DEFAULT '',
    `name`  varchar(50) NOT NULL DEFAULT '',
    `level` int(10),
    `gameId`  varchar(50) NOT NULL DEFAULT '',
    `groupId` bigint(18),
    PRIMARY KEY (`id`)

) ENGINE=InnoDB  DEFAULT CHARSET=gbk
