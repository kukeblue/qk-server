CREATE TABLE `unload_directive` (
  `id` bigint(18) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL DEFAULT '',
  `gameId` varchar(50) NOT NULL DEFAULT '',
  `targetId` varchar(50),
  `status` varchar(50) NOT NULL DEFAULT '',
  `data` text NOT NULL DEFAULT '',
  `config` text NOT NULL DEFAULT '',
  `total` int(10),
  `classifyNo` varchar(50),
  `totalPrice` int(10),
  `createTime` int(10),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8
