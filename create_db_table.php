<?php
$dbhost = 'localhost';
$dbuser = 'jan';
$dbpass = 'jan';
$conn = mysqli_connect($dbhost, $dbuser, $dbpass);
if(! $conn )
{
  die('Could not connect: ' . mysql_error($conn));
}
echo "\n Connected successfully";

mysqli_select_db($conn, 'first_db' );

$sql = file_get_contents('create_table_users.sql');
$retval = mysqli_query( $conn, $sql);
if(! $retval )
{
  print("\n Could not create table: " . mysqli_error($conn));
}

$sql = file_get_contents('create_table_gamers.sql');
$retval = mysqli_query( $conn, $sql);
if(! $retval )
{
  print("\n Could not create table: " . mysqli_error($conn));
}

echo "\n Table created successfully";
mysqli_close($conn);
?>

