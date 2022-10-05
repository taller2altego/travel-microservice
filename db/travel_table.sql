CREATE TABLE "travel"(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    phone_number INTEGER NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL
);

/*

id, 
user_id, 
driver_id, 
price, 
initial_date, 
final_date, 
duration, 
state [buscando chofer, esperando chofer, en camino, suspendido, finalizado], 
source, 
destination

*/