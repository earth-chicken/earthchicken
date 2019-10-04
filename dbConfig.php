<?php
// Database configuration
$dbHost     = "us-cdbr-iron-east-05.cleardb.net";
$dbUsername = "ba8df658a414c9";
$dbPassword = "c5eabe84";
$dbName     = "heroku_67e77e10602a053";

// Create database connection
$db = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

// Check connection
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}
