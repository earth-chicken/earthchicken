CREATE TABLE gamers (
         id int(11) NOT NULL AUTO_INCREMENT,
         oauth_uid varchar(50) COLLATE utf8_unicode_ci NOT NULL,
         username varchar(25) COLLATE utf8_unicode_ci NOT NULL,
         currency INT NOT NULL,
         carboin INT NOT NULL,
         max_currency INT NOT NULL,
         max_carboin INT NOT NULL,
         rank INT NOT NULL,
         modified datetime NOT NULL,
         PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
