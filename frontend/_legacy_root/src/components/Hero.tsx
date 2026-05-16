import React from 'react';
import { ChevronRight, Zap, Shield, Truck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Limited Time Offer
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Discover Amazing
              <span className="block bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Products
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Shop millions of products at unbeatable prices. Free shipping, easy returns, and satisfaction guaranteed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="group bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
                Shop Now
                <ChevronRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-medium hover:border-orange-500 hover:text-orange-500 transition-colors">
                Explore Categories
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center lg:items-start">
                <div className="bg-orange-100 p-2 rounded-lg mb-2 lg:mb-0 lg:mr-3">
                  <Truck className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders $50+</p>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row items-center lg:items-start">
                <div className="bg-teal-100 p-2 rounded-lg mb-2 lg:mb-0 lg:mr-3">
                  <Shield className="h-5 w-5 text-teal-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-600">100% Protected</p>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row items-center lg:items-start">
                <div className="bg-purple-100 p-2 rounded-lg mb-2 lg:mb-0 lg:mr-3">
                  <ChevronRight className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-day policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Featured Product Preview */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="absolute top-4 right-4">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Hot Deal
                </span>
              </div>
              
              <img
                src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg"
                alt="Featured Product"
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                iPhone 15 Pro Max
              </h3>
              <p className="text-gray-600 mb-4">
                The most advanced iPhone ever
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-orange-500">$1,299</span>
                  <span className="text-lg text-gray-400 line-through">$1,399</span>
                </div>
                <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-shadow">
                  Add to Cart
                </button>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-medium animate-bounce">
              💥 50% OFF
            </div>
            <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
              ✓ In Stock
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};