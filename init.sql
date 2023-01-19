-- MySQL Script generated by MySQL Workbench
-- Thu Jan  5 10:56:14 2023
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema integrationdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema integrationdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `integrationdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `integrationdb` ;

-- -----------------------------------------------------
-- Table `integrationdb`.`asset_tags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrationdb`.`asset_tags` (
  `asset_tag` VARCHAR(50) NOT NULL,
  `quantity` SMALLINT NULL DEFAULT '1',
  `serialize` SMALLINT NULL DEFAULT '1',
  `username` VARCHAR(50) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 32
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Holds asset tag data for labels.';


-- -----------------------------------------------------
-- Table `integrationdb`.`barcode_and_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrationdb`.`barcode_and_type` (
  `data` VARCHAR(50) NOT NULL,
  `quantity` SMALLINT NULL DEFAULT '1',
  `serialize` SMALLINT NULL DEFAULT '1',
  `type` VARCHAR(50) NULL DEFAULT 'Part',
  `multiplier` VARCHAR(50) NULL DEFAULT NULL,
  `username` VARCHAR(50) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 901
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Holds data for creating generic barcode labels with the provided type underneath.';


-- -----------------------------------------------------
-- Table `integrationdb`.`benches`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrationdb`.`benches` (
  `name` VARCHAR(50) NOT NULL,
  `value` VARCHAR(50) NULL DEFAULT NULL,
  `portRange` VARCHAR(50) NULL DEFAULT NULL,
  `department` VARCHAR(50) NULL DEFAULT NULL,
  `notes` VARCHAR(50) NULL DEFAULT NULL,
  `lockedPorts` VARCHAR(100) NULL DEFAULT NULL,
  `benchescol` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`name`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Contains data for mapping benches to switch and port.';


-- -----------------------------------------------------
-- Table `integrationdb`.`covestro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrationdb`.`covestro` (
  `serial_number` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 56
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Holds data for creating Covestro tags.';


-- -----------------------------------------------------
-- Table `integrationdb`.`freeman`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrationdb`.`freeman` (
  `serial_number` VARCHAR(50) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 436
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Holds data for creating Freeman labels and asset tags.';


-- -----------------------------------------------------
-- Table `integrationdb`.`order_numbers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrationdb`.`order_numbers` (
  `data` VARCHAR(50) NOT NULL,
  `quantity` SMALLINT NULL DEFAULT '1',
  `serialize` SMALLINT NULL DEFAULT '1',
  `username` VARCHAR(50) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2877
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Table stores order numbers and general information label data.';


-- -----------------------------------------------------
-- Table `integrationdb`.`order_tracking`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrationdb`.`order_tracking` (
  `orderId` varchar(15) NOT NULL,
  `user` varchar(35) NOT NULL,
  `createdAt` datetime NOT NULL,
  `completedAt` datetime DEFAULT NULL,
  `status` enum('completed','active','error') NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`orderId`)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `integrationdb`.`part_and_serial`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrationdb`.`part_and_serial` (
  `part_number` VARCHAR(50) NOT NULL,
  `serial_number` VARCHAR(50) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Holds data for creating part number labels with serial number.';


-- -----------------------------------------------------
-- Table `integrationdb`.`simmons`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrationdb`.`simmons` (
  `simmons_user` VARCHAR(100) NULL DEFAULT NULL,
  `serial_number` VARCHAR(50) NOT NULL,
  `mac_address` VARCHAR(20) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Holds data for creating Simmons labels and asset tags.';


-- -----------------------------------------------------
-- Table `integrationdb`.`vlans`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrationdb`.`vlans` (
  `vlanNumber` SMALLINT NOT NULL,
  `vlanName` VARCHAR(100) NULL DEFAULT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `notes` VARCHAR(255) NULL DEFAULT NULL,
  `department` VARCHAR(50) NULL DEFAULT NULL,
  `protected` TINYINT NULL DEFAULT NULL,
  `popularity` SMALLINT NULL DEFAULT NULL,
  PRIMARY KEY (`vlanNumber`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Contains data on active Vlans';


-- -----------------------------------------------------
-- Table `integrationdb`.`whirlpool`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `integrationdb`.`whirlpool` (
  `serial_number` VARCHAR(50) NOT NULL,
  `asset_number` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`asset_number`))
ENGINE = InnoDB
AUTO_INCREMENT = 9324
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Hold data for creating Whirlpool labels and asset tags';


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
