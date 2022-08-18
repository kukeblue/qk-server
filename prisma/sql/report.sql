CREATE TABLE `report` (
    `id` bigint(18) NOT NULL AUTO_INCREMENT,
    `type` varchar(10) NOT NULL DEFAULT '',
    `date` varchar(20),
    `time` int(10),
    `taskCount` int(10),
    `income` float(4,2),
    `expend` float(4,2),
    `userId` bigint(18),
    `gameId` varchar(18),
    `groupId` bigint(18),
    `note` varchar(100) DEFAULT '',
    `profit` float(4,2),
     PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=gbk
