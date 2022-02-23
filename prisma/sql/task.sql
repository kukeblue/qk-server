CREATE TABLE `task` (
    `id` bigint(18) NOT NULL AUTO_INCREMENT,
    `date` varchar(50) NOT NULL DEFAULT '',
    `taskNo` varchar(50) NOT NULL DEFAULT '',
    `deviceId` int(10),
    `accountId` int(10),
    `name` varchar(50) NOT NULL DEFAULT '',
    `startTime` int(10),
    `updateTime` int(10),
    `endTime` int(10),
    `status` varchar(50) NOT NULL DEFAULT '',
    `income` int(10),
    `taskCount` int(5),
    `realIncome` int(10),
    `note` TEXT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=gbk
