CREATE TABLE `game_account` (
  `id` bigint(18) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `nickName` varchar(50) NOT NULL DEFAULT '',
  `username` varchar(50) NOT NULL DEFAULT '',
  `password` varchar(50) NOT NULL DEFAULT '',
  `gameServer` varchar(10) NOT NULL DEFAULT '',
  `online` varchar(10) NOT NULL DEFAULT '',
  `userId` bigint(18),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=gbk
