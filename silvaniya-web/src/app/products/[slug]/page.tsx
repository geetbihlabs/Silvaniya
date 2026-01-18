'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heart, Minus, Plus, ShoppingBag, Truck, Shield, RotateCcw, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  weight?: number;
  stock: number;
  attributes: { type: string; value: string }[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc?: string;
  description?: string;
  basePrice: number;
  compareAtPrice?: number;
  purity: string;
  images: { id: string; url: string; alt?: string; isPrimary: boolean }[];
  variants: Variant[];
  categories: { id: string; name: string; slug: string }[];
  reviews: { id: string; rating: number; title?: string; comment?: string; userName: string; createdAt: string }[];
  avgRating: number;
  reviewCount: number;
  relatedProducts: { id: string; name: string; slug: string; basePrice: number; primaryImage?: { url: string } }[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      setProduct(data.data);
      if (data.data.variants?.length > 0) {
        setSelectedVariant(data.data.variants[0]);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link href="/products" className="text-primary-600 hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.basePrice;
  const comparePrice = selectedVariant?.comparePrice || product.compareAtPrice;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : true;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-700">Products</Link>
            {product.categories[0] && (
              <>
                <span>/</span>
                <Link href={`/category/${product.categories[0].slug}`} className="hover:text-gray-700">
                  {product.categories[0].name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product.avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.avgRating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(currentPrice)}</span>
                {comparePrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">{formatPrice(comparePrice)}</span>
                    <span className="px-2 py-1 text-sm font-semibold bg-red-100 text-red-600 rounded">
                      {Math.round((1 - currentPrice / comparePrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="text-gray-600 mb-6">{product.shortDesc}</p>
            )}

            {/* Purity Badge */}
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">
                {product.purity} Sterling Silver | BIS Hallmarked
              </span>
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Select Variant</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border rounded-lg text-sm ${
                        selectedVariant?.id === variant.id
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={variant.stock === 0}
                    >
                      {variant.name}
                      {variant.stock === 0 && ' (Out of Stock)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border rounded-lg hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border rounded-lg hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="h-5 w-5" />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="p-3 border rounded-lg hover:bg-gray-50">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-primary-600 mb-1" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto text-primary-600 mb-1" />
                <p className="text-xs text-gray-600">3-Day Returns</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto text-primary-600 mb-1" />
                <p className="text-xs text-gray-600">Certified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
            <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-gray-900">{review.userName}</span>
                  </div>
                  {review.title && <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>}
                  {review.comment && <p className="text-gray-600">{review.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {product.relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.relatedProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.slug}`} className="group">
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                    {item.primaryImage ? (
                      <img
                        src={item.primaryImage.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="font-semibold text-gray-900 mt-1">{formatPrice(item.basePrice)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
