<?php

function info($string) {
    echo 'info: ' . $string . "<br>";
    flush();
    ob_flush();
}

function dbLoad($sqlFile) {
    require_once('./deploy-config.php');
    try {
        $request = (object) array(
			'hostname' => DB_HOST,
			'username' => DB_USER,
			'password' => DB_PASSWORD,
			'databaseName' => DB_NAME,
		);
        $db = new PDO("mysql:host={$request->hostname}", $request->username, $request->password);
        $sql = <<<EOF
CREATE DATABASE IF NOT EXISTS {$request->databaseName} DEFAULT CHARACTER SET = 'utf8';
USE {$request->databaseName};
EOF;

        if ($db->exec($sql) === FALSE) {
            throw new Exception("DB creation: " . sprint_r($db->errorInfo()));
        };
        $db = new PDO("mysql:host={$request->hostname};dbname={$request->databaseName}", $request->username, $request->password);

        $sql = file_get_contents($sqlFile);
        $st = $db->prepare($sql,
            array(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => TRUE));
        if ($st->execute() === FALSE) {
            throw new Exception('Error: ' . sprint_r($db->errorInfo()));
        }
    } catch (Exception $e) {
        throw $e;
    }
}

header( 'Content-type: text/html; charset=utf-8' );
header('Content-Encoding: none');

info('configuring database...');
dbLoad('database.sql');
info('cleaning...');
// unlink('./dist.zip');
unlink('./deploy.php');
unlink('./deploy-config.php');
info('Successfully deployed.');
