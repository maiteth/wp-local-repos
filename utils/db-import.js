const exec = require('child_process').exec;
const mysql = require('mysql');
const phpUtils = require('../lib/phpUtils.js');
const fs = require('fs');
const cfgUtils = require('../lib/utils.js');
const devEnv = cfgUtils.getEnv('dev');

const user = devEnv.mysql.username;
const password = devEnv.mysql.password;
const hostname = devEnv.mysql.hostname;
const database = devEnv.mysql.database;

let contents = fs.readFileSync('sql/wordpress.sql', 'utf8');
contents = contents.replace(/<%= url %>/g, devEnv.url);
contents = contents.replace(/<%= blogname %>/g, devEnv.blogname);
contents = contents.replace(/<%= database %>/g, database);
contents = phpUtils.fixSerialization(contents);
contents = `
drop database if exists \`${database}\`;
create database \`${database}\`;
use \`${database}\`;
` + contents;

const connection = mysql.createConnection({
    host: hostname,
    user: user,
    password: password,
    multipleStatements: true,
});

connection.connect();

connection.query(contents, function (error, results, fields) {
    if (error) throw error;
    connection.end();
    console.log('about to import');
});