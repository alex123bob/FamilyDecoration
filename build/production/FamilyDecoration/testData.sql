INSERT INTO `chart` (`id`, `chartId`, `chartCategory`, `chartContent`) VALUES
(13, 'chart-201411191102082014', '欧式家装', ''),
(14, 'chart-201411191110147930', '田园风情', '');

INSERT INTO `project` (`id`, `projectId`, `projectName`, `projectProgress`, `projectChart`, `projectTime`) VALUES
(1, '201411151611584156', '天棚工程', '培训完成，开始动工<>人员培训<>动工完成<>完成设计图纸<>开始刷墙<>开始动工<>开始动工<>材料进场<>设计重构', '1', '2014-04-15 00:00:00'),
(2, '201411151617138306', '西山美素', '人员资金链到位<>家装工程人员开始设计<>人员装备到齐<>材料入场', '', '2011-06-15 00:00:00');



INSERT INTO `basic_item` (`id`, `itemId`, `itemName`) VALUES
(2, 'basic-201411201511404897', '地面项目');

INSERT INTO `basic_sub_item` (`id`, `subItemId`, `subItemName`, `subItemUnit`, `mainMaterialPrice`, `auxiliaryMaterialPrice`, `manpowerPrice`, `machineryPrice`, `lossPercent`, `parentId`) VALUES
(1, 'basic-sub-201411211122554094', 'test', 'm', 1300, 1500, 120, 421, 0.12, 'basic-201411201511404897'),
(3, 'basic-sub-201411211124150352', 'test', 'm', 1300, 1500, 120, 421, 0.12, 'basic-201411201511404897'),
(4, 'basic-sub-201411211124150449', 'tese1', 'm', 11000, 112000, 312000, 3123000, 0.11, 'basic-201411201511404897'),
(5, 'basic-sub-201411211133166079', 'hhjkhkjhkj', 'km', 200300, 125, 12, 56020, 0.325647, 'basic-201411201511404897'),
(7, 'basic-sub-201411211144192332', 'tstasdakj', 'ajslf', 310, 12311, 123100, 123120, 0, 'basic-201411201511404897'),
(8, 'basic-sub-201411211144197031', 'jasldjflkal', 'jsadjflajl', 132300, 123412, 12100, 123100, 0.5, 'basic-201411201511404897'),
(9, 'basic-sub-201411211410361633', '测试项目', 'm', 12000, 12300, 12410, 122000, 0, 'basic-201411201511404897'),
(10, 'basic-sub-201411211424438095', '更改之后', 'sq', 11000, 21120, 123110, 1231342, 0.12, 'basic-201411201511404897');