-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 13-06-2024 a las 21:02:22
-- Versión del servidor: 10.6.16-MariaDB-0ubuntu0.22.04.1
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `fannyLinux`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_precios_colacion` (IN `p_id_colaciones` INT, IN `p_valor` DECIMAL(10,2))  BEGIN
    UPDATE precios_colaciones
    SET
        valor = p_valor
    WHERE
        id_colaciones = p_id_colaciones;

    SELECT 'Tabla precios_colaciones actualizada correctamente' AS mensaje;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Dia`
--

CREATE TABLE `Dia` (
  `id` int(11) NOT NULL,
  `dia` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Dia`
--

INSERT INTO `Dia` (`id`, `dia`) VALUES
(1, 'LUNES'),
(2, 'MARTES'),
(3, 'MIÉRCOLES'),
(4, 'JUEVES'),
(5, 'VIERNES'),
(6, 'SÁBADO'),
(7, 'DOMINGO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Menu`
--

CREATE TABLE `Menu` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL,
  `tipo` int(11) DEFAULT NULL,
  `precio` int(11) DEFAULT NULL,
  `stockG` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Menu`
--

INSERT INTO `Menu` (`id`, `nombre`, `tipo`, `precio`, `stockG`) VALUES
(1, 'Pollo Asado', 1, 2200, 110),
(24, 'EnsaladaC', 6, 1100, 10),
(25, 'ChulFri', 1, 2200, 2),
(26, 'Chopsuey', 1, 2200, 1),
(27, 'Arroz', 2, 1200, 31),
(30, 'Pure', 2, 1200, 0),
(31, 'PapasFritasC', 3, 2600, 58),
(32, 'PapasfritasG', 3, 3000, 50),
(33, 'EnsaladaM', 6, 1600, 0),
(36, 'EnsaladaG', 6, 2100, 0),
(37, 'FantaBebida', 5, 1100, 500),
(38, 'CocaColaLBebida', 5, 1100, 0),
(39, 'KemLBebida', 5, 1100, 0),
(40, 'Motehuesillo', 7, 1500, 0),
(41, 'Vasoconfruta', 7, 1200, 0),
(42, 'Jalea', 7, 400, 0),
(43, 'Pinoalhorno', 4, 2000, 0),
(44, 'Pinofrita', 4, 1500, 0),
(45, 'Quesofrita', 4, 1300, 0),
(46, 'Jugo', 5, 1000, 0),
(47, 'Limonada', 5, 2000, 0),
(48, 'CocaColaLata', 5, 900, 0),
(49, 'Sprite', 5, 900, 0),
(50, 'CazVac', 10, 3500, 6),
(51, 'Porotos', 10, 3500, 45),
(52, 'Longaniza', 10, 3500, 100),
(53, 'LomCerd', 1, 2200, 0),
(54, 'PulpaHor', 1, 2200, 0),
(55, 'Charquican', 10, 3500, 0),
(56, 'BudZap', 10, 3500, 0),
(57, 'Lentejas', 10, 3500, 0),
(58, 'PolloCham', 1, 2200, 0),
(59, 'PesFrito', 1, 2200, 0),
(60, 'CostJugo', 1, 2200, 1),
(61, 'GuatJar', 10, 3500, 0),
(62, 'PolloApa', 1, 2200, 0),
(63, 'CarneJug', 1, 2200, 0),
(64, 'Lasanna', 10, 3500, 19),
(65, 'Cubiertos', 8, 1400, 0),
(66, 'Flan', 7, 400, 0),
(67, 'BistecPob', 9, 5000, 0),
(68, 'Bolsa', 8, 400, 0),
(69, 'Consome', 8, 1400, 0),
(70, 'Fideos', 2, 1200, 0),
(71, 'PapasDor', 2, 1200, 0),
(72, 'PapaMay', 2, 1200, 6),
(73, 'AlbondJugo', 1, 2200, 0),
(74, 'Pebre', 7, 400, 0),
(76, 'Hipocalorico', 8, 3700, 0),
(77, 'QuesCamFrita', 4, 1500, 0),
(78, 'MechQueso', 4, 2000, 0),
(79, 'Sopaipilla', 4, 300, 0),
(80, 'NapHorno', 4, 2000, 0),
(81, 'Hamburguesa', 1, 10000, 50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `MenuTipo`
--

CREATE TABLE `MenuTipo` (
  `id_tipo` int(11) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `MenuTipo`
--

INSERT INTO `MenuTipo` (`id_tipo`, `nombre`) VALUES
(1, 'Proteina'),
(2, 'Acompana'),
(3, 'Papas'),
(4, 'Empanadas'),
(5, 'Bebidas'),
(6, 'Ensalada'),
(7, 'Postre'),
(8, 'Otro'),
(9, 'Special'),
(10, 'Guiso');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Pedidos`
--

CREATE TABLE `Pedidos` (
  `Id_pedidos` int(11) NOT NULL,
  `OrdenTxt` varchar(100) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Llaves` varchar(100) NOT NULL,
  `Comentario` varchar(100) DEFAULT NULL,
  `Precio` int(11) NOT NULL,
  `Estado` int(11) NOT NULL,
  `Barra` int(11) NOT NULL,
  `Cliente` varchar(25) DEFAULT NULL,
  `NumOrden` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Pedidos`
--

INSERT INTO `Pedidos` (`Id_pedidos`, `OrdenTxt`, `Cantidad`, `Llaves`, `Comentario`, `Precio`, `Estado`, `Barra`, `Cliente`, `NumOrden`) VALUES
(25, 'Lasanna', 1, '64', '', 3500, 0, 123456789, 'Orden', 1),
(41, 'Lentejas', 1, '57', '', 3500, 0, 104659372, 'Orden', 14);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `precios_colaciones`
--

CREATE TABLE `precios_colaciones` (
  `id_colaciones` int(11) NOT NULL,
  `tipo_colacion` varchar(20) NOT NULL,
  `valor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `precios_colaciones`
--

INSERT INTO `precios_colaciones` (`id_colaciones`, `tipo_colacion`, `valor`) VALUES
(1, 'Basica', 3000),
(2, 'Especial', 4500),
(3, 'Individual', 3500);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Semana`
--

CREATE TABLE `Semana` (
  `id_semana` int(11) NOT NULL,
  `id_dia` int(11) DEFAULT NULL,
  `id_menu` int(11) DEFAULT NULL,
  `stockD` int(11) DEFAULT NULL,
  `numero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Semana`
--

INSERT INTO `Semana` (`id_semana`, `id_dia`, `id_menu`, `stockD`, `numero`) VALUES
(1, 1, 1, 4, 1),
(2, 1, 25, 2, 2),
(3, 1, 26, 0, 3),
(4, 1, 53, 0, 4),
(5, 1, 63, 0, 5),
(6, 1, 54, 0, 6),
(7, 1, 73, 0, 7),
(8, 1, 1, 4, 8),
(9, 1, 27, 0, 9),
(10, 1, 31, 0, 10),
(11, 1, 32, 0, 11),
(12, 1, 80, 0, 12),
(13, 1, 77, 0, 13),
(14, 1, 78, 0, 14),
(15, 1, 43, 0, 15),
(16, 1, 79, 0, 16),
(17, 1, 45, 0, 17),
(18, 1, 44, 0, 18),
(19, 2, 63, 0, 1),
(20, 2, 1, 0, 2),
(21, 2, 26, 1, 3),
(22, 2, 53, 0, 4),
(23, 2, 62, 0, 5),
(24, 2, 60, 1, 6),
(25, 2, 59, 0, 7),
(26, 2, 1, 0, 8),
(27, 2, 27, 5, 9),
(28, 2, 31, 0, 10),
(29, 2, 32, 0, 11),
(30, 2, 80, 0, 12),
(31, 2, 77, 0, 13),
(32, 2, 78, 0, 14),
(33, 2, 43, 0, 15),
(34, 2, 79, 0, 16),
(35, 2, 45, 0, 17),
(36, 2, 44, 0, 18),
(37, 3, 50, 6, 1),
(38, 3, 51, 0, 2),
(39, 3, 52, 100, 3),
(40, 3, 1, 100, 4),
(41, 3, 25, 0, 5),
(42, 3, 26, 0, 6),
(43, 3, 70, 0, 7),
(44, 3, 1, 2, 8),
(45, 3, 27, 0, 9),
(46, 3, 31, 8, 10),
(47, 3, 32, 0, 11),
(48, 3, 80, 0, 12),
(49, 3, 77, 0, 13),
(50, 3, 78, 0, 14),
(51, 3, 43, 0, 15),
(52, 3, 79, 0, 16),
(53, 3, 45, 0, 17),
(54, 3, 44, 0, 18),
(55, 4, 64, 19, 1),
(56, 4, 61, 0, 2),
(57, 4, 57, 0, 3),
(58, 4, 56, 0, 4),
(59, 4, 55, 0, 5),
(60, 4, 52, 0, 6),
(61, 4, 51, 45, 7),
(62, 4, 1, 0, 8),
(63, 4, 27, 26, 9),
(64, 4, 31, 50, 10),
(65, 4, 32, 50, 11),
(66, 4, 80, 0, 12),
(67, 4, 77, 0, 13),
(68, 4, 78, 0, 14),
(69, 4, 43, 0, 15),
(70, 4, 79, 0, 16),
(71, 4, 45, 0, 17),
(72, 4, 44, 0, 18),
(73, 5, 58, 0, 1),
(74, 5, 59, 0, 2),
(75, 5, 60, 0, 3),
(76, 5, 62, 0, 4),
(77, 5, 54, 0, 5),
(78, 5, 73, 0, 6),
(79, 5, 63, 0, 7),
(80, 5, 1, 0, 8),
(81, 5, 27, 0, 9),
(82, 5, 31, 0, 10),
(83, 5, 32, 0, 11),
(84, 5, 80, 0, 12),
(85, 5, 77, 0, 13),
(86, 5, 78, 0, 14),
(87, 5, 43, 0, 15),
(88, 5, 79, 0, 16),
(89, 5, 45, 0, 17),
(90, 5, 44, 0, 18),
(91, 6, 56, 0, 1),
(92, 6, 71, 0, 2),
(93, 6, 70, 0, 3),
(94, 6, 55, 0, 4),
(95, 6, 30, 0, 5),
(96, 6, 52, 0, 6),
(97, 6, 27, 0, 7),
(98, 6, 1, 0, 8),
(99, 6, 27, 0, 9),
(100, 6, 31, 0, 10),
(101, 6, 32, 0, 11),
(102, 6, 80, 0, 12),
(103, 6, 77, 0, 13),
(104, 6, 78, 0, 14),
(105, 6, 43, 0, 15),
(106, 6, 79, 0, 16),
(107, 6, 45, 0, 17),
(108, 6, 44, 0, 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Ventas`
--

CREATE TABLE `Ventas` (
  `id_venta` int(11) NOT NULL,
  `Estado` int(11) NOT NULL,
  `Pedido` varchar(60) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Comentario` varchar(30) NOT NULL,
  `Precio` int(11) NOT NULL,
  `NumeroOrden` int(11) NOT NULL,
  `FechaVenta` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Dia`
--
ALTER TABLE `Dia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Menu`
--
ALTER TABLE `Menu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo` (`tipo`);

--
-- Indices de la tabla `MenuTipo`
--
ALTER TABLE `MenuTipo`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `Pedidos`
--
ALTER TABLE `Pedidos`
  ADD PRIMARY KEY (`Id_pedidos`);

--
-- Indices de la tabla `precios_colaciones`
--
ALTER TABLE `precios_colaciones`
  ADD PRIMARY KEY (`id_colaciones`);

--
-- Indices de la tabla `Semana`
--
ALTER TABLE `Semana`
  ADD PRIMARY KEY (`id_semana`),
  ADD KEY `id_dia` (`id_dia`),
  ADD KEY `id_menu` (`id_menu`);

--
-- Indices de la tabla `Ventas`
--
ALTER TABLE `Ventas`
  ADD PRIMARY KEY (`id_venta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Menu`
--
ALTER TABLE `Menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT de la tabla `Pedidos`
--
ALTER TABLE `Pedidos`
  MODIFY `Id_pedidos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `precios_colaciones`
--
ALTER TABLE `precios_colaciones`
  MODIFY `id_colaciones` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `Semana`
--
ALTER TABLE `Semana`
  MODIFY `id_semana` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT de la tabla `Ventas`
--
ALTER TABLE `Ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Menu`
--
ALTER TABLE `Menu`
  ADD CONSTRAINT `Menu_ibfk_1` FOREIGN KEY (`tipo`) REFERENCES `MenuTipo` (`id_tipo`);

--
-- Filtros para la tabla `Semana`
--
ALTER TABLE `Semana`
  ADD CONSTRAINT `Semana_ibfk_1` FOREIGN KEY (`id_dia`) REFERENCES `Dia` (`id`),
  ADD CONSTRAINT `Semana_ibfk_2` FOREIGN KEY (`id_menu`) REFERENCES `Menu` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
