<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html;" />
<meta http-equiv="expires" content="1209600" />
<meta http-equiv="last-modified" content="2016-02-09@09:12:33 GMT" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="img/favicon.png" type="image/png">
<link type='text/css' href="bootstrap-3.3.5/css/bootstrap.min.css" rel="stylesheet">
<title>Serien</title>
<?php
require 'helper.php';

?>
<style type='text/css'>
* {
  color: #333;
  text-align: center;
  text-decoration: none;
  padding: 0px;
  margin: 0px;
  outline: none;
  border: 0px;
  border-color: #333;
  border-style: solid;
}

body {
  /*font-size: 0*/;
}

.series {
  font-size: 0;
  display: inline-block;
  position: relative;
  width: <?= DISPLAY_WIDTH ?>px;
  overflow: hidden;
}

img {
  width: auto;
  z-index: 1;
}

.shadow {
  z-index: 2;
  font-size: 18px;
  position: absolute;
  bottom: 0;
  left: 0;
  background: url(img/bg_span.png) repeat-x;
  width: 130px;
  height: 50px;
  line-height: 18px;
  color: #fafafa;
}

.series.x {
  background: #555 url(img/<?= DISPLAY_HEIGHT ?>/x.png) no-repeat;
}

img.x {
  opacity: 0.6;
}

#bg, #dialog {
  z-index: 3;
  position: fixed;
  display: none;
}

#bg {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.8;
}

#dialog {
  top: 50%;
  left: 50%;
  background: #fff;
  width: 500px;
  margin-left: -250px;
  margin-top: -221px;
  opacity: none;
  font-size: 18px;
}

#pic, #titel {
  margin-top: 20px;
  border-width: 2px;
}

input, .input {
  position: absolute;
  left: 88px;
  width: 324px;
  background: #FFF;
  line-height: 30px;
}

input[readonly], .input[readonly] {
  background: #DDD;
}

input:valid, .input:valid {
  background: #DFD;
}

input:invalid, .input:invalid {
  background: #FDD;
  -moz-box-shadow: none;
}

#stand {
  bottom: 64px;
}

#SUP, #EUP {
  position: absolute;
  bottom: 64px;
  width: 34px;
  background: #FFF;
  height: 34px;
  line-height: 30px;
}

#SUP {
  left: 48px;
}

#EUP {
  left: 418px;
}

#submit {
  position: absolute;
  bottom: 20px;
  width: 324px;
  background: #FFF;
  height: 34px;
  line-height: 30px;
  font-weight: bold;
}

.btn, #dialog, input {
  border-width: 2px;
  padding: 0px 0px 0px 2px;
  border-color: #333;
  border-radius: 4px;
}

.navbar-nav>li>a {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.navbar {
  min-height: 42px !important;
  z-index: 5;
  border-radius: 0px 0px 4px 4px;
}
</style>
<base target="_self">
</head>
<body>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header pull-left">
        <ul class="nav">
          <li><a id="plus" class="btn btn-default" type="button"> <span
              class="glyphicon glyphicon-plus" aria-hidden="true"></span>
          </a></li>
        </ul>
      </div>
      <div class="navbar-header pull-right">
        <ul class="nav">
          <li><a id="refresh" href="javascript:refresh();"
            class="btn btn-default" type="button"> <span
              class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
          </a></li>
        </ul>
      </div>
    </div>
    <!-- /.container-fluid -->
  </nav>

<?php
$serien = file('status.txt');

$titelList = array ();

foreach ($serien as $zeile) {
  if (! Helper::startsWith($zeile, '#')) {
    $margin = '0px';
    $serie = explode(SEPARATOR, $zeile);
    $titel = $serie['0'];
    $serie['1'] = trim($serie['1']);
    if (sizeof($serie) > 2) {
      $margin = $serie['2'];
    }
    $titel_ = str_replace(' ', '_', $titel);
    if (Helper::endsWith($serie['1'], 'x')) {
      $class = 'x';
    } else {
      $class = '';
    }
    $imgLocation = '';
    for ($h = 300; $h <= 500; $h += 100) {
      $imgLocation = "img/$h/$titel.jpg";
      if (file_exists($imgLocation)) {
        if ($margin != '0px') {
          break;
        }
        list ( $width, $height, $type, $attr ) = getimagesize($imgLocation);
        $margin = '-' . round(($width * DISPLAY_HEIGHT / $height - DISPLAY_WIDTH) / 2) . 'px';
        break;
      }
    }
    if (! file_exists($imgLocation)) {
      $imgLocation = 'img/' . DISPLAY_HEIGHT . '/unknown.jpg';
    }
    // see series.js
    echo '<a class="series ' . $class . '" id="' . $titel_ . '">';
    echo '<img class="' . $class . '" id="' . $titel_ . '_pic" style="margin-left:' . $margin . ';" src="' . $imgLocation . '" height="' . DISPLAY_HEIGHT . 'px" width="' . DISPLAY_WIDTH . 'px" alt="' . $titel . '"/>';
    echo '<span class="shadow" id="' . $titel_ . '1"><br>' . $serie['1'] . '</span>';
    echo '</a>';
    echo "\n";
    array_push($titelList, $titel);
  }
}
?>
<div id="bg"></div>
  <div id="dialog">
    <img id="pic" src="" alt="" height="300px" />
    <form id="form" action="javascript:void(0);">
      <input id="titel" name="titel" type="text"
        pattern="[a-zA-Z0-9]+([a-zA-Z0-9 \-]*[a-zA-Z0-9\-])*" required
        placeholder="Titel" autocomplete="off" list="titelList">
      <button id="SUP" class="btn btn-default" type="button">
        <span class="glyphicon glyphicon-plus" aria-hidden="true"> </span>
      </button>
      <input id="stand" name="stand" type="text"
        pattern="^((S|B)[0-9x]{2}E[0-9x]{2}|E[0-9x]{5})$" required
        placeholder="N&auml;chste Episode" autocomplete="off">
      <button id="EUP" class="btn btn-default" type="button">
        <span class="glyphicon glyphicon-plus" aria-hidden="true"> </span>
      </button>
      <button id="submit" class="btn btn-default input" type="button">
        <span class="glyphicon glyphicon-ok" aria-hidden="true"> </span>
      </button>
    </form>
  </div>
  <datalist id="titelList">
    <?php
    foreach ($titelList as $element) {
      echo '<option value="' . $element . '" />';
    }
    ?>
</datalist>
  <script type="text/javascript" src="jquery.js"></script>
  <script type="text/javascript" src="bootstrap-3.3.5/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="series.js"></script>
</body>
</html>