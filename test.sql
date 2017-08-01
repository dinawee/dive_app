USE dive_app;

SHOW tables;

DESC dive_operators;


DROP TABLE IF EXISTS dive_regions;
CREATE TABLE IF NOT EXISTS dive_regions
	(region_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	region_name VARCHAR(255) NOT NULL,
	region_array TEXT NOT NULL
);
/* ALTER TABLE regions 
    region_array JSON NOT NULL
*/


 DROP TABLE IF EXISTS divespots;
 CREATE TABLE IF NOT EXISTS divespots
	(divespot_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	divespot_name VARCHAR(255) NOT NULL,
	divespot_array TEXT NOT NULL,
    region_id INT UNSIGNED NOT NULL,
);

/* ALTER
    divespot_array JSON NOT NULL,
    FOREIGN KEY (`region_id`) REFERENCES `dive_regions` (`region_id`) ON UPDATE CASCADE
*/

DROP TABLE IF EXISTS dive_operators;

 CREATE TABLE IF NOT EXISTS `dive_operators` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `batch_id` varchar(64) DEFAULT NULL,
  `fb_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `divespot_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS users (
	`user_id` INT unsigned not null auto_increment PRIMARY KEY, 
    `created_at` datetime not null default current_timestamp,
    `updated_at` datetime not null default current_timestamp on update current_timestamp,
    `fb_id` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255),
    `last_name` VARCHAR(255),
    `email` VARCHAR(255),
    `access_token` VARCHAR(255),
    UNIQUE KEY (`fb_id`)
);


CREATE TABLE IF NOT EXISTS `user_dive_operators` (
	`user_dive_operator_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `user_id` INT UNSIGNED NOT NULL,
    `dive_operator_id` INT UNSIGNED NOT NULL,
	FOREIGN KEY (`dive_operator_id`) REFERENCES `dive_operators`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Deleting tables 
-- http://notes.jerzygangi.com/how-to-delete-all-rows-in-a-mysql-or-oracle-table/


-- Foreign Key Errors
-- https://www.percona.com/blog/2017/04/06/dealing-mysql-error-code-1215-cannot-add-foreign-key-constraint/
