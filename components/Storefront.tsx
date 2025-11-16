




import React, { useState, useEffect } from 'react';
import type { Product, StoreData, NotificationType } from '../types';
import { ShoppingCart, Edit2, X, Trash2, Search, ChevronLeft, ChevronRight, MessageCircle } from './Icons';
import ProductCard from './ProductCard';

interface StorefrontProps {
  storeData: StoreData;
  showNotification: (message: string, type?: NotificationType['type']) => void;
}

const Storefront: React.FC<StorefrontProps> = ({ storeData, showNotification }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(storeData.categories)[0] || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGallery, setShowGallery] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredModelGalleryIndex, setFeaturedModelGalleryIndex] = useState(0);

  useEffect(() => {
    if (storeData.featuredModel.gallery && storeData.featuredModel.gallery.length > 1) {
      const interval = setInterval(() => {
        setFeaturedModelGalleryIndex(prev => (prev + 1) % storeData.featuredModel.gallery.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [storeData.featuredModel.gallery]);

  useEffect(() => {
    const categoryExists = selectedCategory in storeData.categories;
    if (!categoryExists && Object.keys(storeData.categories).length > 0) {
      setSelectedCategory(Object.keys(storeData.categories)[0]);
    }
  }, [storeData.categories, selectedCategory]);

  const addToCart = (product: Product) => {
    setCart(prevCart => [...prevCart, product]);
    showNotification(`${product.name} added to cart`, 'success');
  };

  const removeFromCart = (index: number) => {
    const removed = cart[index];
    setCart(cart.filter((_, i) => i !== index));
    showNotification(`${removed.name} removed from cart`, 'info');
  };

  const getTotalCart = () => cart.reduce((sum, item) => sum + item.price, 0);

  const openWhatsApp = (productName = '') => {
    const whatsappNumber = '573001234567';
    const message = productName
      ? `Hello! I'm interested in: ${productName}`
      : 'Hello! I have a question';
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
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

  const handleShowGallery = (product: Product) => {
    setShowGallery(product);
    setCurrentImageIndex(0);
  };

  return (
    <div className="relative z-10">
      <header className="bg-black/80 backdrop-blur-md text-white shadow-2xl border-b border-amber-500/20 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {storeData.logo.startsWith('data:') || storeData.logo.startsWith('http') ? (
              <img src={storeData.logo} alt="Store Logo" className="h-20 w-auto object-contain" />
            ) : (
              <span className="text-6xl">{storeData.logo}</span>
            )}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">{storeData.name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowCart(true)} className="relative bg-gradient-to-r from-amber-500 to-amber-600 text-black p-3 rounded-lg hover:scale-110 transition">
              <ShoppingCart size={24} />
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all duration-500">
            <div className="md:flex">
              <div className="md:w-1/2 relative bg-black md:aspect-square">
                <img
                  src={storeData.featuredModel.gallery?.[featuredModelGalleryIndex] || storeData.featuredModel.image}
                  alt={storeData.featuredModel.title}
                  className="w-full h-full object-cover"
                />
                {storeData.featuredModel.gallery && storeData.featuredModel.gallery.length > 1 && (
                  <>
                    <button onClick={() => setFeaturedModelGalleryIndex(prev => (prev - 1 + storeData.featuredModel.gallery.length) % storeData.featuredModel.gallery.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition">
                      <ChevronLeft size={28} />
                    </button>
                    <button onClick={() => setFeaturedModelGalleryIndex(prev => (prev + 1) % storeData.featuredModel.gallery.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition">
                      <ChevronRight size={28} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {storeData.featuredModel.gallery.map((_, idx) => (
                        <button key={idx} onClick={() => setFeaturedModelGalleryIndex(idx)} className={`w-3 h-3 rounded-full ${idx === featuredModelGalleryIndex ? 'bg-amber-500' : 'bg-white/50'}`}></button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4">{storeData.featuredModel.title}</h2>
                <p className="text-gray-300 text-lg">{storeData.featuredModel.description}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="products-section" className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2 flex-1">
              {Object.keys(storeData.categories).map((catKey) => (
                <div key={catKey} className="relative group whitespace-nowrap">
                  <button
                    onClick={() => setSelectedCategory(catKey)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${selectedCategory === catKey
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg scale-105'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                      }`}
                  >
                    {storeData.categories[catKey].name}
                  </button>
                </div>
              ))}
            </div>
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
                editMode={false}
                updateProduct={() => {}}
                deleteProduct={() => {}}
                addToCart={addToCart}
                openWhatsApp={openWhatsApp}
                showNotification={showNotification}
                setShowGallery={handleShowGallery}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-900/80 backdrop-blur-md text-white py-8 mt-12 border-t border-amber-500/20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">{storeData.name}</h3>
          <p className="text-gray-400 text-sm">{storeData.footer.mainText}</p>
          <p className="text-gray-500 text-xs mt-4">© {new Date().getFullYear()} {storeData.name}. {storeData.footer.copyrightText}</p>
        </div>
      </footer>

      {showCart && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex justify-end" onClick={() => setShowCart(false)}>
          <div className="bg-gradient-to-br from-gray-900 to-black w-full max-w-md h-full overflow-y-auto shadow-2xl border-l border-amber-500/20" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Cart</h2>
                <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white transition"><X size={24} /></button>
              </div>
              {cart.length === 0 ? <p className="text-gray-500 text-center py-8">Your cart is empty.</p> : (
                <>
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
                      <div>
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        <p className="text-amber-400 font-bold">${item.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-400 transition"><Trash2 size={20} /></button>
                    </div>
                  ))}
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-white">Total:</span>
                      <span className="text-2xl font-bold text-amber-400">${getTotalCart().toLocaleString()}</span>
                    </div>
                    <button onClick={() => openWhatsApp(`Hello! I want to order:\n\n${cart.map(item => `- ${item.name} ($${item.price.toLocaleString()})`).join('\n')}\n\nTotal: $${getTotalCart().toLocaleString()}`)} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-bold hover:scale-105 transition flex items-center justify-center gap-2">
                      <MessageCircle size={20} /> Order via WhatsApp
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showGallery && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setShowGallery(null)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={showGallery.gallery[currentImageIndex]} alt={showGallery.name} className="w-full max-h-[80vh] object-contain rounded-lg" />
            <button onClick={() => setShowGallery(null)} className="absolute top-4 right-4 bg-black/70 p-2 rounded-full"><X /></button>
            {showGallery.gallery.length > 1 && (
              <>
                <button onClick={() => setCurrentImageIndex(prev => (prev - 1 + showGallery.gallery.length) % showGallery.gallery.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition">
                  <ChevronLeft size={28} />
                </button>
                <button onClick={() => setCurrentImageIndex(prev => (prev + 1) % showGallery.gallery.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition">
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Storefront;