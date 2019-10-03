<?php
// Load the database configuration file
require_once 'dbConfig.php';

// Get and decode the POST data
$userData = json_decode($_POST['userData']);

if(!empty($userData)){
    $oauth_uid  = !empty($userData->id)?$userData->id:'';

    $query = "SELECT username, currency, carboin FROM gamers WHERE oauth_uid = '".$oauth_uid."'";  //This is where I specify what data to query
    $result = $db->query($query);

    $data = mysqli_fetch_assoc($result);
    $data1 = $data['username'];
    $data2 = $data['currency'];
    $data3 = $data['carboin'];

    /*
    while($enr = mysqli_fetch_assoc($result)){
      $data1 =
        $a = array($enr['username'], $enr['currency'], $enr['carboin']);
        array_push($data, $a);
    }
    */

    $msg->action = 'get_gamer_info';
    $msg->username = $data1;
    $msg->currency = $data2;
    $msg->carboin = $data3;
    echo json_encode($msg);

    $db->close();
    return true;
}
$db->close();
?>
