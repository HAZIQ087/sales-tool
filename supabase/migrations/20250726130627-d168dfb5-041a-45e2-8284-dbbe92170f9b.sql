-- Create function to update product stock after a sale
CREATE OR REPLACE FUNCTION update_product_stock(
    product_id UUID,
    quantity_sold INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update the product stock by subtracting the sold quantity
    UPDATE products 
    SET stock = stock - quantity_sold,
        updated_at = now()
    WHERE id = product_id;
    
    -- Insert inventory movement record
    INSERT INTO inventory_movements (
        product_id,
        movement_type,
        quantity,
        reason,
        previous_stock,
        new_stock,
        movement_date
    )
    SELECT 
        product_id,
        'sale',
        -quantity_sold,
        'Stock reduction due to sale',
        stock + quantity_sold,
        stock,
        now()
    FROM products 
    WHERE id = product_id;
END;
$$;