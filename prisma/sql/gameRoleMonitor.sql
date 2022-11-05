CREATE TABLE `game_role_monitor` (
    `id` bigint(18) NOT NULL AUTO_INCREMENT,
    `userId`bigint(18) NOT NULL,
    `date` varchar(20),
    `roleId` bigint(18) NOT NULL,
    `work`  varchar(50) NOT NULL DEFAULT '',
    `status`  varchar(50) NOT NULL DEFAULT '',
    `name`  varchar(50) NOT NULL DEFAULT '',
    `gameServer` varchar(50) NOT NULL DEFAULT '',
    `gameId`  varchar(50) NOT NULL DEFAULT '',
    `groupId` bigint(18),
    `baotuCount` int(10),
    `cangkuCount` int(10),
    `amount` int(10),
    `lastIncome` int(10),
    `lastTime` int(10),
    PRIMARY KEY (`id`)

) ENGINE=InnoDB  DEFAULT CHARSET=gbk
