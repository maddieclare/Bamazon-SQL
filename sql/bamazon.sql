use bamazon;

create table products (
	item_id int not null primary key auto_increment,
    product_name varchar(255),
    department_name varchar(255),
    price decimal(19, 4),
    stock_quantity int
)

