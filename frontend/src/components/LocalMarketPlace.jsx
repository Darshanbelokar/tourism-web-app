import { Card } from "./UI/card";
import { Button } from "./UI/button";
import { Badge } from "./UI/badge";
import { ShoppingBag, Star, Truck, Shield, Hand } from "lucide-react";
import DokraBronzeFigurines from "@/assets/DokraBronzeFigurines.jpg";
import SantalBambooBaskets from "@/assets/SantalBambooBasket.jpeg";
import TribalJewelrySet from "@/assets/TribalJwellerySett.jpeg";
import HandmadePottery from "@/assets/HandMadePottery.jpeg";

const products = [
  {
    id: 1,
    name: "Handwoven Dokra Art",
    image: DokraBronzeFigurines,
    price: "₹2,500",
    originalPrice: "₹3,200",
    rating: 4.9,
    reviews: 127,
    seller: "Tribal Artisan Collective",
    description: "Authentic brass figurines made using traditional lost-wax technique depicting tribal dancers and musicians.",
    featured: true
  },
  {
    id: 2,
    name: "Santal Bamboo Baskets",
    image: SantalBambooBaskets,
    price: "₹450",
    rating: 4.7,
    reviews: 89,
    seller: "Dumka Weavers Group",
    description: "Eco-friendly storage baskets woven by Santal tribal women.",
    featured: false
  },
  {
    id: 3,
    name: "Tribal Jewelry Set",
    image: TribalJewelrySet,
    price: "₹1,800",
    originalPrice: "₹2,400",
    rating: 4.8,
    reviews: 156,
    seller: "Oraon Craft Cooperative",
    description: "Traditional silver-toned jewelry with tribal motifs.",
    featured: true
  },
  {
    id: 4,
    name: "Handmade Pottery",
    image: HandmadePottery,
    price: "₹680",
    rating: 4.6,
    reviews: 73,
    seller: "Munda Potter Guild",
    description: "Terracotta pots and decorative items with tribal patterns.",
    featured: false
  }
];

import { useCart } from "@/contexts/CartContext";

const LocalMarketplace = () => {
  const { addToCart } = useCart();
  return (
    <section id="marketplace" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Local Artisan Marketplace
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Support tribal communities by purchasing authentic handcrafted items 
            directly from local artisans across Jharkhand.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center justify-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground">Verified Artisans</span>
          </div>
          <div className="flex items-center justify-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Truck className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground">Free Shipping</span>
          </div>
          <div className="flex items-center justify-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Star className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground">Quality Guaranteed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-44 object-cover"
                />
                {product.featured && (
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                    Featured
                  </Badge>
                )}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <Star className="h-3 w-3 text-accent fill-current" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg font-bold text-primary">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>{product.seller}</span>
                  <span>({product.reviews} reviews)</span>
                </div>
                
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Browse All Products
          </Button>
        </div>
      </div>

        {/* Google Map Embed */}
        <div className="my-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Find Local Artisans on the Map</h2>
          <div className="flex justify-center">
            <iframe
              title="Jharkhand Artisans Map"
              width="600"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps?q=Jharkhand,India&output=embed"
            ></iframe>
          </div>
        </div>
    </section>
  );
};

export default LocalMarketplace;