CREATE DATABASE UE_MASTER;
CREATE USER UE_MASTER WITH PASSWORD 'UE_MASTER';
create schema ue_master;
insert into users (id,is_approved,email,last_name,name,password,role) values (1,true,'admin@admin.com','admin','admin','$2a$10$IWFC3u39FW0stj/UsbInnO1XBBoMkdPjGWj0B83RLSMtR28zK9M36','ADMIN');
commit;