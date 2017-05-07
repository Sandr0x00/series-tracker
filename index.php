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
                <li><a id="plus" class="btn btn-default" type="button"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a></li>
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
require_once 'helper.php';
require_once 'FileHandler.php';

$titelList = array();

$serien = FileHandler::read();

foreach ($serien as $title => $serie) {
    //settype($serie, 'Serie/Serie');
    $titel_ = str_replace(' ', '_', $title);

    // try to find image for serie
    $imgLocation = '';
    for ($h = 300; $h <= 500; $h += 100) {
        $imgLocation = "img/$h/$title.jpg";
        if (file_exists($imgLocation)) {
            break;
        }
    }
    if (!file_exists($imgLocation)) {
        // no image found
        $imgLocation = null;
    }
    // write html
    ?>
    <a class="series <?= $serie->class ?>" id="<?= $titel_ ?>"
        <?php
        if ($imgLocation != null) { ?>
       style="background-image: url('<?= str_replace('\'', '\\\'', $imgLocation) ?>');"
        <?php }
        ?>
    ><span class="shadow <?= $serie->class ?>" id="<?= $titel_ ?>1"><br><?= $serie->status ?></span>
    </a>
    <?php
    // add serie to array for auto completion
    array_push($titelList, $title);
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
    <?php
    foreach ($titelList as $element) {
        echo "<option value='$element'/>";
    }
    ?>
</datalist>
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="bootstrap-3.3.5/js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/series.js"></script>
</body>
</html>