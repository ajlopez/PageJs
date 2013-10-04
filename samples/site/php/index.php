<?
    $title = 'Home';
    $message = 'world';
    include('header.php');
?>
<h2>Hello <?= $message ?></h2>
<?
    $k = 1;
    while ($k <= 6) { 
?>
<h3>Message <?= $k ?></h3>
<?
        $k = $k + 1;
    }
    include('footer.php');
?>

