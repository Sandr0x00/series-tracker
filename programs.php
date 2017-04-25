<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
       "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Programme</title>
</head>
<body>
    <h1>Programme:</h1>
    <table>
    <?php
    $links = array (
            "Notepad++" => "http://notepad-plus-plus.org/download/",
            // "Avira Antivir" => "http://www.avira.com/de/for-home",
            "Comodo Firewall" => "http://www.comodo.com/",
            "Mozilla Firefox" => "http://www.mozilla.org/de/firefox/new/",
            // "Trillian" => "http://www.trillian.im/",
            "Daemon Tools" => "http://www.daemon-tools.cc/deu/products/dtLite",
            "CCleaner" => "http://www.piriform.com/ccleaner",
            "Adobe Reader" => "http://get.adobe.com/de/reader/",
            "Adobe Flashplayer" => "http://get.adobe.com/de/flashplayer/",
            // "Adobe Shockwaveplayer" => "http://get.adobe.com/de/shockwave/",
            // "Adobe AIR" => "http://get.adobe.com/de/air/",
            // "O&O Defrag" => "Festplatte",
            "Rainmeter" => "http://rainmeter.net/cms/>",
            "Rainmeter Skins" => "http://browse.deviantart.com/customization/skins/sysmonitor/rainmeter/",
            "7-Zip" => "http://www.7-zip.org/",
            "JDownloader" => "http://jdownloader.org/",
            "Greenshot" => "http://getgreenshot.org/downloads/",
            "Grafikkartentreiber" => "http://support.amd.com/de/Pages/AMDSupportHub.aspx",
            "Java" => "http://www.oracle.com/technetwork/java/javase/downloads/",
            "VLC-Player" => "http://www.videolan.org/vlc/",
            "Mozilla Thunderbird" => "http://www.mozilla.org/de/thunderbird/",
            "Dropbox" => "http://www.dropbox.com/",
            // "Winamp" => "http://www.winamp.com/media-player/de",
            // "PorzessExplorer" => "http://technet.microsoft.com/de-de/sysinternals/bb896653",
            "League of Legends" => "http://euw.leagueoflegends.com/de",
            "Microsoft Office" => "Festplatte",
            "Adobe Photoshop CS5" => "Festplatte",
            "MP3-Gain" => "http://mp3gain.sourceforge.net/download.php",
            // "Tibia" => "http://www.tibia.com/news/?subtopic=latestnews",
            "EASEUS Partition Manager" => "http://www.partition-tool.com/",
            "WinMerge" => "http://winmerge.org/?lang=de",
            "WinMerge Plugin" => "http://freemind.s57.xrea.com/xdocdiffPlugin/en/index.html",
            "Atheros W-Lan Treiber" => "http://www.atheros.cz/",
            // "Resource Hacker" => "http://www.angusj.com/resourcehacker/",
            "MP3tag" => "http://www.mp3tag.de/download.html",
            "VMware Player" => "https://my.vmware.com/de/web/vmware/free#desktop_end_user_computing/vmware_player/4_0" 
    );
    
    foreach ($links as $name => $link) {
        echo "<tr><td>$name</td><td><a href=\"$link\">$link</a></td></tr>";
    }
    ?>
    </table>
</body>