# Wp-local-repos

This project is a starter project for Wordpress.

It allows someone to locally develop a Wordpress theme, Wordpress itself or other tasks and then deploy by FTP the whole website.
During deployment, the database is extracted, reconfigured and also deployed to the target.

# Prerequisites

1. Install XAMPP (https://www.apachefriends.org/fr/index.html). XAMPP is a PHP, MySQL, Apache stack.
3. Install Node (>8.1.0) (https://nodejs.org/en/).
4. Install in global mode gulp (`npm install -g gulp-cli`)


# Installation

## Clone the project

```
$ git clone https://github.com/jlguenego/wp-local-repos.git
$ cd wp-local-repos
$ npm i
```

## Configure Apache (XAMPP)

1. Add at the end of the `httpd.conf` file the following: `Include "conf/alias/*"`.
On a XAMPP windows default install `httpd.conf` is located  under `C:\xampp\apache\conf`
2. Create the **alias** directory under the XAMPP Apache conf directory. Example Windows: **C:\xampp\apache\conf\alias**.
3. Insert the following file in the **conf/alias** directory: 

**conf/alias/wp-local-repos.conf**:
```
<Directory "D:/Replace/by/the/path/to/your/project">
    Options Indexes FollowSymLinks Includes ExecCGI
    AllowOverride All
    Allow from all
	Require all granted
</Directory>
Alias /wp-local-repos "D:/Replace/by/the/path/your/project/wp-local-repos"
```

## Create the `environment.js` file

```
$ cd wp-local-repos
$ cd cfg
$ cp environments.js.tmpl environments.js
```

Customize the newly created **environments.js** file.

You will find the value documented in the file.


```
$ gulp config
```

## Start the server

Start the XAMPP server (both Apache and MySQL)


# Install Wordpress

Go to your website and follow the steps displayed on your screen.

# Deployment to production environment

## Settings

Review the `cfg/environment.js` file and check the deployment parameters.

## Build

```
$ cd wp-local-repos
$ gulp rebuild
```

## Deployment

```
$ gulp deploy
```

## Database

To export your database, run `npm run db-export`.
To import your database, run `npm run db-import`.

### Note 

If you need to undeploy, just run `gulp undeploy`.


# Authors

- Maite THOMIAS
- Jean-Louis GUENEGO
