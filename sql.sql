--> node_user : cnmn_test0
--    + reporte_acts

-- db4free.net
--> cnmn_test : cnmn_test0
--    + reporte_acts

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema reporte_acts
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema reporte_acts
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `reporte_acts` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `reporte_acts` ;

-- -----------------------------------------------------
-- Table `reporte_acts`.`roles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `reporte_acts`.`roles` ;

CREATE TABLE IF NOT EXISTS `reporte_acts`.`roles` (
  `id_rol` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(90) NOT NULL,
  `es_admin` INT NOT NULL,
  PRIMARY KEY (`id_rol`));
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `reporte_acts`.`departamentos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `reporte_acts`.`departamentos` ;

CREATE TABLE IF NOT EXISTS `reporte_acts`.`departamentos` (
  `id_dept` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id_dept`));
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `reporte_acts`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `reporte_acts`.`usuarios` ;

CREATE TABLE IF NOT EXISTS `reporte_acts`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(50) NOT NULL,
  `apellido_pat` VARCHAR(45) NULL DEFAULT NULL,
  `apellido_mat` VARCHAR(45) NULL DEFAULT NULL,
  `clave_empleado` VARCHAR(50) NOT NULL,
  `curp` VARCHAR(45) NULL DEFAULT NULL,
  `telefono` VARCHAR(20) NULL DEFAULT NULL,
  `correo` VARCHAR(80) NULL DEFAULT NULL,
  `roles_id_rol` INT NOT NULL,
  `departamentos_id_dept` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_usuarios_roles1_idx` (`roles_id_rol` ASC) VISIBLE,
  INDEX `fk_usuarios_departamentos1_idx` (`departamentos_id_dept` ASC) VISIBLE,
  CONSTRAINT `fk_usuarios_roles1`
    FOREIGN KEY (`roles_id_rol`)
    REFERENCES `reporte_acts`.`roles` (`id_rol`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuarios_departamentos1`
    FOREIGN KEY (`departamentos_id_dept`)
    REFERENCES `reporte_acts`.`departamentos` (`id_dept`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `reporte_acts`.`documentos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `reporte_acts`.`documentos` ;

CREATE TABLE IF NOT EXISTS `reporte_acts`.`documentos` (
  `id_doc` INT NOT NULL AUTO_INCREMENT,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `firma1` VARCHAR(45) NULL DEFAULT NULL,
  `firma2` VARCHAR(45) NULL DEFAULT NULL,
  `cadena_pdf` VARCHAR(45) NULL,
  `usuarios_id` INT NOT NULL,
  PRIMARY KEY (`id_doc`),
  INDEX `fk_documentos_usuarios1_idx` (`usuarios_id` ASC) VISIBLE,
  CONSTRAINT `fk_documentos_usuarios1`
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `reporte_acts`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci


-- -----------------------------------------------------
-- Table `reporte_acts`.`actividades`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `reporte_acts`.`actividades` ;

CREATE TABLE IF NOT EXISTS `reporte_acts`.`actividades` (
  `id_act` INT NOT NULL AUTO_INCREMENT,
  `actividad` LONGTEXT NOT NULL,
  `objetivo` LONGTEXT NULL DEFAULT NULL,
  `descripcion` LONGTEXT NULL DEFAULT NULL,
  `entregable` LONGTEXT NULL DEFAULT NULL,
  `inicio_act` DATE NULL DEFAULT NULL,
  `fin_act` DATE NULL DEFAULT NULL,
  `impacto_beneficio` LONGTEXT NULL DEFAULT NULL,
  `medio_comunicacion` LONGTEXT NULL DEFAULT NULL,
  `medio_entrega` LONGTEXT NULL DEFAULT NULL,
  `observaciones` LONGTEXT NULL DEFAULT NULL,
  `documentos_id_doc` INT NOT NULL,
  PRIMARY KEY (`id_act`),
  INDEX `fk_actividades_documentos1_idx` (`documentos_id_doc` ASC) VISIBLE,
  CONSTRAINT `fk_actividades_documentos1`
    FOREIGN KEY (`documentos_id_doc`)
    REFERENCES `reporte_acts`.`documentos` (`id_doc`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci



-- Inserts --------------------------------

INSERT INTO `reporte_acts`.`departamentos` (`nombre`) VALUES ('Depto Prueba1');
INSERT INTO `reporte_acts`.`departamentos` (`nombre`) VALUES ('Depto Prueba2');

INSERT INTO `reporte_acts`.`roles` (`nombre`, `es_admin`) VALUES ('Administrador', 1);
INSERT INTO `reporte_acts`.`roles` (`nombre`, `es_admin`) VALUES ( 'Empleado', 0);

INSERT INTO `reporte_acts`.`usuarios` (`nombres`, `apellido_pat`, `apellido_mat`, `clave_empleado`, `curp`, `telefono`, `correo`, `roles_id_rol`, `departamentos_id_dept`) VALUES ( 'Miguel Eduardo', 'Rodriguez', 'Coleote', '123456ABC', 'rocm950918', '5513848485', 'migue0mpx@gmail.com', 1, 1);
INSERT INTO `reporte_acts`.`usuarios` (`nombres`, `apellido_pat`, `apellido_mat`, `clave_empleado`, `curp`, `telefono`, `correo`, `roles_id_rol`, `departamentos_id_dept`) VALUES ( 'Miguel Angel', 'Jimenez', 'Sanchez', '123000ABC', 'jism960516', '5623968574', 'jism@dsl.com', 1, 2);


-- -----------------------------------------------------
-- Table `reporte_acts`.`solicutud_serv`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `reporte_acts`.`solicutud_serv` ;

CREATE TABLE IF NOT EXISTS `reporte_acts`.`solicutud_serv` (
  `sserv_id` INT NOT NULL AUTO_INCREMENT,
  `folio_udi_cnmn` VARCHAR(50) NOT NULL,
  `laboratorio` VARCHAR(100) NOT NULL,
  `equip_marca` VARCHAR(100) NULL,
  `equip_serie` VARCHAR(50) NULL,
  `equip_modelo` VARCHAR(100) NULL,
  `equip_serie_ins` VARCHAR(50) NULL,
  `equip_ip` VARCHAR(25) NULL,
  `equip_tipo` VARCHAR(50) NULL,
  `equip_reparacion` MEDIUMTEXT NULL,
  `equip_instalacion` MEDIUMTEXT NULL,
  `equip_observ_op` MEDIUMTEXT NULL,
  `fecha_hora` DATETIME NULL,
  PRIMARY KEY (`sserv_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci