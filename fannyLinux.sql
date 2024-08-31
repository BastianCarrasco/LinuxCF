-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 31-08-2024 a las 15:25:32
-- Versión del servidor: 10.6.18-MariaDB-0ubuntu0.22.04.1
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
    FROM menu
    WHERE id = p_id;

    -- Actualizar solo los campos que han cambiado
    IF original_nombre != p_nombre THEN
        UPDATE menu SET nombre = p_nombre WHERE id = p_id;
    END IF;

    IF original_tipo != p_tipo THEN
        UPDATE menu SET tipo = p_tipo WHERE id = p_id;
    END IF;

    IF original_precio != p_precio THEN
        UPDATE menu SET precio = p_precio WHERE id = p_id;
    END IF;

    IF original_stockG != p_stockG THEN
        UPDATE menu SET stockG = p_stockG WHERE id = p_id;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_id_menu` (IN `p_id_dia` INT, IN `p_nuevo_id_menu` INT, IN `p_numero` INT)  BEGIN
    UPDATE `semana`
    SET `id_menu` = p_nuevo_id_menu
    WHERE `id_dia` = p_id_dia
    AND `numero` = p_numero;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_precios_colacion` (IN `p_id_colaciones` INT, IN `p_valor` DECIMAL(10,2))  BEGIN
    UPDATE precios_colaciones
    SET
        valor = p_valor
    WHERE
        id_colaciones = p_id_colaciones;

    SELECT 'Tabla precios_colaciones actualizada correctamente' AS mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_stock` (IN `p_id_dia` INT, IN `p_id_menu` INT, IN `p_stockD` INT)  BEGIN
    UPDATE semana
    SET stockD = p_stockD
    WHERE id_dia = p_id_dia AND id_menu = p_id_menu;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarMenu` (IN `p_nombre` VARCHAR(255), IN `p_tipo` VARCHAR(50), IN `p_precio` DECIMAL(10,2), IN `p_stockG` INT)  BEGIN
    INSERT INTO menu(nombre, tipo, precio, stockG)
    VALUES (p_nombre, p_tipo, p_precio, p_stockG);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `restar_stock_semanal` (IN `p_id_dia` INT, IN `p_id_menu` INT, IN `p_cantidad` INT)  BEGIN
    UPDATE semana
    SET stockD = stockD - p_cantidad
    WHERE id_dia = p_id_dia AND id_menu = p_id_menu;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `combos`
--

CREATE TABLE `combos` (
  `idcombo` int(11) NOT NULL,
  `tipo_combo` varchar(255) DEFAULT NULL,
  `proteina` tinyint(1) DEFAULT 0,
  `acompana` tinyint(1) DEFAULT 0,
  `acompanaG` tinyint(1) DEFAULT 0,
  `guiso` tinyint(1) DEFAULT 0,
  `postre` tinyint(1) DEFAULT 0,
  `ensaladaC` tinyint(1) DEFAULT 0,
  `ensaladaG` tinyint(1) DEFAULT 0,
  `papasC` tinyint(1) DEFAULT 0,
  `papasG` tinyint(1) DEFAULT 0,
  `bebida` tinyint(1) DEFAULT 0,
  `Precio` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `combos`
--

INSERT INTO `combos` (`idcombo`, `tipo_combo`, `proteina`, `acompana`, `acompanaG`, `guiso`, `postre`, `ensaladaC`, `ensaladaG`, `papasC`, `papasG`, `bebida`, `Precio`) VALUES
(1, 'Colación básica', 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 4000),
(2, 'Proteína + ensalada grande + pan', 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4000),
(3, 'Proteína + acompañamiento + postre + pan', 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 4000),
(4, 'Proteína + acompañamiento + pebre + pan', 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 4000),
(5, 'Proteína + 2 acompañamientos + postre + pan', 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 4000),
(6, 'Proteína + 2 acompañamientos + pebre + pan', 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 4000),
(7, 'Proteína + 2 acompañamientos + ensalada chica + pan', 1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 4000),
(8, 'Guiso + postre + pan', 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 4000),
(9, 'Guiso + pebre + pan', 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 4000),
(10, 'Proteína + papa frita chica + ensalada chica + pan', 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 4500),
(11, 'Proteína + acompañamiento + papa frita chica + ensalada chica + pan', 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 4500),
(12, 'Proteína + papa frita chica + postre + pan', 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 4500),
(13, 'Proteína + papa frita chica + pebre + pan', 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 4500),
(14, 'Proteína + acompañamiento + papa frita chica + postre + pan', 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 4500),
(15, 'Guiso solo + acompañamiento', 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 3500),
(16, 'Proteína + acompañamiento', 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3500);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dia`
--

CREATE TABLE `dia` (
  `id` int(11) NOT NULL,
  `dia` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dia`
--

INSERT INTO `dia` (`id`, `dia`) VALUES
(1, 'LUNES'),
(2, 'MARTES'),
(3, 'MIÉRCOLES'),
(4, 'JUEVES'),
(5, 'VIERNES'),
(6, 'SÁBADO'),
(7, 'DOMINGO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL,
  `tipo` int(11) DEFAULT NULL,
  `precio` int(11) DEFAULT NULL,
  `stockG` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menu`
--

INSERT INTO `menu` (`id`, `nombre`, `tipo`, `precio`, `stockG`) VALUES
(1, 'Pollo Asado', 1, 2200, 615),
(24, 'EnsaladaC', 14, 1100, 45),
(25, 'ChulFri', 1, 2200, 1100),
(26, 'Chopsuey', 1, 2200, 800),
(27, 'Arroz', 2, 1200, 851),
(30, 'Pure', 2, 1200, 600),
(31, 'PapasFritasC', 3, 2600, 262),
(32, 'PapasfritasG', 12, 3000, 244),
(33, 'EnsaladaM', 6, 1600, 20),
(36, 'EnsaladaG', 13, 2100, 10),
(37, 'FantaBebida', 5, 1100, 0),
(38, 'CocaColaLBebida', 5, 1100, 0),
(39, 'KemLBebida', 5, 1100, 198),
(40, 'Motehuesillo', 7, 1500, 189),
(41, 'Vasoconfruta', 7, 1200, 200),
(42, 'Jalea', 7, 400, 203),
(43, 'Pinoalhorno', 4, 2000, 257),
(44, 'Pinofrita', 4, 1500, 460),
(45, 'Quesofrita', 4, 1300, 560),
(46, 'Jugo', 5, 1000, 0),
(47, 'Limonada', 5, 2000, 0),
(48, 'CocaColaLata', 5, 900, 0),
(49, 'Sprite', 5, 900, 0),
(50, 'CazVac', 10, 3500, 600),
(51, 'Porotos', 10, 3500, 500),
(52, 'Longaniza', 10, 3500, 200),
(53, 'LomCerd', 1, 2200, 600),
(54, 'PulpaHor', 1, 2200, 418),
(55, 'Charquican', 10, 3500, 154),
(56, 'BudZap', 10, 3500, 0),
(57, 'Lentejas', 10, 3500, 900),
(58, 'PolloCham', 1, 2200, 520),
(59, 'PesFrito', 1, 2200, 500),
(60, 'CostJugo', 1, 2200, 700),
(61, 'GuatJar', 10, 3500, 0),
(62, 'PolloApa', 1, 2200, 20),
(63, 'CarneJug', 1, 2200, 20),
(64, 'Lasanna', 10, 3500, 0),
(65, 'Cubiertos', 8, 1400, 200),
(66, 'Flan', 7, 400, 200),
(67, 'BistecPob', 9, 5000, 1000),
(68, 'Bolsa', 8, 400, 200),
(69, 'Consome', 8, 1400, 100),
(70, 'Fideos', 2, 1200, 690),
(71, 'PapasDor', 2, 1200, 498),
(72, 'PapaMay', 2, 1200, 97),
(73, 'AlbondJugo', 1, 2200, 110),
(74, 'Pebre', 7, 400, 189),
(76, 'Hipocalorico', 8, 3700, 100),
(77, 'QuesCamFrita', 4, 1500, 760),
(78, 'MechQueso', 4, 2000, 320),
(79, 'Sopaipilla', 4, 300, 330),
(80, 'NapHorno', 4, 2000, 280);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menutipo`
--

CREATE TABLE `menutipo` (
  `id_tipo` int(11) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menutipo`
--

INSERT INTO `menutipo` (`id_tipo`, `nombre`) VALUES
(0, 'Papas Grande'),
(1, 'proteina'),
(2, 'acompana'),
(3, 'papasC'),
(4, 'Empanadas'),
(5, 'Bebidas'),
(6, 'Ensalada'),
(7, 'postre'),
(8, 'Otro'),
(9, 'Special'),
(10, 'guiso'),
(11, 'NULO'),
(12, 'papasG'),
(13, 'ensaladaG'),
(14, 'ensaladaC');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `barra` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `cliente` varchar(255) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `estado` tinyint(4) NOT NULL,
  `numeroOrden` varchar(50) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `stringSelecteDataId` varchar(255) DEFAULT NULL,
  `textoOrden` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `pedidos`
--
DELIMITER $$
CREATE TRIGGER `after_pedidos_delete` AFTER DELETE ON `pedidos` FOR EACH ROW BEGIN
    INSERT INTO ventas (
        id, barra, cantidad, cliente, comentario, estado, numeroOrden, precio, precioUnitario, stringSelecteDataId, textoOrden, fechaVenta
    )
    VALUES (
        OLD.id, OLD.barra, OLD.cantidad, OLD.cliente, OLD.comentario, OLD.estado, OLD.numeroOrden, OLD.precio, OLD.precioUnitario, OLD.stringSelecteDataId, OLD.textoOrden, NOW()
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `semana`
--

CREATE TABLE `semana` (
  `id_semana` int(11) NOT NULL,
  `id_dia` int(11) DEFAULT NULL,
  `id_menu` int(11) DEFAULT NULL,
  `stockD` int(11) DEFAULT NULL,
  `numero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `semana`
--

INSERT INTO `semana` (`id_semana`, `id_dia`, `id_menu`, `stockD`, `numero`) VALUES
(1, 1, 25, 300, 1),
(2, 1, 26, 300, 2),
(3, 1, 53, 300, 3),
(4, 1, 59, 300, 4),
(5, 1, 54, 300, 5),
(6, 1, 58, 300, 6),
(7, 1, 60, 300, 7),
(8, 1, 27, 200, 8),
(9, 1, 1, 200, 9),
(10, 1, 32, 98, 10),
(11, 1, 31, 100, 11),
(12, 1, 43, 99, 12),
(13, 1, 44, 200, 13),
(14, 1, 45, 300, 14),
(15, 1, 77, 500, 15),
(16, 1, 78, 60, 16),
(17, 1, 79, 70, 17),
(18, 1, 80, 20, 18),
(19, 2, 25, 200, 1),
(20, 2, 58, 200, 2),
(21, 2, 26, 200, 3),
(22, 2, 59, 200, 4),
(23, 2, 30, 200, 5),
(24, 2, 70, 200, 6),
(25, 2, 50, 200, 7),
(26, 2, 27, 20, 8),
(27, 2, 1, 20, 9),
(28, 2, 32, 20, 10),
(29, 2, 31, 20, 11),
(30, 2, 43, 20, 12),
(31, 2, 44, 20, 13),
(32, 2, 45, 20, 14),
(33, 2, 77, 20, 15),
(34, 2, 78, 20, 16),
(35, 2, 79, 20, 17),
(36, 2, 80, 20, 18),
(37, 3, 25, 200, 1),
(38, 3, 26, 0, 2),
(39, 3, 53, 200, 3),
(40, 3, 54, 20, 4),
(41, 3, 58, 20, 5),
(42, 3, 73, 20, 6),
(43, 3, 63, 20, 7),
(44, 3, 27, 0, 8),
(45, 3, 1, 0, 9),
(46, 3, 32, 0, 10),
(47, 3, 31, 0, 11),
(48, 3, 43, 0, 12),
(49, 3, 44, 0, 13),
(50, 3, 45, 0, 14),
(51, 3, 77, 0, 15),
(52, 3, 78, 0, 16),
(53, 3, 79, 0, 17),
(54, 3, 80, 0, 18),
(55, 4, 26, 100, 1),
(56, 4, 53, 100, 2),
(57, 4, 54, 98, 3),
(58, 4, 73, 90, 4),
(59, 4, 72, 97, 5),
(60, 4, 51, 100, 6),
(61, 4, 70, 100, 7),
(62, 4, 27, 9, 8),
(63, 4, 1, 10, 9),
(64, 4, 32, 18, 10),
(65, 4, 31, 20, 11),
(66, 4, 43, 20, 12),
(67, 4, 44, 20, 13),
(68, 4, 45, 20, 14),
(69, 4, 77, 20, 15),
(70, 4, 78, 20, 16),
(71, 4, 79, 20, 17),
(72, 4, 80, 20, 18),
(73, 5, 25, 200, 1),
(74, 5, 60, 200, 2),
(75, 5, 30, 200, 3),
(76, 5, 70, 190, 4),
(77, 5, 50, 200, 5),
(78, 5, 51, 200, 6),
(79, 5, 52, 200, 7),
(80, 5, 27, 333, 8),
(81, 5, 1, 200, 9),
(82, 5, 32, 19, 10),
(83, 5, 31, 18, 11),
(84, 5, 43, 20, 12),
(85, 5, 44, 20, 13),
(86, 5, 45, 20, 14),
(87, 5, 77, 20, 15),
(88, 5, 78, 20, 16),
(89, 5, 79, 20, 17),
(90, 5, 80, 20, 18),
(91, 6, 25, 200, 1),
(92, 6, 26, 200, 2),
(93, 6, 30, 200, 3),
(94, 6, 70, 196, 4),
(95, 6, 50, 200, 5),
(96, 6, 51, 200, 6),
(97, 6, 60, 200, 7),
(98, 6, 27, 290, 8),
(99, 6, 1, 153, 9),
(100, 6, 32, 89, 10),
(101, 6, 31, 104, 11),
(102, 6, 43, 98, 12),
(103, 6, 44, 200, 13),
(104, 6, 45, 200, 14),
(105, 6, 77, 200, 15),
(106, 6, 78, 200, 16),
(107, 6, 79, 200, 17),
(108, 6, 80, 200, 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `barra` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `cliente` varchar(255) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `estado` tinyint(4) NOT NULL,
  `numeroOrden` varchar(50) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `stringSelecteDataId` varchar(255) DEFAULT NULL,
  `textoOrden` text NOT NULL,
  `fechaVenta` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `combos`
--
ALTER TABLE `combos`
  ADD PRIMARY KEY (`idcombo`);

--
-- Indices de la tabla `dia`
--
ALTER TABLE `dia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo` (`tipo`);

--
-- Indices de la tabla `menutipo`
--
ALTER TABLE `menutipo`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `semana`
--
ALTER TABLE `semana`
  ADD PRIMARY KEY (`id_semana`),
  ADD KEY `id_dia` (`id_dia`),
  ADD KEY `id_menu` (`id_menu`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `combos`
--
ALTER TABLE `combos`
  MODIFY `idcombo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=543;

--
-- AUTO_INCREMENT de la tabla `semana`
--
ALTER TABLE `semana`
  MODIFY `id_semana` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=543;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `Menu_ibfk_1` FOREIGN KEY (`tipo`) REFERENCES `menutipo` (`id_tipo`);

--
-- Filtros para la tabla `semana`
--
ALTER TABLE `semana`
  ADD CONSTRAINT `Semana_ibfk_1` FOREIGN KEY (`id_dia`) REFERENCES `dia` (`id`),
  ADD CONSTRAINT `Semana_ibfk_2` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
