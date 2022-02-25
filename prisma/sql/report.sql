CREATE TABLE `report` (
    `id` bigint(18) NOT NULL AUTO_INCREMENT,
    `type` varchar(10) NOT NULL DEFAULT '',
    `date` varchar(20) NOT NULL unique,
    `time` int(10),
    `income` int(10),
    `expend` int(5),
     PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=gbk
