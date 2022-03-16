CREATE TABLE `config_image` (
  `id` bigint(18) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `path` varchar(50) NOT NULL DEFAULT '',
  `taskId` int(10),
  `deviceId` int(10),
  `url` varchar(100) NOT NULL DEFAULT '',
  `userId` int(10),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=gbk
