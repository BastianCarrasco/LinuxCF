BEGIN
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
    END