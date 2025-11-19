import type { StoreData } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const TABLE_NAME = 'store_main';
const ROW_ID = 1; 

export const saveData = async (data: StoreData): Promise<void> => {
  // 1. Check Configuration
  if (!isSupabaseConfigured) {
    throw new Error("DATABASE_NOT_CONFIGURED: Supabase variables are missing in Netlify.");
  }

  try {
    // 2. Attempt Save
    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert({ id: ROW_ID, content: data });

    if (error) {
      console.error("Supabase Save Error:", error);
      // Check for common RLS error
      if (error.code === '42501' || error.message.includes('row-level security')) {
         throw new Error("PERMISSION_DENIED: Run 'alter table store_main disable row level security;' in Supabase SQL Editor.");
      }
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error("Error saving data to Supabase:", error);
    // Rethrow with clear message for the UI
    if (error.message.startsWith("DATABASE_NOT_CONFIGURED")) throw error;
    if (error.message.startsWith("PERMISSION_DENIED")) throw error;
    
    throw new Error(`Failed to save: ${error.message || "Unknown network error"}`);
  }
};

export const loadData = async (defaultData: StoreData): Promise<StoreData> => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not configured, loading default local data.");
    return defaultData;
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('content')
      .eq('id', ROW_ID)
      .single();

    if (error) {
        // If table doesn't exist or row is missing
        if (error.code === 'PGRST116') { 
            console.log("No data found in Supabase, initializing with default...");
            // Attempt to create the row
            await saveData(defaultData);
            return defaultData;
        }
        console.error("Supabase Load Error Details:", error);
        throw error;
    }

    if (data && data.content && Object.keys(data.content).length > 0) {
      const supabaseData = data.content as StoreData;
      
      // Deep merge to ensure robustness
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
    // We don't throw here to allow the app to open even if DB fails
    return defaultData;
  }
};
