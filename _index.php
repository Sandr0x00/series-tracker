<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html;">
<meta http-equiv="expires" content="1209600" >
<meta http-equiv="last-modified" content="2013-05-18@10:27:33 GMT" >
<title>Festplatte</title>
<style type='text/css'>
a{
display:inline-block;
height:200px;
width:200px;
text-align:center;
text-decoration:none;
font-size:50px;
font-family:Arial;
color:#000;
line-height:200px;
border:solid #000;
}
a:hover{
background:#eee;
}
img{
margin-top:40px;
}
div{
position:absolute;
display:block;
top:50%;
left:50%;
margin-top:-200px;
margin-left:-400px;
height:400px;
width:800px;
text-align:center;
}
</style>
<base target="_self">
</head>
<body>
<?php
$laufwerke = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function url_exists($url) {
  $url_headers = @get_headers($url);
  if($url_headers[0] == 'HTTP/1.1 404 Not Found') {
    return false;
  } else if ($url_headers[0] == 'HTTP/1.1 403 Forbidden') {
    return false;
  } else {
    return true;
  }
}

echo "<div>";
echo "<a href=\"serien.php\">Serien</a>";
for ($i = 0; $i < strlen($laufwerke); $i++) {
  if (url_exists("http://localhost/".strtolower($laufwerke[$i])."/index.php")) {
    echo "<a href=\"".strtolower($laufwerke[$i])."\">".$laufwerke[$i]."</a>";
  }
}
echo "</div>";
?>
</body>
</html>