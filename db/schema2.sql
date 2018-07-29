DROP DATABASE scottsdaleevents;

CREATE DATABASE scottsdaleevents;

use scottsdaleEvents;

CREATE TABLE customers(
    ID INT AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NULL,
    frozen INT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE admins(
    ID INT AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    superAdmin INT,
    PRIMARY KEY(ID)
);

CREATE TABLE user_carts(
	ID INT AUTO_INCREMENT,
	user_ID INT NOT NULL,
    dID_check_out INT NULL,
    -- timestamp
    PRIMARY KEY(ID)
);

CREATE TABLE cart_products(
	ID INT AUTO_INCREMENT,
    user_cart_ID INT NOT NULL,
    inventory_ID INT NOT NULL,
    qty INT NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE Category(
  ID INTEGER(11) NOT NULL,
  CATEGORY VARCHAR(50),
  CategoryID INT,
  PRIMARY KEY (ID)
);

CREATE TABLE BarBack(
  ID INTEGER(11) NOT NULL,
  SubCategory VARCHAR(50),
  NAME VARCHAR(50),
  DESCRIPTION VARCHAR(256),
  PRICE INT,
  CategoryID INT,
  PRIMARY KEY (ID)
);

CREATE TABLE BarFront(
  ID INTEGER(11) NOT NULL,
  SubCategory VARCHAR(50),
  NAME VARCHAR(50),
  DESCRIPTION VARCHAR(256),
  PRICE INT,
  CategoryID INT,
  PRIMARY KEY (ID)
);

CREATE TABLE Lighting(
  ID INTEGER(11) NOT NULL,
  SubCategory VARCHAR(50),
  NAME VARCHAR(50),
  DESCRIPTION VARCHAR(256),
  PRICE INT,
  CategoryID INT,
  PRIMARY KEY (ID)
);

CREATE TABLE Misc(
  ID INTEGER(11) NOT NULL,
  SubCategory VARCHAR(50),
  NAME VARCHAR(50),
  DESCRIPTION VARCHAR(256),
  PRICE INT,
  CategoryID INT,
  PRIMARY KEY (ID)
);

CREATE TABLE RopeLitCati(
  ID INTEGER(11) NOT NULL,
  SubCategory VARCHAR(50),
  NAME VARCHAR(50),
  DESCRIPTION VARCHAR(256),
  PRICE INT,
  CategoryID INT,
  PRIMARY KEY (ID)
);

CREATE TABLE Seating(
  ID INTEGER(11) NOT NULL,
  SubCategory VARCHAR(50),
  NAME VARCHAR(50),
  DESCRIPTION VARCHAR(256),
  PRICE INT,
  CategoryID INT,
  PRIMARY KEY (ID)
);

CREATE TABLE Tables(
  ID INTEGER(11) NOT NULL,
  SubCategory VARCHAR(50),
  NAME VARCHAR(50),
  DESCRIPTION VARCHAR(256),
  PRICE INT,
  CategoryID INT,
  PRIMARY KEY (ID)
);

LOAD DATA LOCAL INFILE 
'C:\\Users\\wwong\\Desktop\\Project3\\scottsdaleEvents\\CSV Files\\categoryTable.csv'
IGNORE
INTO TABLE Category
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 
'C:\\Users\\wwong\\Desktop\\Project3\\scottsdaleEvents\\CSV Files\\BarBackTable.csv'
IGNORE
INTO TABLE BarBack
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 
'C:\\Users\\wwong\\Desktop\\Project3\\scottsdaleEvents\\CSV Files\\barFrontTable.csv'
IGNORE
INTO TABLE BarFront
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 
'C:\\Users\\wwong\\Desktop\\Project3\\scottsdaleEvents\\CSV Files\\LightingTable.csv'
IGNORE
INTO TABLE Lighting
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 
'C:\\Users\\wwong\\Desktop\\Project3\\scottsdaleEvents\\CSV Files\\MiscTable.csv'
IGNORE
INTO TABLE Misc
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 
'C:\\Users\\wwong\\Desktop\\Project3\\scottsdaleEvents\\CSV Files\\RopeLitCatiLightingTable.csv'
IGNORE
INTO TABLE RopeLitCati
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 
'C:\\Users\\wwong\\Desktop\\Project3\\scottsdaleEvents\\CSV Files\\SeatingTable.csv'
IGNORE
INTO TABLE Seating
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 
'C:\\Users\\wwong\\Desktop\\Project3\\scottsdaleEvents\\CSV Files\\TablesTable.csv'
IGNORE
INTO TABLE Tables
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;