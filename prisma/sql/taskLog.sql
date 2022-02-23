CREATE TABLE `task_log` (
    `id` bigint(18) NOT NULL AUTO_INCREMENT,
    `imei` varchar(50) NOT NULL DEFAULT '',
    `nickName` varchar(50) NOT NULL DEFAULT '',
    `taskNo` varchar(50) NOT NULL DEFAULT '',
    `deviceId` bigint(18),
    `accountId` bigint(18),
    `taskName` varchar(50) NOT NULL DEFAULT '',
    `type` varchar(10) NOT NULL DEFAULT '',
    `note` varchar(50) NOT NULL DEFAULT '',
    `taskCount` int(5) DEFAULT 0,
    `time` int(10),
     PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=gbk
