CREATE TABLE `game_group` (
    `id` bigint(18) NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL DEFAULT '',
    `userId` bigint(18),
    `gameServer` varchar(50) NOT NULL DEFAULT '',
    `type` varchar(50) NOT NULL DEFAULT '',
    `priceConfig` varchar(500) NOT NULL DEFAULT '"50铁=2,60铁=6,70铁=11,50书=0.5,60书=9,70书=2,宝图=2.5,红玛瑙=7,黑宝石=13,光芒石=4,月亮石=5,太阳石=6,50环=1.7,60环=17,70环=9,内丹=30,兽决=65,金柳露=6,定魂珠=130,金刚石=130,避水珠=5,龙鳞=40,夜光珠=90"',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=gbk
