-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-08-2024 a las 08:31:27
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `fannylinux`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizarMenu` (IN `p_id` INT, IN `p_nombre` VARCHAR(255), IN `p_tipo` VARCHAR(255), IN `p_precio` DECIMAL(10,2), IN `p_stockG` INT)   BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_id_menu` (IN `p_id_dia` INT, IN `p_nuevo_id_menu` INT, IN `p_numero` INT)   BEGIN
    UPDATE `semana`
    SET `id_menu` = p_nuevo_id_menu
    WHERE `id_dia` = p_id_dia
    AND `numero` = p_numero;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_precios_colacion` (IN `p_id_colaciones` INT, IN `p_valor` DECIMAL(10,2))   BEGIN
    UPDATE precios_colaciones
    SET
        valor = p_valor
    WHERE
        id_colaciones = p_id_colaciones;

    SELECT 'Tabla precios_colaciones actualizada correctamente' AS mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_stock` (IN `p_id_dia` INT, IN `p_id_menu` INT, IN `p_stockD` INT)   BEGIN
    UPDATE semana
    SET stockD = p_stockD
    WHERE id_dia = p_id_dia AND id_menu = p_id_menu;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarMenu` (IN `p_nombre` VARCHAR(255), IN `p_tipo` VARCHAR(50), IN `p_precio` DECIMAL(10,2), IN `p_stockG` INT)   BEGIN
    INSERT INTO Menu(nombre, tipo, precio, stockG)
    VALUES (p_nombre, p_tipo, p_precio, p_stockG);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `restar_stock_semanal` (IN `p_id_dia` INT, IN `p_id_menu` INT, IN `p_cantidad` INT)   BEGIN
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
(1, 'Pollo Asado', 1, 2200, 170),
(24, 'EnsaladaC', 14, 1100, 0),
(25, 'ChulFri', 1, 2200, 500),
(26, 'Chopsuey', 1, 2200, 200),
(27, 'Arroz', 2, 1200, 140),
(30, 'Pure', 2, 1200, 200),
(31, 'PapasFritasC', 3, 2600, 120),
(32, 'PapasfritasG', 12, 3000, 120),
(33, 'EnsaladaM', 6, 1600, 0),
(36, 'EnsaladaG', 13, 2100, 0),
(37, 'FantaBebida', 5, 1100, 0),
(38, 'CocaColaLBebida', 5, 1100, 0),
(39, 'KemLBebida', 5, 1100, 0),
(40, 'Motehuesillo', 7, 1500, 0),
(41, 'Vasoconfruta', 7, 1200, 0),
(42, 'Jalea', 7, 400, 0),
(43, 'Pinoalhorno', 4, 2000, 120),
(44, 'Pinofrita', 4, 1500, 220),
(45, 'Quesofrita', 4, 1300, 320),
(46, 'Jugo', 5, 1000, 0),
(47, 'Limonada', 5, 2000, 0),
(48, 'CocaColaLata', 5, 900, 0),
(49, 'Sprite', 5, 900, 0),
(50, 'CazVac', 10, 3500, 600),
(51, 'Porotos', 10, 3500, 800),
(52, 'Longaniza', 10, 3500, 0),
(53, 'LomCerd', 1, 2200, 40),
(54, 'PulpaHor', 1, 2200, 20),
(55, 'Charquican', 10, 3500, 0),
(56, 'BudZap', 10, 3500, 0),
(57, 'Lentejas', 10, 3500, 900),
(58, 'PolloCham', 1, 2200, 0),
(59, 'PesFrito', 1, 2200, 0),
(60, 'CostJugo', 1, 2200, 400),
(61, 'GuatJar', 10, 3500, 0),
(62, 'PolloApa', 1, 2200, 20),
(63, 'CarneJug', 1, 2200, 40),
(64, 'Lasanna', 10, 3500, 0),
(65, 'Cubiertos', 8, 1400, 0),
(66, 'Flan', 7, 400, 0),
(67, 'BistecPob', 9, 5000, 0),
(68, 'Bolsa', 8, 400, 0),
(69, 'Consome', 8, 1400, 0),
(70, 'Fideos', 2, 1200, 300),
(71, 'PapasDor', 2, 1200, 520),
(72, 'PapaMay', 2, 1200, 0),
(73, 'AlbondJugo', 1, 2200, 0),
(74, 'Pebre', 7, 400, 0),
(76, 'Hipocalorico', 8, 3700, 0),
(77, 'QuesCamFrita', 4, 1500, 520),
(78, 'MechQueso', 4, 2000, 80),
(79, 'Sopaipilla', 4, 300, 90),
(80, 'NapHorno', 4, 2000, 40),
(81, 'Hamburguesa', 1, 10000, 20),
(86, 'VACIO', 11, 0, 0),
(89, '', 0, 0, 0);

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
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `barra`, `cantidad`, `cliente`, `comentario`, `estado`, `numeroOrden`, `precio`, `precioUnitario`, `stringSelecteDataId`, `textoOrden`) VALUES
(28, '741042633', 1, NULL, '', 0, '2', 4000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC'),
(30, '741101811', 1, NULL, '', 0, '4', 4000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC'),
(31, '741184974', 1, NULL, '', 0, '5', 3500.00, 3500.00, '56-27', 'BudZap c/n Arroz'),
(32, '747569526', 1, 'Hola', '', 1, '6', 4000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC'),
(33, '748996093', 1, 'Bastian', '', 1, '7', 4000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC'),
(34, '749493231', 1, 'dcdczczczsc', '', 1, '8', 4000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC'),
(37, '749953077', 11, 'Bastian2', '', 0, '9', 44000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC'),
(38, '749953077', 11, 'Bastian2', '', 0, '9', 44000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC'),
(39, '752422710', 1, NULL, '', 0, '10', 4000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC'),
(40, '752422710', 1, NULL, '', 0, '10', 4000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC'),
(41, '752422710', 1, NULL, '', 0, '10', 4000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC'),
(42, '752878937', 1, NULL, '', 0, '10', 4000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC'),
(43, '752878937', 1, NULL, '', 0, '10', 4000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC'),
(44, '752878937', 1, NULL, '', 0, '10', 4000.00, 4000.00, '1-27-24', 'Pollo Asado c/n Arroz + EnsaladaC');

--
-- Disparadores `pedidos`
--
DELIMITER $$
CREATE TRIGGER `after_pedidos_delete` AFTER DELETE ON `pedidos` FOR EACH ROW BEGIN
    INSERT INTO Ventas (numeroOrden, precio, cantidad, textoOrden, cliente, comentario, tipoVenta)
    VALUES (
        OLD.numeroOrden,
        OLD.precio,
        OLD.cantidad,
        OLD.textoOrden,
        COALESCE(OLD.cliente, 'Caja'), -- Si cliente es nulo, usa 'Caja'
        OLD.comentario,
        IF(OLD.cliente IS NULL, 'Caja', 'Encargo') -- 'Caja' si cliente es nulo, de lo contrario 'Encargo'
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
(1, 1, 25, 100, 1),
(2, 1, 30, 200, 2),
(3, 1, 70, 300, 3),
(4, 1, 71, 500, 4),
(5, 1, 50, 600, 5),
(6, 1, 51, 800, 6),
(7, 1, 57, 900, 7),
(8, 1, 27, 100, 8),
(9, 1, 1, 100, 9),
(10, 1, 32, 100, 10),
(11, 1, 31, 100, 11),
(12, 1, 43, 100, 12),
(13, 1, 44, 200, 13),
(14, 1, 45, 300, 14),
(15, 1, 77, 500, 15),
(16, 1, 78, 60, 16),
(17, 1, 79, 70, 17),
(18, 1, 80, 20, 18),
(19, 2, 30, 0, 1),
(20, 2, 70, 0, 2),
(21, 2, 71, 0, 3),
(22, 2, 72, 0, 4),
(23, 2, 50, 0, 5),
(24, 2, 51, 0, 6),
(25, 2, 52, 0, 7),
(26, 2, 27, 0, 8),
(27, 2, 1, 0, 9),
(28, 2, 32, 0, 10),
(29, 2, 31, 0, 11),
(30, 2, 43, 0, 12),
(31, 2, 44, 0, 13),
(32, 2, 45, 0, 14),
(33, 2, 77, 0, 15),
(34, 2, 78, 0, 16),
(35, 2, 79, 0, 17),
(36, 2, 80, 0, 18),
(37, 3, 25, 200, 1),
(38, 3, 26, 0, 2),
(39, 3, 60, 200, 3),
(40, 3, 81, 20, 4),
(41, 3, 53, 20, 5),
(42, 3, 63, 20, 6),
(43, 3, 71, 20, 7),
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
(55, 4, 25, 0, 1),
(56, 4, 26, 0, 2),
(57, 4, 53, 0, 3),
(58, 4, 59, 0, 4),
(59, 4, 58, 0, 5),
(60, 4, 54, 0, 6),
(61, 4, 60, 0, 7),
(62, 4, 27, 0, 8),
(63, 4, 1, 0, 9),
(64, 4, 32, 0, 10),
(65, 4, 31, 0, 11),
(66, 4, 43, 0, 12),
(67, 4, 44, 0, 13),
(68, 4, 45, 0, 14),
(69, 4, 77, 0, 15),
(70, 4, 78, 0, 16),
(71, 4, 79, 0, 17),
(72, 4, 80, 0, 18),
(73, 5, 25, 200, 1),
(74, 5, 26, 200, 2),
(75, 5, 60, 200, 3),
(76, 5, 53, 20, 4),
(77, 5, 54, 20, 5),
(78, 5, 63, 20, 6),
(79, 5, 62, 20, 7),
(80, 5, 27, 20, 8),
(81, 5, 1, 20, 9),
(82, 5, 32, 20, 10),
(83, 5, 31, 20, 11),
(84, 5, 43, 20, 12),
(85, 5, 44, 20, 13),
(86, 5, 45, 20, 14),
(87, 5, 77, 20, 15),
(88, 5, 78, 20, 16),
(89, 5, 79, 20, 17),
(90, 5, 80, 20, 18),
(91, 6, 50, 0, 1),
(92, 6, 51, 0, 2),
(93, 6, 52, 0, 3),
(94, 6, 55, 0, 4),
(95, 6, 56, 0, 5),
(96, 6, 57, 0, 6),
(97, 6, 61, 0, 7),
(98, 6, 27, 20, 8),
(99, 6, 1, 50, 9),
(100, 6, 32, 0, 10),
(101, 6, 31, 0, 11),
(102, 6, 43, 0, 12),
(103, 6, 44, 0, 13),
(104, 6, 45, 0, 14),
(105, 6, 77, 0, 15),
(106, 6, 78, 0, 16),
(107, 6, 79, 0, 17),
(108, 6, 80, 0, 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `numeroOrden` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `textoOrden` text DEFAULT NULL,
  `cliente` varchar(255) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `fechaVenta` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipoVenta` enum('Caja','Encargo') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `numeroOrden`, `precio`, `cantidad`, `textoOrden`, `cliente`, `comentario`, `fechaVenta`, `tipoVenta`) VALUES
(13, '1', 4000.00, 1, 'Pollo Asado c/n Arroz + EnsaladaC', 'Caja', '', '2024-08-04 02:59:01', 'Caja'),
(14, '3', 4000.00, 1, 'Pollo Asado c/n Arroz + EnsaladaC', 'Caja', '', '2024-08-04 03:12:30', 'Caja'),
(15, '2', 3500.00, 1, 'Pollo Asado c/n Arroz', 'Caja', '', '2024-08-04 03:12:58', 'Caja'),
(16, '8', 4000.00, 1, 'Pollo Asado c/n Arroz + EnsaladaC', 'dcdczczczsc', '', '2024-08-04 05:33:29', 'Encargo'),
(17, '8', 4000.00, 1, 'Pollo Asado c/n Arroz + EnsaladaC', 'dcdczczczsc', '', '2024-08-04 05:33:29', 'Encargo');

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
  MODIFY `idcombo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `semana`
--
ALTER TABLE `semana`
  MODIFY `id_semana` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
