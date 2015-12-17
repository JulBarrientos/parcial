-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 12-06-2015 a las 14:52:37
-- Versión del servidor: 5.0.67
-- Versión de PHP: 5.3.1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `utn_fra`
--
CREATE DATABASE  `utn_fra` DEFAULT CHARACTER SET latin1 COLLATE latin1_spanish_ci;
use utn_fra;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envios`
--

CREATE TABLE IF NOT EXISTS `envios` (
  `numero` int(4) NOT NULL,
  `pnumero` int(4) NOT NULL,
  `cantidad` int(4) NOT NULL,
  PRIMARY KEY  (`numero`,`pnumero`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcar la base de datos para la tabla `envios`
--

INSERT INTO `envios` (`numero`, `pnumero`, `cantidad`) VALUES
(100, 1, 500),
(100, 2, 1500),
(100, 3, 100),
(101, 2, 55),
(101, 3, 225),
(102, 1, 600),
(102, 3, 300);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE IF NOT EXISTS `productos` (
  `pnumero` int(4) NOT NULL,
  `pnombre` varchar(50) collate latin1_spanish_ci NOT NULL,
  `precio` float NOT NULL,
  `tamanio` varchar(50) collate latin1_spanish_ci default NULL,
  PRIMARY KEY  (`pnumero`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcar la base de datos para la tabla `productos`
--

INSERT INTO `productos` (`pnumero`, `pnombre`, `precio`, `tamanio`) VALUES
(1, 'Caramelos', 1.5, 'Chico'),
(2, 'Cigarrillos', 3.2, 'Mediano'),
(3, 'Gaseosa', 5.33, 'Grande');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE IF NOT EXISTS `proveedores` (
  `numero` int(4) unsigned NOT NULL,
  `nombre` varchar(50) collate latin1_spanish_ci NOT NULL,
  `domicilio` varchar(50) collate latin1_spanish_ci default NULL,
  `localidad` varchar(50) collate latin1_spanish_ci default NULL,
  PRIMARY KEY  (`numero`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcar la base de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`numero`, `nombre`, `domicilio`, `localidad`) VALUES
(100, 'Perez', 'Peron 555', 'Capital'),
(101, 'Aguirre', 'Mitre 750', 'Avellaneda'),
(102, 'Aguirre', 'Boedo 436', 'Bernal');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
