<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="content-type" content="text/html;"/>
    <!--meta name="viewport" content="width=device-width, initial-scale=1"-->
    <meta name="viewport" content="maximum-scale=1">
    <link rel="icon" href="img/favicon.png" type="image/png">
    <!-- Bootstrap Standard Theme-->
    <link type='text/css' href="libs/bootstrap-4.0.0-beta.3/css/bootstrap.min.css" rel="stylesheet">
    <!-- Material Design Theme for Bootstrap -->
    <link type='text/css' href="css/bootstrap.min.css" rel="stylesheet">
    <!-- My Stylesheet -->
    <link type="text/css" href="css/series.css" rel="stylesheet">
    <!-- Material Icons -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <title>Serien</title>
    <base target="_self">
</head>
<body class="dark">
<nav id="nav" class="navbar navbar-static-top container-fluid">
    <div class="col-2">
        <a id="plus" class="float-left p-4" type="button"><i class="material-icons">add</i></a>
    </div>
    <div class="col-8">
        <input id="search" name="search" type="text" placeholder="Search" autocomplete="off" list="titelList">
    </div>
    <div class="col-2">
        <span id="circle"></span>
        <a id="info" class="float-right p-4" type="button"><i class="material-icons">info_outline</i></a>
    </div>
</nav>
<div id="seriesContent" class="container-fluid">
<?php
require_once 'server/Helper.php';
require_once 'server/FileHandler.php';
require_once 'server/DbConnectionMySql.php';

$titelList = array();

//$serien = FileHandler::read();
$serien = DbConnectionMySql::get_all_series();

foreach ($serien as $title => $serie) {
    //settype($serie, 'Serie/Serie');
    $titel_ = str_replace(' ', '_', $title);

    // try to find image for serie
    $imgLocation = "img/$title.jpg";
    if (!file_exists($imgLocation)) {
        // image does not exist in img/ directory, try sub directories
        for ($h = 300; $h <= 500; $h += 100) {
            $imgLocation = "img/$h/$title.jpg";
            if (file_exists($imgLocation)) {
                break;
            }
        }
    }
    if (!file_exists($imgLocation)) {
        // no image found
        $imgLocation = null;
    } else {
        $imgLocation = Helper::replaceHyphen($imgLocation);
    }
    $serie->image = $imgLocation;

    // add serie to array for auto completion
    array_push($titelList, Helper::replaceHyphen($title));
}
?>
</div> <!-- /container -->
<div id="overlay" class="container-fluid">
    <div id="bg" class="bg"></div>
    <div id="dialog" class="col-12 col-sm-12 offset-md-2 col-md-8 offset-lg-2 col-lg-8 offset-xl-3 col-xl-6">
        <div class="row">
            <div class="col-8 offset-2">
                <img id="pic" src=""/>
                <div id="drop_zone">Serien Bild</div>
            </div>
            <div class="col-2">
                <button id="close" class="btn btn-link" type="button">
                    <i class="material-icons">close</i>
                </button>
            </div>
        </div>
        <form id="form" action="javascript:void(0);">
            <div id="row-titel" class="row">
                <div class="col-12 offset-sm-2 col-sm-8">
                    <input id="titel" name="titel" type="text" pattern="[a-zA-Z0-9]+([a-zA-Z0-9 \-]*[a-zA-Z0-9\-])*" required
                           placeholder="Titel" autocomplete="off" list="titelList">
                </div>
                <div class="hidden-xs-down col-sm-2">
                    <button id="delete" class="btn btn-link" type="button">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="hidden-xs-down col-sm-2">
                    <button id="SUP" class="btn btn-link" type="button">
                        <i class="material-icons">add</i>&nbsp;
                    </button>
                </div>
                <div class="col-sm-8">
                    <input id="stand" name="stand" type="text" pattern="^((S|B)[0-9x]{2}E[0-9x]{2}|E[0-9x]{5})$" required
                           placeholder="N&auml;chste Episode" autocomplete="off">
                </div>
                <div class="hidden-xs-down col-sm-2">
                    <button id="EUP" class="btn btn-link" type="button">
                        <i class="material-icons">add</i>
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="offset-sm-2 col-sm-8">
                    <button id="submit" class="btn btn-link" type="button">
                        <i class="material-icons">done</i>
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
<datalist id="titelList">
    <?php
    foreach ($titelList as $element) {
        echo "<option value='$element'/>";
    }
    ?>
</datalist>
<!-- JQuery https://jquery.com/ -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="libs/jquery/jquery-3.2.1.min.js"><\/script>')</script>
<!-- Bootstrap https://v4-alpha.getbootstrap.com/ -->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script type="text/javascript" src="libs/jquery-circle/circle-progress.min.js"></script>
<script type="text/javascript" src="libs/bootstrap-4.0.0-beta.3/js/bootstrap.min.js"></script>
<!-- Lazy Loading http://jquery.eisbehr.de/lazy/ -->
<script type="text/javascript" src="libs/jquery-lazy/jquery.lazy.min.js"></script>
<!-- Fuse.js searching http://fusejs.io/ -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.2.0/fuse.min.js" integrity="sha256-CB/G+xw3ep7+dlklAxcIvF20YMfFtF+7xbtauQSMi78=" crossorigin="anonymous"></script><!-- Fill const -->
<script type="text/javascript">
   /* let allSeries = {
    <?php
    $first = true;
    foreach ($serien as $serie) {
        if ($first) {
            $first = false;
        } else {
            echo ",";
        }
        echo "'" . Helper::replaceHyphen($serie->title) . "': { status: '" . $serie->status . "', image: '" . $serie->image . "'}\n";
    }
    ?>
    };*/
</script>
<!-- MD5 https://github.com/blueimp/JavaScript-MD5 -->
<script type="text/javascript" src="js/md5.js"></script>
<!-- My JS -->
<script type="text/javascript" src="js/series.js"></script>
<script type="text/javascript" src="js/info.js"></script>
</body>
</html>