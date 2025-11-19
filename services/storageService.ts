import type { StoreData } from '../types';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDb } from "./firebase"; // Import the new function

// Get the database instance by calling the function.
// This ensures the DB is ready before we use it.
const db = getDb();

// --- LocalStorage Implementation (Deactivated) ---
/*
const LOCAL_STORAGE_KEY = 'store-data';

export const saveData = async (data: StoreData): Promise<void> => {
  try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
          throw new Error("Storage limit exceeded. Please remove some images or products.");
      }
      throw new Error("Failed to save data to local storage.");
  }
};

export const loadData = async (defaultData: StoreData): Promise<StoreData> => {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedData) {
    try {
        const parsedData = JSON.parse(storedData);
        // Deep merge with default data to prevent crashes from outdated local storage structures
        const validatedData: StoreData = {
            ...defaultData,
            ...parsedData,
            featuredModel: {
                ...defaultData.featuredModel,
                ...(parsedData.featuredModel || {}),
                gallery: parsedData.featuredModel?.gallery || defaultData.featuredModel.gallery
            },
            categories: parsedData.categories || defaultData.categories,
            footer: {
                ...defaultData.footer,
                ...(parsedData.footer || {}),
            }
        };
        return validatedData;
    } catch (error) {
        console.error("Failed to parse localStorage data. Using default data.", error);
        return defaultData;
    }
  }
  return defaultData;
};
*/

// --- Firebase/Firestore Implementation (Active) ---
const FIRESTORE_DOC_PATH = "store/data"; // Path to your document in Firestore

export const saveData = async (data: StoreData): Promise<void> => {
  try {
    const storeDocRef = doc(db, FIRESTORE_DOC_PATH);
    await setDoc(storeDocRef, data, { merge: true });
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
    throw new Error("Failed to save data to cloud.");
  }
};

export const loadData = async (defaultData: StoreData): Promise<StoreData> => {
  try {
    const storeDocRef = doc(db, FIRESTORE_DOC_PATH);
    const docSnap = await getDoc(storeDocRef);

    if (docSnap.exists()) {
      // Data exists, return it
      const firestoreData = docSnap.data() as StoreData;
      // Deep merge with default data to prevent crashes from outdated structures
      const validatedData: StoreData = {
          ...defaultData,
          ...firestoreData,
          featuredModel: {
              ...defaultData.featuredModel,
              ...(firestoreData.featuredModel || {}),
              gallery: firestoreData.featuredModel?.gallery || defaultData.featuredModel.gallery
          },
          categories: firestoreData.categories || defaultData.categories,
          footer: {
              ...defaultData.footer,
              ...(firestoreData.footer || {}),
          }
      };
      return validatedData;
    } else {
      // If no data exists in the cloud, save the default data there for the first time.
      console.log("No data in Firestore, initializing with default data.");
      await saveData(defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error("Error loading data from Firestore:", error);
    // Fallback to default data if there's an error connecting
    throw new Error("Could not connect to the database. Displaying default data.");
  }
};