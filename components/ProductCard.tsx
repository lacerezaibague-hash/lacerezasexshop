import React from 'react';
import type { Product } from '../types';
import { Trash2, Plus, X, ZoomIn, MessageCircle, Upload } from './Icons';
import { fileToBase64 } from '../utils/fileUtils';

interface ProductCardProps {
  product: Product;
  categoryKey: string;
  editMode: boolean;
  updateProduct: (categoryKey: string, productId: number, field: string, value: any) => void;
  deleteProduct: (categoryKey: string, productId: number) => void;
  addToCart: (product: Product) => void;
  openWhatsApp: (productName: string) => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  setShowGallery: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoryKey,
  editMode,
  updateProduct,
  deleteProduct,
  addToCart,
  openWhatsApp,
  showNotification,
  setShowGallery,
}) => {
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const base64Image = await fileToBase64(file);
        updateProduct(categoryKey, product.id, 'image', base64Image);
        showNotification('Image updated', 'success');
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const base64Images = await Promise.all(files.map(file => fileToBase64(file)));
    const newGallery = [...(product.gallery || []), ...base64Images];
    updateProduct(categoryKey, product.id, 'gallery', newGallery);
    showNotification(`${files.length} image(s) added to gallery`, 'success');
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = product.gallery.filter((_, i) => i !== index);
    updateProduct(categoryKey, product.id, 'gallery', newGallery);
    showNotification('Image removed from gallery', 'info');
  };

  if (editMode) {
    return (
      <div className="bg-gradient-to-br from-gray-800/80 to-black/80 backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden border border-amber-500/50 p-6 flex flex-col gap-4">
        {/* Image Edit */}
        <div className="flex gap-2">
            <input
                type="text"
                placeholder="Emoji or Image URL"
                value={product.image}
                onChange={(e) => updateProduct(categoryKey, product.id, 'image', e.target.value)}
                className="flex-1 border-2 border-amber-500 rounded p-2 bg-black/50 text-white text-sm"
            />
            <label
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded cursor-pointer transition hover:scale-105 font-semibold flex items-center justify-center"
              title="Upload Image"
            >
                <Upload size={20} />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
            </label>
        </div>
        <div className="relative w-full aspect-square bg-gray-900 rounded flex items-center justify-center overflow-hidden">
            {product.image.startsWith('http') || product.image.startsWith('data:') ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
            ) : (
                <div className="text-6xl text-center">{product.image}</div>
            )}
        </div>

        {/* Gallery Edit */}
        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg">
            <div className="flex justify-between items-center mb-3">
                <label className="text-white font-bold text-sm">Product Gallery</label>
                <label className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded cursor-pointer text-xs font-semibold flex items-center gap-1">
                    <Plus size={14} /> Add
                    <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden"/>
                </label>
            </div>
            {product.gallery && product.gallery.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                {product.gallery.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square bg-black rounded">
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-contain rounded"/>
                        <button onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><X size={14} /></button>
                    </div>
                ))}
                </div>
            ) : <p className="text-center text-gray-400 text-xs py-2">No gallery images.</p>}
        </div>

        {/* Name Edit */}
        <div className="relative">
            <input type="text" value={product.name} onChange={(e) => updateProduct(categoryKey, product.id, 'name', e.target.value)} className="w-full text-xl font-bold mb-2 border-2 border-amber-500 rounded p-2 bg-black/50 text-white"/>
        </div>
        
        {/* Description Edit */}
        <div className="relative">
          <textarea value={product.description} onChange={(e) => updateProduct(categoryKey, product.id, 'description', e.target.value)} className="w-full text-gray-300 mb-1 border-2 border-amber-500 rounded p-2 bg-black/50 h-24"/>
        </div>
        
        {/* Price Edit */}
        <input type="number" value={product.price} onChange={(e) => updateProduct(categoryKey, product.id, 'price', parseInt(e.target.value))} className="w-full text-2xl font-bold text-amber-400 border-2 border-amber-500 rounded p-2 bg-black/50"/>
        
        {/* Delete Button */}
        <button onClick={() => deleteProduct(categoryKey, product.id)} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2">
            <Trash2 size={20} /><span>Delete</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-black/80 backdrop-blur-lg rounded-lg shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 border border-amber-500/20 hover:border-amber-500/50 transform hover:-translate-y-2 group">
      <div className="p-6">
        <div className="relative mb-4 cursor-pointer" onClick={() => product.gallery && product.gallery.length > 0 && setShowGallery(product)}>
            {product.image.startsWith('http') || product.image.startsWith('data:') ? (
                <div className="w-full aspect-square bg-black rounded flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                </div>
            ) : (
                <div className="w-full aspect-square flex items-center justify-center text-6xl text-center group-hover:scale-110 transition-transform duration-500">{product.image}</div>
            )}
            {product.gallery && product.gallery.length > 0 && (
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <ZoomIn size={14} /> {product.gallery.length} photos
                </div>
            )}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-amber-400 transition-colors duration-300 truncate">{product.name}</h3>
        <p className="text-gray-400 mb-4 h-24 text-sm overflow-y-auto custom-scrollbar">{product.description}</p>
        <p className="text-2xl font-bold text-amber-400 mb-4">${product.price.toLocaleString()}</p>
        <div className="flex gap-2">
          <button onClick={() => addToCart(product)} className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black py-2 rounded-lg hover:scale-105 transition font-semibold">
            Add to Cart
          </button>
          <button onClick={(e) => { e.stopPropagation(); openWhatsApp(product.name); }} className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-500 transition">
            <MessageCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
