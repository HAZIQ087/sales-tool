-- Fix security warning by setting search_path for the function
CREATE OR REPLACE FUNCTION update_product_stock(
    product_id UUID,
    quantity_sold INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Update the product stock by subtracting the sold quantity
    UPDATE public.products 
    SET stock = stock - quantity_sold,
        updated_at = now()
    WHERE id = product_id;
    
    -- Insert inventory movement record
    INSERT INTO public.inventory_movements (
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
    FROM public.products 
    WHERE id = product_id;
END;
$$;