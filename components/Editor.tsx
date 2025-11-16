import React, { useState, useEffect } from 'react';
import type { Product, StoreData, NotificationType } from '../types';
import { Save, X, Plus, Trash2, Loader2, Search, Upload } from './Icons';
import ProductCard from './ProductCard';

interface EditorProps {
    storeData: StoreData;
    setStoreData: React.Dispatch<React.SetStateAction<StoreData>>;
    updateProduct: (categoryKey: string, productId: number, field: string, value: any) => void;
    deleteProduct: (categoryKey: string, productId: number) => void;
    addProduct: (categoryKey: string) => void;
    addCategory: () => string;
    deleteCategory: (categoryKey: string) => void;
    updateCategoryName: (categoryKey: string, newName: string) => void;
    handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleFeaturedImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleFeaturedGalleryUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    removeFeaturedGalleryImage: (index: number) => void;
    handleSaveAndExit: () => Promise<void>;
    saving: boolean;
    showNotification: (message: string, type?: NotificationType['type']) => void;
}

const Editor: React.FC<EditorProps> = ({
    storeData,
    setStoreData,
    updateProduct,
    deleteProduct,
    addProduct,
    addCategory,
    deleteCategory,
    updateCategoryName,
    handleLogoUpload,
    handleFeaturedImageUpload,
    handleFeaturedGalleryUpload,
    removeFeaturedGalleryImage,
    handleSaveAndExit,
    saving,
    showNotification,
}) => {
    const [selectedCategory, setSelectedCategory] = useState(Object.keys(storeData.categories)[0] || '');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const categoryExists = selectedCategory in storeData.categories;
        if (!categoryExists && Object.keys(storeData.categories).length > 0) {
            setSelectedCategory(Object.keys(storeData.categories)[0]);
        }
    }, [storeData.categories, selectedCategory]);

    const handleAddCategory = () => {
        const newCategoryKey = addCategory();
        setSelectedCategory(newCategoryKey);
    };

    const getFilteredProducts = () => {
        if (!storeData.categories[selectedCategory]) return [];
        let products = storeData.categories[selectedCategory].products;
        if (searchTerm) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return products;
    };
    
    return (
        <div className="relative z-10">
            <header className="bg-black/80 backdrop-blur-md text-white shadow-2xl border-b border-amber-500/20 sticky top-0 z-30">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <label className="relative cursor-pointer group">
                            {storeData.logo.startsWith('data:') || storeData.logo.startsWith('http') ? (
                                <img src={storeData.logo} alt="Store Logo" className="h-20 w-20 object-contain rounded-md" />
                            ) : (
                                <div className="h-20 w-20 flex items-center justify-center text-6xl bg-gray-800/50 border-2 border-dashed border-amber-500/50 rounded-md">
                                    {storeData.logo}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md text-center p-1">
                                <Upload size={24} />
                                <span className="text-white text-sm font-bold">Change</span>
                            </div>
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                        <input
                            type="text"
                            value={storeData.name}
                            onChange={(e) => setStoreData(prev => ({ ...prev, name: e.target.value }))}
                            className="text-4xl font-bold bg-white/10 rounded px-3 py-2 border-2 border-amber-500 text-amber-400"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={handleSaveAndExit} disabled={saving} className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-2 rounded-lg font-semibold hover:scale-110 transition flex items-center space-x-2 disabled:opacity-50">
                            {saving ? <><Loader2 size={20} className="animate-spin" /><span>Saving...</span></> : <><Save size={20} /><span>Save & Exit</span></>}
                        </button>
                    </div>
                </div>
            </header>

            <main>
                <section className="container mx-auto px-4 py-8">
                    <div className="bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-amber-500/20">
                        <div className="md:flex">
                            <div className="md:w-1/2 relative bg-black p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-300 block mb-2">Featured Image URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={storeData.featuredModel.image}
                                            onChange={(e) => setStoreData(prev => ({ ...prev, featuredModel: { ...prev.featuredModel, image: e.target.value } }))}
                                            className="flex-1 border-2 border-amber-500 rounded p-2 bg-black/50 text-white"
                                        />
                                        <label className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded cursor-pointer font-semibold flex items-center">
                                            Upload
                                            <input type="file" accept="image/*" onChange={handleFeaturedImageUpload} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                                <div className="w-full aspect-square bg-black rounded flex items-center justify-center">
                                    <img src={storeData.featuredModel.image} alt="Featured" className="w-full h-full object-contain rounded p-4" />
                                </div>
                                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-white font-bold text-sm">Image Gallery</label>
                                        <label className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded cursor-pointer text-xs font-semibold flex items-center gap-1">
                                            <Plus size={14} /> Add Images
                                            <input type="file" accept="image/*" multiple onChange={handleFeaturedGalleryUpload} className="hidden" />
                                        </label>
                                    </div>
                                    {storeData.featuredModel.gallery && storeData.featuredModel.gallery.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-2">
                                            {storeData.featuredModel.gallery.map((img, idx) => (
                                                <div key={idx} className="relative group aspect-square bg-black rounded">
                                                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-contain rounded" />
                                                    <button onClick={() => removeFeaturedGalleryImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><X size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p className="text-center text-gray-400 text-xs py-2">No gallery images.</p>}
                                </div>
                            </div>
                            <div className="md:w-1/2 p-8 flex flex-col justify-center space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-300 block mb-2">Featured Title</label>
                                    <input type="text" value={storeData.featuredModel.title} onChange={(e) => setStoreData(prev => ({ ...prev, featuredModel: { ...prev.featuredModel, title: e.target.value } }))} className="text-3xl font-bold w-full border-2 border-amber-500 rounded p-2 bg-black/50 text-amber-400" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-300 block mb-2">Featured Description</label>
                                    <textarea value={storeData.featuredModel.description} onChange={(e) => setStoreData(prev => ({ ...prev, featuredModel: { ...prev.featuredModel, description: e.target.value } }))} className="w-full border-2 border-amber-500 rounded p-2 h-32 bg-black/50 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="products-section" className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-4 overflow-x-auto pb-2 flex-1">
                            {Object.keys(storeData.categories).map((catKey) => (
                                <div key={catKey} className="relative group whitespace-nowrap">
                                    <div className="flex items-center gap-2 bg-gray-800/50 border border-amber-500/30 rounded-lg p-2">
                                        <input
                                            type="text"
                                            value={storeData.categories[catKey].name}
                                            onChange={(e) => updateCategoryName(catKey, e.target.value)}
                                            className="bg-transparent text-white font-semibold px-2 py-1 border-b border-amber-500 focus:outline-none w-32"
                                        />
                                        <button
                                            onClick={() => setSelectedCategory(catKey)}
                                            className={`px-4 py-2 rounded font-semibold transition ${selectedCategory === catKey ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black' : 'bg-gray-700 text-gray-300'}`}
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(catKey)}
                                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleAddCategory}
                            className="ml-4 flex-shrink-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition flex items-center gap-2 whitespace-nowrap shadow-lg"
                        >
                            <Plus size={20} /> New Category
                        </button>
                        <div className="relative flex-shrink-0 ml-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input type="text" placeholder="Search in category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-black/50 border border-amber-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getFilteredProducts().map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                categoryKey={selectedCategory}
                                editMode={true}
                                updateProduct={updateProduct}
                                deleteProduct={deleteProduct}
                                addToCart={() => {}}
                                openWhatsApp={() => {}}
                                showNotification={showNotification}
                                setShowGallery={() => {}}
                            />
                        ))}
                        {storeData.categories[selectedCategory] && (
                            <div className="bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-lg rounded-lg border-2 border-dashed border-amber-500/30 flex items-center justify-center min-h-[300px]">
                                <button onClick={() => addProduct(selectedCategory)} className="flex flex-col items-center space-y-2 text-amber-400 hover:text-amber-300 transition">
                                    <Plus size={48} />
                                    <span className="font-semibold">Add Product</span>
                                </button>
                            </div>
                        )}
                    </div>
                </section>
                <section className="container mx-auto px-4 py-8">
                    <div className="bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-amber-500/20">
                        <h2 className="text-2xl font-bold mb-6 text-amber-400">Configuración del Pie de Página</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-300 block mb-2">Texto Principal del Pie de Página</label>
                                <input
                                    type="text"
                                    value={storeData.footer.mainText}
                                    onChange={(e) => setStoreData(prev => ({ ...prev, footer: { ...prev.footer, mainText: e.target.value } }))}
                                    className="w-full border-2 border-amber-500 rounded p-2 bg-black/50 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-300 block mb-2">Texto de Copyright (sin el año y nombre de la tienda)</label>
                                <input
                                    type="text"
                                    value={storeData.footer.copyrightText}
                                    onChange={(e) => setStoreData(prev => ({ ...prev, footer: { ...prev.footer, copyrightText: e.target.value } }))}
                                    className="w-full border-2 border-amber-500 rounded p-2 bg-black/50 text-white"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Editor;
