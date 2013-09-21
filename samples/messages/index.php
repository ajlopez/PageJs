<?
    $message = 'world';
?>
<h1>Hello <?= $message ?></h1>
<?
    $k = 1;
    while ($k <= 6) { 
?>
<h2>Message <?= $k ?></h2>
<?
        $k = $k + 1;
    }
?>

