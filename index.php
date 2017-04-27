<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="content-type" content="text/html;"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="img/favicon.png" type="image/png">
    <link type='text/css' href="bootstrap-3.3.5/css/bootstrap.min.css" rel="stylesheet">
    <link type="text/css" href="css/series.css" rel="stylesheet">
    <title>Serien</title>
    <base target="_self">
</head>
<body>
<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header pull-left">
            <ul class="nav">
                <li><a id="plus" class="btn btn-default" type="button"> <span class="glyphicon glyphicon-plus"
                                                                              aria-hidden="true"></span></a></li>
            </ul>
        </div>
        <div class="navbar-header pull-right">
            <ul class="nav">
                <li><a id="refresh" href="javascript:refresh();" class="btn btn-default" type="button"> <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a></li>
            </ul>
        </div>
    </div>
    <!-- /.container-fluid -->
</nav>

<?php
require 'helper.php';

$serien = file('status.txt');

$titelList = array();

foreach ($serien as $zeile) {
    if (!Helper::startsWith($zeile, '#')) {
        $serie = explode(SEPARATOR, $zeile);
        $titel = $serie['0'];
        $serie['1'] = trim($serie['1']);
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
                list ($width, $height, $type, $attr) = getimagesize($imgLocation);
                break;
            }
        }
        if (!file_exists($imgLocation)) {
            $imgLocation = null;
        }
        ?>
        <a class="series <?= $class ?>" id="<?= $titel_ ?>"
            <?php
            if ($imgLocation) { ?>
           style="background-image: url('<?= $imgLocation ?>');">
            <?php }
            ?>
            <span class="shadow" id="<?= $titel_ ?>1"><br><?= $serie['1'] ?></span>
        </a>
        <?php
        array_push($titelList, $titel);
    }
}
?>
<div id="bg"></div>
<div id="dialog">
    <img id="pic" src="" alt="" height="300px"/>
    <form id="form" action="javascript:void(0);">
        <input id="titel" name="titel" type="text" pattern="[a-zA-Z0-9]+([a-zA-Z0-9 \-]*[a-zA-Z0-9\-])*" required
               placeholder="Titel" autocomplete="off" list="titelList">
        <button id="SUP" class="btn btn-default" type="button">
            <span class="glyphicon glyphicon-plus" aria-hidden="true"> </span>
        </button>
        <input id="stand" name="stand" type="text" pattern="^((S|B)[0-9x]{2}E[0-9x]{2}|E[0-9x]{5})$" required
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
    <?php foreach ($titelList as $element) { ?>
        <option value="<?= $element ?>"/>
    <?php } ?>
</datalist>
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="bootstrap-3.3.5/js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/series.js"></script>
</body>
</html>