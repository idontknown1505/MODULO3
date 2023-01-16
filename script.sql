create table todos (
	id integer primary key, 
	nombre varchar (1000) not null,
	edad integer not null,
	completed BOOLEAN not null default false
);