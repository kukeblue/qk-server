CREATE TABLE `task` (
  `id` bigint(18) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `startTime` DATETIME,
  `endTime` DATETIME,
  `status` varchar(50) NOT NULL DEFAULT '',
  `note` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=gbk
