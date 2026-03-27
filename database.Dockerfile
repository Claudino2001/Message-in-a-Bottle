FROM mysql:8.0

COPY ./database/DDL.sql /docker-entrypoint-initdb.d/init.sql