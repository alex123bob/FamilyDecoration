ALTER TABLE `message` ADD `showTime` TIMESTAMP NULL DEFAULT NULL COMMENT 'for those message showed in a specific time for reminder' AFTER `readTime`;

update `system` set `paramValue`='version-8.1' where `id`='4';