import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./UI/button";
import { Menu, X, MapPin, Calendar, User, LogOut, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "@/components/auths/LoginDialog.jsx";
import SignupDialog from "./auths/SignupDialog";


const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { cart } = useCart();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
              JharkhandTourism
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#destinations" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Destinations
            </a>
            <a href="#culture" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Culture
            </a>
            <a href="#marketplace" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Marketplace
            </a>
            <a href="#planner" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Plan Trip
            </a>
            <Link to="/analytics" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Analytics
            </Link>
            <Link to="/feedback" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Feedback
            </Link>
            <Link to="/transport" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Transport
            </Link>
            <Link to="/arvr" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              AR/VR
            </Link>

            {/* Cart Icon */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{cart.length}</span>
              )}
            </Button>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground font-medium">
                  Welcome, {user.user_metadata?.full_name || user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLogin(true)}
                  className="hover:bg-primary/10 transition-colors duration-200"
                >
                  Sign In
                </Button>
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => setShowSignup(true)}
                  className="shadow-glow hover:shadow-lg transition-shadow duration-200"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 hover:bg-primary/10 transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative w-5 h-5">
              <Menu className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
              <X className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-75'}`} />
            </div>
          </Button>
  </div>
  {/* Cart Drawer */}
  <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen opacity-100 pb-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="border-t border-border/50 mt-2 pt-4">
            <div className="flex flex-col space-y-4 max-h-96 overflow-y-auto mobile-nav-scroll scrollbar-thin">
              <a
                href="#destinations"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Destinations
              </a>
              <a
                href="#culture"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Culture
              </a>
              <a
                href="#marketplace"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Marketplace
              </a>
              <a
                href="#planner"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Plan Trip
              </a>
              <Link
                to="/analytics"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Analytics
              </Link>
              <Link
                to="/feedback"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Feedback
              </Link>
              <Link
                to="/transport"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Transport
              </Link>
              <Link
                to="/arvr"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                AR/VR
              </Link>

              {/* Cart Button for Mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCartOpen(true);
                  setIsOpen(false);
                }}
                className="w-fit justify-start relative hover:bg-primary/10 transition-colors duration-200"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-1 left-6 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{cart.length}</span>
                )}
              </Button>

              {user ? (
                <div className="flex flex-col space-y-3 pt-2 border-t border-border/30">
                  <span className="text-sm text-muted-foreground font-medium">
                    Welcome, {user.user_metadata?.full_name || user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-fit hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-2 border-t border-border/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowLogin(true);
                      setIsOpen(false);
                    }}
                    className="w-fit justify-start hover:bg-primary/10 transition-colors duration-200"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => {
                      setShowSignup(true);
                      setIsOpen(false);
                    }}
                    className="w-fit shadow-glow hover:shadow-lg transition-shadow duration-200"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginDialog
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />

      <SignupDialog
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </nav>
  );
};

export default Navigation;
