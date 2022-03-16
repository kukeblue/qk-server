CREATE TABLE `user` (
      `id` bigint(18) NOT NULL AUTO_INCREMENT,
      `username` varchar(50) NOT NULL DEFAULT '',
      `password` varchar(45) NOT NULL DEFAULT '',
      PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=gbk
