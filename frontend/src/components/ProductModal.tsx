import React, { useState } from 'react';
import { X, Star, Heart, ShoppingCart, ChevronLeft, ChevronRight, Shield, Truck, RotateCcw, Info, MessageCircle, Award, Package } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !product) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
  };

  const tabs = [
    { id: 'details', label: 'รายละเอียด', icon: Info },
    { id: 'specifications', label: 'คุณสมบัติ', icon: Package },
    { id: 'reviews', label: 'รีวิว', icon: MessageCircle },
    { id: 'warranty', label: 'การรับประกัน', icon: Award }
  ];

  const mockReviews = [
    {
      id: 1,
      user: 'สมชาย ใจดี',
      rating: 5,
      date: '2024-01-15',
      comment: 'สินค้าดีมาก คุณภาพเยี่ยม ส่งเร็ว บรรจุภัณฑ์ดี แนะนำเลยครับ',
      helpful: 12
    },
    {
      id: 2,
      user: 'มาลี สวยงาม',
      rating: 4,
      date: '2024-01-10',
      comment: 'ใช้งานได้ดี ราคาคุ้มค่า แต่การจัดส่งช้าไปหน่อย',
      helpful: 8
    },
    {
      id: 3,
      user: 'วิชัย เก่งมาก',
      rating: 5,
      date: '2024-01-08',
      comment: 'ประทับใจมาก สินค้าตรงตามที่โฆษณา จะซื้อเพิ่มอีก',
      helpful: 15
    }
  ];

  const specifications = {
    'ข้อมูลทั่วไป': {
      'ยี่ห้อ': 'Apple',
      'รุ่น': 'iPhone 15 Pro Max',
      'สี': 'Natural Titanium',
      'น้ำหนัก': '221 กรัม',
      'ขนาด': '159.9 x 76.7 x 8.25 มม.'
    },
    'จอแสดงผล': {
      'ขนาดหน้าจอ': '6.7 นิ้ว',
      'ความละเอียด': '2796 x 1290 พิกเซล',
      'ประเภทจอ': 'Super Retina XDR OLED',
      'ความสว่าง': '2000 nits'
    },
    'ประสิทธิภาพ': {
      'ชิปประมวลผล': 'A17 Pro',
      'หน่วยความจำ': '256GB',
      'RAM': '8GB',
      'ระบบปฏิบัติการ': 'iOS 17'
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-2xl transform transition-all max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors shadow-lg"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors shadow-lg"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {product.discount && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                      ลด {product.discount}%
                    </span>
                  )}
                  {product.isNew && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                      สินค้าใหม่
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                      แนะนำ
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating} ({product.reviews.toLocaleString()} รีวิว)
                  </span>
                  <span className="text-green-600 font-medium">มีสินค้าพร้อมส่ง</span>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-4xl font-bold text-orange-500">
                    ฿{(product.price * 35).toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-2xl text-gray-400 line-through">
                      ฿{(product.originalPrice * 35).toLocaleString()}
                    </span>
                  )}
                  {product.discount && (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      ประหยัด {product.discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 pb-6 border-b">
                <label className="font-medium text-gray-900">จำนวน:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">เหลือ 50 ชิ้น</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>เพิ่มลงตะกร้า</span>
                  </button>
                  
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isInWishlist
                        ? 'border-pink-500 bg-pink-50 text-pink-500'
                        : 'border-gray-300 text-gray-600 hover:border-pink-500 hover:text-pink-500'
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <button className="w-full bg-orange-600 text-white py-4 rounded-xl font-medium hover:bg-orange-700 transition-colors">
                  ซื้อทันที
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-2">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">ส่งฟรี</p>
                  <p className="text-xs text-gray-600">เมื่อซื้อครบ ฿1,500</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">รับประกัน 2 ปี</p>
                  <p className="text-xs text-gray-600">ครอบคลุมเต็มที่</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-2">
                    <RotateCcw className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">คืนได้ 30 วัน</p>
                  <p className="text-xs text-gray-600">เงื่อนไขง่าย</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="border-t bg-gray-50">
            <div className="max-w-6xl mx-auto px-8">
              {/* Tab Navigation */}
              <div className="flex space-x-8 border-b border-gray-200">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="py-8">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">รายละเอียดสินค้า</h3>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {product.description} สินค้านี้ได้รับการออกแบบมาอย่างพิถีพิถันเพื่อให้คุณได้รับประสบการณ์การใช้งานที่ดีที่สุด 
                        ด้วยเทคโนโลยีล่าสุดและคุณภาพระดับพรีเมียม
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">คุณสมบัติเด่น</h4>
                      <ul className="space-y-3">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-blue-900 mb-2">ข้อมูลสำคัญ</h4>
                      <ul className="text-blue-800 space-y-1">
                        <li>• สินค้าของแท้ 100% พร้อมใบรับประกัน</li>
                        <li>• จัดส่งโดย Lazada Express</li>
                        <li>• รองรับการชำระเงินทุกรูปแบบ</li>
                        <li>• บริการหลังการขายครบครัน</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">ข้อมูลจำเพาะ</h3>
                    {Object.entries(specifications).map(([category, specs]) => (
                      <div key={category} className="bg-white rounded-xl p-6 shadow-sm">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                          {category}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <span className="text-gray-600 font-medium">{key}</span>
                              <span className="text-gray-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">รีวิวจากลูกค้า</h3>
                      <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                        เขียนรีวิว
                      </button>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center space-x-6 mb-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-orange-500">{product.rating}</div>
                          <div className="flex items-center justify-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {product.reviews.toLocaleString()} รีวิว
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center space-x-2 mb-1">
                              <span className="text-sm w-8">{rating}</span>
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 h-2 rounded-full" 
                                  style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '7%' : rating === 2 ? '2%' : '1%'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {mockReviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                {review.user.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{review.user}</div>
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          
                          <div className="flex items-center justify-between">
                            <button className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                              👍 มีประโยชน์ ({review.helpful})
                            </button>
                            <button className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                              ตอบกลับ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'warranty' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">การรับประกันและบริการ</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Shield className="h-6 w-6 text-green-600" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">การรับประกันสินค้า</h4>
                        </div>
                        <ul className="space-y-2 text-gray-700">
                          <li>• รับประกันสินค้า 2 ปีเต็ม</li>
                          <li>• ครอบคลุมข้อบกพร่องจากการผลิต</li>
                          <li>• บริการซ่อมฟรีในช่วงรับประกัน</li>
                          <li>• เปลี่ยนเครื่องใหม่หากซ่อมไม่ได้</li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <RotateCcw className="h-6 w-6 text-blue-600" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">นโยบายการคืนสินค้า</h4>
                        </div>
                        <ul className="space-y-2 text-gray-700">
                          <li>• คืนสินค้าได้ภายใน 30 วัน</li>
                          <li>• สินค้าต้องอยู่ในสภาพเดิม</li>
                          <li>• รับประกันเงินคืน 100%</li>
                          <li>• ไม่เสียค่าใช้จ่ายในการคืนสินค้า</li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Truck className="h-6 w-6 text-purple-600" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">การจัดส่ง</h4>
                        </div>
                        <ul className="space-y-2 text-gray-700">
                          <li>• จัดส่งฟรีทั่วประเทศ</li>
                          <li>• ส่งภายใน 1-2 วันทำการ</li>
                          <li>• ติดตามพัสดุแบบเรียลไทม์</li>
                          <li>• บริการจัดส่งด่วนพิเศษ</li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <MessageCircle className="h-6 w-6 text-orange-600" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">บริการลูกค้า</h4>
                        </div>
                        <ul className="space-y-2 text-gray-700">
                          <li>• สายด่วน 24/7</li>
                          <li>• แชทสดกับเจ้าหน้าที่</li>
                          <li>• ตอบคำถามภายใน 1 ชั่วโมง</li>
                          <li>• ทีมงานมืออาชีพ</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">ติดต่อเรา</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl mb-2">📞</div>
                          <div className="font-medium">โทรศัพท์</div>
                          <div className="text-sm text-gray-600">02-123-4567</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-2">💬</div>
                          <div className="font-medium">แชทสด</div>
                          <div className="text-sm text-gray-600">24 ชั่วโมง</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-2">📧</div>
                          <div className="font-medium">อีเมล</div>
                          <div className="text-sm text-gray-600">support@lazada.co.th</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
