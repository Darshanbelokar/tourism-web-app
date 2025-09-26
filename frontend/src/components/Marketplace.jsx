import React from 'react';
import dokraArtImg from '../assets/Dokra art.jpeg';
import bambooBasketImg from '../assets/SantalBambooBasket.jpeg';
import jewelryImg from '../assets/TribalJwellerySett.jpeg';
import potteryImg from '../assets/HandMadePottery.jpeg';

function Marketplace() {
  const products = [
    {
      name: "Handwoven Dokra Art",
      description: "Authentic brass figurines made using traditional lost-wax technique depicting tribal dancers and musicians.",
      price: 2500,
      oldPrice: 3200,
      seller: "Tribal Artisan Collective",
      reviews: 127,
      rating: 4.7,
      image: dokraArtImg,
    },
    {
      name: "Santal Bamboo Baskets",
      description: "Eco-friendly storage baskets woven by Santal tribal women.",
      price: 450,
      seller: "Dumka Weavers Group",
      reviews: 89,
      rating: 4.7,
      image: bambooBasketImg,
    },
    {
      name: "Tribal Jewelry Set",
      description: "Traditional silver-toned jewelry with tribal motifs.",
      price: 1800,
      oldPrice: 2400,
      seller: "Oraon Craft Cooperative",
      reviews: 156,
      rating: 4.8,
      image: jewelryImg,
    },
    {
      name: "Handmade Pottery",
      description: "Terracotta pots and decorative items with tribal patterns.",
      price: 680,
      seller: "Munda Potter Guild",
      reviews: 73,
      rating: 4.6,
      image: potteryImg,
    },
  ];

  return (
    <div className="marketplace p-4">
      <h2 className="text-2xl font-bold mb-4">Local Marketplace</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 flex flex-col">
            {product.image && (
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
            )}
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-700 mb-2">{product.description}</p>
            <div className="flex items-center mb-2">
              <span className="text-green-700 font-bold text-lg mr-2">₹{product.price}</span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through mr-2">₹{product.oldPrice}</span>
              )}
              <span className="text-yellow-500 font-semibold">★ {product.rating}</span>
              <span className="ml-2 text-gray-500 text-sm">({product.reviews} reviews)</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">Sold by: {product.seller}</div>
            <button className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
