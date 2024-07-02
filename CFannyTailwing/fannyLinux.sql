-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 02-07-2024 a las 03:05:17
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizarMenu` (IN `p_id` INT, IN `p_nombre` VARCHAR(255), IN `p_tipo` VARCHAR(255), IN `p_precio` DECIMAL(10,2), IN `p_stockG` INT)  BEGIN
    DECLARE original_nombre VARCHAR(255);
    DECLARE original_tipo VARCHAR(255);
    DECLARE original_precio DECIMAL(10, 2);
    DECLARE original_stockG INT;

    -- Obtener los valores originales
    SELECT nombre, tipo, precio, stockG
    INTO original_nombre, original_tipo, original_precio, original_stockG
    FROM Menu
    WHERE id = p_id;

    -- Actualizar solo los campos que han cambiado
    IF original_nombre != p_nombre THEN
        UPDATE Menu SET nombre = p_nombre WHERE id = p_id;
    END IF;

    IF original_tipo != p_tipo THEN
        UPDATE Menu SET tipo = p_tipo WHERE id = p_id;
    END IF;

    IF original_precio != p_precio THEN
        UPDATE Menu SET precio = p_precio WHERE id = p_id;
    END IF;

    IF original_stockG != p_stockG THEN
        UPDATE Menu SET stockG = p_stockG WHERE id = p_id;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_precios_colacion` (IN `p_id_colaciones` INT, IN `p_valor` DECIMAL(10,2))  BEGIN
    UPDATE precios_colaciones
    SET
        valor = p_valor
    WHERE
        id_colaciones = p_id_colaciones;

    SELECT 'Tabla precios_colaciones actualizada correctamente' AS mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarMenu` (IN `p_nombre` VARCHAR(255), IN `p_tipo` VARCHAR(50), IN `p_precio` DECIMAL(10,2), IN `p_stockG` INT)  BEGIN
    INSERT INTO Menu(nombre, tipo, precio, stockG)
    VALUES (p_nombre, p_tipo, p_precio, p_stockG);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Combos`
--

CREATE TABLE `Combos` (
  `idcombo` int(11) NOT NULL,
  `proteina` tinyint(1) DEFAULT NULL,
  `acompana` tinyint(1) DEFAULT NULL,
  `acompanaG` tinyint(1) NOT NULL,
  `guiso` tinyint(1) DEFAULT NULL,
  `postre` tinyint(1) DEFAULT NULL,
  `pebre` tinyint(1) DEFAULT NULL,
  `ensalada` tinyint(1) DEFAULT NULL,
  `papasC` tinyint(1) DEFAULT NULL,
  `papasG` tinyint(1) DEFAULT NULL,
  `bebida` tinyint(1) DEFAULT NULL,
  `Precio` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Combos`
--

INSERT INTO `Combos` (`idcombo`, `proteina`, `acompana`, `acompanaG`, `guiso`, `postre`, `pebre`, `ensalada`, `papasC`, `papasG`, `bebida`, `Precio`) VALUES
(1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2500);

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
(1, 'Pollo Asado', 1, 2200, 50),
(24, 'EnsaladaC', 6, 1100, 10),
(25, 'ChulFri', 1, 2200, 2),
(26, 'Chopsuey', 1, 2200, 1),
(27, 'Arroz', 2, 1200, 31),
(30, 'Pure', 2, 1200, 0),
(31, 'PapasFritasC', 3, 2600, 58),
(32, 'PapasfritasG', 3, 3000, 50),
(33, 'EnsaladaM', 6, 1600, 2000),
(36, 'EnsaladaG', 6, 2100, 10),
(37, 'FantaBebida', 5, 1100, 500),
(38, 'CocaColaLBebida', 5, 1100, 0),
(39, 'KemLBebida', 5, 1100, 0),
(40, 'Motehuesillo', 7, 1500, 0),
(41, 'Vasoconfruta', 7, 1200, 0),
(42, 'Jalea', 7, 400, 0),
(43, 'Pinoalhorno', 4, 2000, 0),
(44, 'Pinofrita', 4, 1500, 0),
(45, 'Quesofrita', 4, 1300, 0),
(46, 'Jugo', 5, 1000, 10),
(47, 'Limonada', 5, 2000, 10),
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
(81, 'Hamburguesa', 1, 10000, 50),
(86, 'VACIO', 11, 0, 0);

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
(10, 'Guiso'),
(11, 'NULO');

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
(1, 1, 86, 0, 1),
(2, 1, 86, 0, 2),
(3, 1, 86, 0, 3),
(4, 1, 86, 0, 4),
(5, 1, 86, 0, 5),
(6, 1, 86, 0, 6),
(7, 1, 86, 0, 7),
(8, 1, 86, 0, 8),
(9, 1, 86, 0, 9),
(10, 1, 86, 0, 10),
(11, 1, 86, 0, 11),
(12, 1, 86, 0, 12),
(13, 1, 86, 0, 13),
(14, 1, 86, 0, 14),
(15, 1, 86, 0, 15),
(16, 1, 86, 0, 16),
(17, 1, 86, 0, 17),
(18, 1, 86, 0, 18),
(19, 2, 86, 0, 1),
(20, 2, 86, 0, 2),
(21, 2, 86, 0, 3),
(22, 2, 86, 0, 4),
(23, 2, 86, 0, 5),
(24, 2, 86, 0, 6),
(25, 2, 86, 0, 7),
(26, 2, 86, 0, 8),
(27, 2, 86, 0, 9),
(28, 2, 86, 0, 10),
(29, 2, 86, 0, 11),
(30, 2, 86, 0, 12),
(31, 2, 86, 0, 13),
(32, 2, 86, 0, 14),
(33, 2, 86, 0, 15),
(34, 2, 86, 0, 16),
(35, 2, 86, 0, 17),
(36, 2, 86, 0, 18),
(37, 3, 86, 0, 1),
(38, 3, 86, 0, 2),
(39, 3, 86, 0, 3),
(40, 3, 86, 0, 4),
(41, 3, 86, 0, 5),
(42, 3, 86, 0, 6),
(43, 3, 86, 0, 7),
(44, 3, 86, 0, 8),
(45, 3, 86, 0, 9),
(46, 3, 86, 0, 10),
(47, 3, 86, 0, 11),
(48, 3, 86, 0, 12),
(49, 3, 86, 0, 13),
(50, 3, 86, 0, 14),
(51, 3, 86, 0, 15),
(52, 3, 86, 0, 16),
(53, 3, 86, 0, 17),
(54, 3, 86, 0, 18),
(55, 4, 86, 0, 1),
(56, 4, 86, 0, 2),
(57, 4, 86, 0, 3),
(58, 4, 86, 0, 4),
(59, 4, 86, 0, 5),
(60, 4, 86, 0, 6),
(61, 4, 86, 0, 7),
(62, 4, 86, 0, 8),
(63, 4, 86, 0, 9),
(64, 4, 86, 0, 10),
(65, 4, 86, 0, 11),
(66, 4, 86, 0, 12),
(67, 4, 86, 0, 13),
(68, 4, 86, 0, 14),
(69, 4, 86, 0, 15),
(70, 4, 86, 0, 16),
(71, 4, 86, 0, 17),
(72, 4, 86, 0, 18),
(73, 5, 86, 0, 1),
(74, 5, 86, 0, 2),
(75, 5, 86, 0, 3),
(76, 5, 86, 0, 4),
(77, 5, 86, 0, 5),
(78, 5, 86, 0, 6),
(79, 5, 86, 0, 7),
(80, 5, 86, 0, 8),
(81, 5, 86, 0, 9),
(82, 5, 86, 0, 10),
(83, 5, 86, 0, 11),
(84, 5, 86, 0, 12),
(85, 5, 86, 0, 13),
(86, 5, 86, 0, 14),
(87, 5, 86, 0, 15),
(88, 5, 86, 0, 16),
(89, 5, 86, 0, 17),
(90, 5, 86, 0, 18),
(91, 6, 86, 0, 1),
(92, 6, 86, 0, 2),
(93, 6, 86, 0, 3),
(94, 6, 86, 0, 4),
(95, 6, 86, 0, 5),
(96, 6, 86, 0, 6),
(97, 6, 86, 0, 7),
(98, 6, 86, 0, 8),
(99, 6, 86, 0, 9),
(100, 6, 86, 0, 10),
(101, 6, 86, 0, 11),
(102, 6, 86, 0, 12),
(103, 6, 86, 0, 13),
(104, 6, 86, 0, 14),
(105, 6, 86, 0, 15),
(106, 6, 86, 0, 16),
(107, 6, 86, 0, 17),
(108, 6, 86, 0, 18);

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
-- Indices de la tabla `Combos`
--
ALTER TABLE `Combos`
  ADD PRIMARY KEY (`idcombo`);

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
-- AUTO_INCREMENT de la tabla `Combos`
--
ALTER TABLE `Combos`
  MODIFY `idcombo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `Menu`
--
ALTER TABLE `Menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

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
