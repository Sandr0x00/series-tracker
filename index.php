<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="content-type" content="text/html;"/>
    <!--meta name="viewport" content="width=device-width, initial-scale=1"-->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="icon" href="img/favicon.png" type="image/png">
    <!-- Bootstrap Standard Theme-->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <!-- Material Design Theme for Bootstrap -->
    <link type='text/css' href="css/bootstrap.min.css" rel="stylesheet">
    <!-- My Stylesheet -->
    <link type="text/css" href="css/series.css" rel="stylesheet">
    <link type="text/css" href="css/color.css" rel="stylesheet">
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
    <div class="d-none d-sm-block col-sm-1">
        <svg id="refresh" class="radial-progress" viewBox="0 0 30 30">
            <circle class="incomplete" cx="15" cy="15" r="10"></circle>
            <circle id="refresh-clock" class="complete" cx="15" cy="15" r="10"></circle>
        </svg>
    </div>
    <div class="col-2 col-sm-1">
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
</div>
<datalist id="titelList">
    <?php
    foreach ($titelList as $element) {
        echo "<option value='$element'/>";
    }
    ?>
</datalist>



<!-- JQuery https://jquery.com/ -->
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<!-- Bootstrap https://v4-alpha.getbootstrap.com/ -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
<!-- Lazy Loading http://jquery.eisbehr.de/lazy/ -->
<script type="text/javascript" src="libs/jquery-lazy/jquery.lazy.min.js"></script>
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
<script type="text/javascript" src="js/cookies.js"></script>
<script type="text/javascript" src="js/dialogs.js"></script>
<script type="text/javascript" src="js/fuzzy_search.js"></script>
<script type="text/javascript" src="js/interface.js"></script>
<script type="text/javascript" src="js/tooltip.js"></script>
</body>
</html>