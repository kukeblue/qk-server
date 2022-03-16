CREATE TABLE `device` (
  `id` bigint(18) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `deviceType` varchar(10) NOT NULL DEFAULT '',
  `imei` varchar(45) NOT NULL DEFAULT '',
  `brand` varchar(50) NOT NULL DEFAULT '',
  `robotName` varchar(10) NOT NULL DEFAULT '',
  `robotId` varchar(50) NOT NULL DEFAULT '',
  `status` varchar(10) NOT NULL DEFAULT '',
  `ip` varchar(10) NOT NULL DEFAULT '',
  `touchId` varchar(100) NOT NULL DEFAULT '',
  `userId` bigint(18) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=gbk
