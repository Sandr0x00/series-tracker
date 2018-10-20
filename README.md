# SerienStatus

Some small project for keeping track of my series.

## How to use

1. Set up webserver and MySQL server
1. Create database
1. Set following environment variables in the webserver config:
    ~~~
    SetEnv SERIES_SERVER your-db-ip
    SetEnv SERIES_USER your-db-username
    SetEnv SERIES_PASS your-db-password
    SetEnv SERIES_DB your-db (see 2.)
    ~~~
1. Open index.php in browser