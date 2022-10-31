CREATE TABLE `unload_directive_config` (
  `id` bigint(18) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL DEFAULT '',
  `config` text NOT NULL DEFAULT '',
  `createTime` int(10),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8
