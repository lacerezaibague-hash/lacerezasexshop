



import React, { useState, useEffect, useCallback } from 'react';
import type { Product, StoreData, NotificationType, Category } from './types';
import Loader from './components/Loader';
import Notification from './components/Notification';
import { fileToBase64 } from './utils/fileUtils';
import Storefront from './components/Storefront';
import Editor from './components/Editor';


const defaultStoreData: StoreData = {
  name: "Pleasure Palace",
  logo: "💋",
  featuredModel: {
    title: "Model of the Month",
    image: "https://picsum.photos/seed/featured/800/600",
    description: "Discover our exclusive collection of the month with special discounts.",
    gallery: [
      "https://picsum.photos/seed/gallery1/800/600",
      "https://picsum.photos/seed/gallery2/800/600",
      "https://picsum.photos/seed/gallery3/800/600"
    ]
  },
  categories: {
    toys: {
      name: "Toys",
      products: [
        { id: 1, name: "Premium Vibrator", price: 45000, description: "High-quality vibrator with multiple speeds.", image: "🎀", gallery: ["https://picsum.photos/seed/toy1/400", "https://picsum.photos/seed/toy2/400"] },
        { id: 2, name: "Vibrating Ring", price: 25000, description: "Vibrating ring for couples.", image: "💍", gallery: [] }
      ]
    },
    lubricants: {
      name: "Lubricants",
      products: [
        { id: 5, name: "Water-Based Lubricant", price: 15000, description: "100ml, water-based.", image: "💧", gallery: [] },
      ]
    }
  },
  footer: {
    mainText: "Discreet shipping guaranteed.",
    copyrightText: "All rights reserved."
  }
};

const App: React.FC = () => {
    const [storeData, setStoreData] = useState<StoreData>(defaultStoreData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [notification, setNotification] = useState<NotificationType | null>(null);

    const showNotification = useCallback((message: string, type: NotificationType['type'] = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('edit') === 'true') {
            setEditMode(true);
        }
    }, []);

    useEffect(() => {
      const loadStoreData = () => {
        try {
          const storedData = localStorage.getItem('store-data');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            // Deep merge with default data to prevent crashes from outdated local storage structures
            const validatedData: StoreData = {
                ...defaultStoreData,
                ...parsedData,
                featuredModel: {
                    ...defaultStoreData.featuredModel,
                    ...(parsedData.featuredModel || {}),
                    gallery: parsedData.featuredModel?.gallery || defaultStoreData.featuredModel.gallery
                },
                categories: parsedData.categories || defaultStoreData.categories,
                footer: {
                    ...defaultStoreData.footer,
                    ...(parsedData.footer || {}),
                }
            };
            setStoreData(validatedData);
          } else {
             setStoreData(defaultStoreData);
          }
        } catch (error) {
          console.error('Error loading data from localStorage:', error);
          setStoreData(defaultStoreData);
        } finally {
          setLoading(false);
        }
      };
      loadStoreData();
    }, []);

    const saveStoreData = async () => {
      setSaving(true);
      // Use a timeout to give feedback to the user that something is happening
      await new Promise(resolve => setTimeout(resolve, 500));
      try {
        localStorage.setItem('store-data', JSON.stringify(storeData));
        showNotification('Changes saved successfully', 'success');
      } catch (error) {
        console.error("Error saving data to localStorage:", error);
        let message = "An unknown error occurred.";
        if (error instanceof Error) {
            message = error.message;
            if (error.name === 'QuotaExceededError' || message.includes('quota')) {
                message = "Storage limit exceeded. Please remove some images or products.";
            }
        }
        showNotification(`Error saving changes: ${message}`, 'error');
      } finally {
        setSaving(false);
      }
    };

    const handleSaveAndExit = async () => {
      await saveStoreData();
      const url = new URL(window.location.href);
      url.searchParams.delete('edit');
      window.location.href = url.toString();
    };
    
    const updateProduct = (categoryKey: string, productId: number, field: string, value: any) => {
        setStoreData(prevData => {
            const category = prevData.categories[categoryKey];
            if (!category) return prevData;

            const productIndex = category.products.findIndex(p => p.id === productId);
            if (productIndex === -1) return prevData;

            const updatedProducts = [...category.products];
            updatedProducts[productIndex] = { ...updatedProducts[productIndex], [field]: value };

            const updatedCategories = {
                ...prevData.categories,
                [categoryKey]: {
                    ...category,
                    products: updatedProducts
                }
            };
            return { ...prevData, categories: updatedCategories };
        });
    };
    
    const deleteProduct = (categoryKey: string, productId: number) => {
        setStoreData(prevData => {
            const category = prevData.categories[categoryKey];
            if (!category) return prevData;

            const updatedProducts = category.products.filter(p => p.id !== productId);
            const updatedCategories = {
                ...prevData.categories,
                [categoryKey]: {
                    ...category,
                    products: updatedProducts
                }
            };
            return { ...prevData, categories: updatedCategories };
        });
        showNotification('Product deleted', 'info');
    };

    const addProduct = (categoryKey: string) => {
        setStoreData(prevData => {
            const category = prevData.categories[categoryKey];
            if (!category) return prevData;
            
            const allProducts = Object.values(prevData.categories).flatMap((cat: Category) => cat.products);
            const newId = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.id)) + 1 : 1;
            const newProduct: Product = {
                id: newId,
                name: "New Product",
                price: 0,
                description: "Product description",
                image: "✨",
                gallery: []
            };

            const updatedProducts = [...category.products, newProduct];
            const updatedCategories = {
                ...prevData.categories,
                [categoryKey]: {
                    ...category,
                    products: updatedProducts
                }
            };
            return { ...prevData, categories: updatedCategories };
        });
        showNotification('Product added', 'success');
    };

    const addCategory = () => {
        const categoryKey = `category_${Date.now()}`;
        const newCategory: Category = {
            name: "New Category",
            products: []
        };
    
        setStoreData(prevData => {
            const updatedCategories = {
                ...prevData.categories,
                [categoryKey]: newCategory
            };
            return { ...prevData, categories: updatedCategories };
        });
        return categoryKey;
    };
    
    const deleteCategory = (categoryKey: string) => {
        if (Object.keys(storeData.categories).length <= 1) {
            showNotification('Must have at least one category', 'warning');
            return;
        }
    
        const categoryName = storeData.categories[categoryKey].name;
        
        setStoreData(prevData => {
            const updatedCategories = { ...prevData.categories };
            delete updatedCategories[categoryKey];
            return { ...prevData, categories: updatedCategories };
        });
        
        showNotification(`Category "${categoryName}" deleted`, 'info');
    };
    
    const updateCategoryName = (categoryKey: string, newName: string) => {
        setStoreData(prevData => {
            const category = prevData.categories[categoryKey];
            if (!category) return prevData;

            const updatedCategories = {
                ...prevData.categories,
                [categoryKey]: {
                    ...category,
                    name: newName
                }
            };
            return { ...prevData, categories: updatedCategories };
        });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const base64Image = await fileToBase64(file);
            setStoreData(prev => ({ ...prev, logo: base64Image }));
            showNotification('Logo updated', 'success');
        }
    };

    const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const base64Image = await fileToBase64(file);
            setStoreData(prev => ({
                ...prev,
                featuredModel: { ...prev.featuredModel, image: base64Image }
            }));
            showNotification('Featured image updated', 'success');
        }
    };
    
    const handleFeaturedGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: File[] = e.target.files ? Array.from(e.target.files) : [];
        if (files.length === 0) return;
    
        const base64Images = await Promise.all(files.map(file => fileToBase64(file)));
        setStoreData(prev => ({
            ...prev,
            featuredModel: {
                ...prev.featuredModel,
                gallery: [...(prev.featuredModel.gallery || []), ...base64Images]
            }
        }));
        showNotification(`${files.length} image(s) added to featured gallery`, 'success');
    };
    
    const removeFeaturedGalleryImage = (index: number) => {
        setStoreData(prev => ({
            ...prev,
            featuredModel: {
                ...prev.featuredModel,
                gallery: prev.featuredModel.gallery.filter((_, i) => i !== index)
            }
        }));
        showNotification('Image removed from gallery', 'info');
    };
    
    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-x-hidden">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f59e0b; /* amber-500 */
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d97706; /* amber-600 */
                }
            `}</style>
            <Notification notification={notification} />
            <div className="fixed inset-0 z-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            {editMode ? (
                <Editor
                    storeData={storeData}
                    setStoreData={setStoreData}
                    updateProduct={updateProduct}
                    deleteProduct={deleteProduct}
                    addProduct={addProduct}
                    addCategory={addCategory}
                    deleteCategory={deleteCategory}
                    updateCategoryName={updateCategoryName}
                    handleLogoUpload={handleLogoUpload}
                    handleFeaturedImageUpload={handleFeaturedImageUpload}
                    handleFeaturedGalleryUpload={handleFeaturedGalleryUpload}
                    removeFeaturedGalleryImage={removeFeaturedGalleryImage}
                    handleSaveAndExit={handleSaveAndExit}
                    saving={saving}
                    showNotification={showNotification}
                />
            ) : (
                <Storefront
                    storeData={storeData}
                    showNotification={showNotification}
                />
            )}
        </div>
    );
};

export default App;