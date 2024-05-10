<?php
$servername = "localhost";
$username = "root";
$password = "fewf77895";
$dbname = "demo";

// 建立連線
$conn = new mysqli($servername, $username, $password, $dbname);

// 檢查連線
if ($conn->connect_error) {
  die("連線失敗: " . $conn->connect_error);
}else{
    echo '連線成功';
}

?>