import type { StoreData } from '../types';
import { supabase } from './supabaseClient';

// --- Supabase Implementation ---

// Nombre de la tabla en Supabase. 
// ¡ASEGÚRATE DE HABER CREADO ESTA TABLA EN EL SQL EDITOR DE SUPABASE!
// Código SQL para crearla:
// create table store_main ( id bigint primary key default 1, content jsonb );
// alter table store_main disable row level security;
// insert into store_main (id, content) values (1, '{}');
const TABLE_NAME = 'store_main';
const ROW_ID = 1; // Usaremos siempre la fila con ID 1 para guardar todo el objeto de la tienda.

export const saveData = async (data: StoreData): Promise<void> => {
  try {
    // Upsert: Actualiza si existe, inserta si no.
    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert({ id: ROW_ID, content: data });

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error saving data to Supabase:", error);
    throw new Error("Failed to save data to cloud.");
  }
};

export const loadData = async (defaultData: StoreData): Promise<StoreData> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('content')
      .eq('id', ROW_ID)
      .single();

    if (error) {
        // Si el error es que no encontró filas, guardamos la data por defecto
        if (error.code === 'PGRST116') { 
            console.log("No data found in Supabase, initializing...");
            await saveData(defaultData);
            return defaultData;
        }
        console.error("Supabase Load Error:", error);
        throw error;
    }

    if (data && data.content && Object.keys(data.content).length > 0) {
      const supabaseData = data.content as StoreData;
      
      // Deep merge with default data to prevent crashes from outdated structures
      const validatedData: StoreData = {
          ...defaultData,
          ...supabaseData,
          featuredModel: {
              ...defaultData.featuredModel,
              ...(supabaseData.featuredModel || {}),
              gallery: supabaseData.featuredModel?.gallery || defaultData.featuredModel.gallery
          },
          categories: supabaseData.categories || defaultData.categories,
          footer: {
              ...defaultData.footer,
              ...(supabaseData.footer || {}),
          }
      };
      return validatedData;
    } else {
        return defaultData;
    }

  } catch (error) {
    console.error("Error loading data from Supabase:", error);
    // Fallback to default data if connection fails
    throw new Error("Could not connect to the database. Displaying default data.");
  }
};
