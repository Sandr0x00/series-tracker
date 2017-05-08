<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="content-type" content="text/html;"/>
    <!--meta name="viewport" content="width=device-width, initial-scale=1"-->
    <link rel="icon" href="img/favicon.png" type="image/png">
    <link type='text/css' href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <link type='text/css' href="css/bootstrap.min.css" rel="stylesheet">
    <link type="text/css" href="css/series.css" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <title>Serien</title>
    <base target="_self">
</head>
<body>
<!--nav class="navbar navbar-dark bg-primary">
    <a class="navbar-brand" href="#">Navbar</a>
    <ul class="nav navbar-nav">
        <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item pull-xs-right">
            <a class="nav-link" href="#">Link on the Right</a>
        </li>
    </ul>
</nav-->
<nav class="navbar navbar-default navbar-toggleable-md navbar-static-top">
    <ul class="navbar-nav mr-auto">
        <li class="nav-item">
            <a id="plus" class="nav-link" type="button"><i class="material-icons">add</i></a>
        </li>
    </ul>
    <ul class="navbar-nav">
        <li class="nav-item">
            <a id="refresh" class="nav-link" href="javascript:refresh();" type="button"><i class="material-icons">loop</i></a>
        </li>
    </ul>
</nav>
<div id="seriesContent" class="container-fluid">
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
</div> <!-- /container -->
<div id="bg"></div>
<div id="dialog">
    <img id="pic" src="" alt="" height="300px"/>
    <form id="form" action="javascript:void(0);">
        <div>
            <input id="titel" name="titel" type="text" pattern="[a-zA-Z0-9]+([a-zA-Z0-9 \-]*[a-zA-Z0-9\-])*" required
                   placeholder="Titel" autocomplete="off" list="titelList">
        </div>
        <div>
            <button id="SUP" class="btn btn-link" type="button">
                <span class="material-icons">add</span>&nbsp;
            </button>
            <input id="stand" name="stand" type="text" pattern="^((S|B)[0-9x]{2}E[0-9x]{2}|E[0-9x]{5})$" required
                   placeholder="N&auml;chste Episode" autocomplete="off">
            <button id="EUP" class="btn btn-link" type="button">
                <i class="material-icons">add</i>
            </button>
        </div>
        <div>
            <button id="submit" class="btn btn-link" type="button">
                <i class="material-icons">done</i>
            </button>
        </div>
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
<script type="text/javascript" src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/series.js"></script>
</body>
</html>