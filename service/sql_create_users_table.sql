CREATE TABLE users (
             id int(11) NOT NULL AUTO_INCREMENT,
             oauth_provider varchar(10) COLLATE utf8_unicode_ci NOT NULL,
             oauth_uid varchar(50) COLLATE utf8_unicode_ci NOT NULL,
             first_name varchar(25) COLLATE utf8_unicode_ci NOT NULL,
             last_name varchar(25) COLLATE utf8_unicode_ci NOT NULL,
             email varchar(50) COLLATE utf8_unicode_ci NOT NULL,
             locale varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
             picture varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
             username varchar(25) COLLATE utf8_unicode_ci NOT NULL,
             currency INT NOT NULL,
             carboin INT NOT NULL,
             now_rank INT NOT NULL,
             max_currency INT NOT NULL,
             max_carboin INT NOT NULL,
             max_rank INT NOT NULL,
             achieved datetime NOT NULL,
             created datetime NOT NULL,
             modified datetime NOT NULL,
             PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;