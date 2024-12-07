DO $$ 
DECLARE
    r RECORD;
BEGIN
    SELECT setval(pg_get_serial_sequence('public.pokemon', 'id'), MAX(id)) FROM public.pokemon INTO r;    
    SELECT setval(pg_get_serial_sequence('public.species', 'id'), MAX(id)) FROM public.species INTO r;    
    SELECT setval(pg_get_serial_sequence('public.types', 'id'), MAX(id)) FROM public.types INTO r;    
    SELECT setval(pg_get_serial_sequence('public.moves', 'id'), MAX(id)) FROM public.moves INTO r;    
    SELECT setval(pg_get_serial_sequence('public.abilities', 'id'), MAX(id)) FROM public.abilities INTO r;    
    SELECT setval(pg_get_serial_sequence('public.pokemon_base_stats', 'pokemon_id'), MAX(pokemon_id)) FROM public.pokemon_base_stats INTO r;
    SELECT setval(pg_get_serial_sequence('public.natures', 'id'), MAX(id)) FROM public.natures INTO r;
END $$;
