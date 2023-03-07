CREATE TABLE `vip_card` (
      `id` bigint(18) NOT NULL AUTO_INCREMENT,
      `level` int(2), NOT NULL DEFAULT 1,
      `createdTime` int(10),
      `endTime` int(10),
      `type` int(6),
      PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=gbk
