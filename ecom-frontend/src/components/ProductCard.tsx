"use client";

import Image from "next/image";
import { Star, ShoppingBag, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface Variant {
  id: string;
  name: string;
  color: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  variants: Variant[];
  features: string[];
}

interface ProductCardProps {
  product: Product;
  selectedVariant: string;
  onVariantChange: (variantId: string) => void;
  onAddToCart: (productId: string, variantId: string) => void;
  reverse?: boolean;
}

export default function ProductCard({
  product,
  selectedVariant,
  onVariantChange,
  onAddToCart,
  reverse = false,
}: ProductCardProps) {
  const { t, formatNumber } = useLanguage();

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariant) || product.variants[0];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className={`flex flex-col ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center gap-8 lg:gap-16`}
    >
      {/* Product Image */}
      <div className="relative w-full lg:w-1/2 group">
        <div className="relative aspect-square max-w-lg mx-auto bg-[#FFFBF5] rounded-3xl border border-warm-200/50 p-6 shadow-sm overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:shadow-md">
          {/* Glow background */}
          <div
            className="absolute inset-8 rounded-full blur-3xl opacity-25 transition-colors duration-500 pointer-events-none"
            style={{ backgroundColor: activeVariant.color }}
          />
          <div className="relative w-full h-full z-10">
            <Image
              src={activeVariant.image}
              alt={`${product.name} - ${activeVariant.name}`}
              fill
              className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105 p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          {/* Floating Badge */}
          {product.badge && (
            <div className="absolute top-5 left-5 bg-gradient-to-r from-warm-500 to-warm-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-warm-400/30 flex items-center gap-1.5 z-20">
              <Sparkles size={12} />
              {product.badge}
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-5 right-5 bg-rose text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20">
              -{formatNumber(discount)}%
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="w-full lg:w-1/2 space-y-6">
        {/* Title & Rating */}
        <div>
          <p className="text-warm-500 font-semibold text-sm tracking-wider uppercase mb-2 font-[var(--font-heading)]">
            {product.tagline}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-navy leading-tight">
            {product.name}
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-warm-400 text-warm-400"
                      : "fill-warm-200 text-warm-200"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-navy-light/60">
              {formatNumber(product.rating)} (
              {t.showcase.reviewsCount.replace("{count}", formatNumber(product.reviewCount))}
              )
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-navy-light/70 leading-relaxed">{product.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {product.features.map((feature) => (
            <span
              key={feature}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-warm-100 text-warm-600 border border-warm-200/50"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Variant Selector */}
        <div>
          <p className="text-sm font-semibold text-navy mb-3">
            {t.showcase.colorLabel}{" "}
            <span className="font-normal text-navy-light/70">
              {activeVariant.name}
            </span>
          </p>
          <div className="flex items-center gap-3">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => onVariantChange(variant.id)}
                className={`variant-swatch w-10 h-10 rounded-full border-2 transition-all ${
                  selectedVariant === variant.id
                    ? "active border-warm-500"
                    : "border-gray-200 hover:border-warm-300"
                }`}
                style={{ backgroundColor: variant.color }}
                title={variant.name}
                aria-label={`Select ${variant.name} color`}
              />
            ))}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-end gap-4">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-navy font-[var(--font-heading)]">
                ৳{formatNumber(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-navy-light/40 line-through">
                  ৳{formatNumber(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-green-600 font-medium mt-1">
              {t.showcase.inStock}
            </p>
          </div>
        </div>

        <button
          onClick={() => onAddToCart(product.id, activeVariant.id)}
          className="btn-shine w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-warm-500 to-warm-600 text-white font-semibold rounded-2xl shadow-lg shadow-warm-400/30 hover:shadow-warm-400/50 hover:from-warm-600 hover:to-warm-500 transition-all duration-300 flex items-center justify-center gap-3 text-base cursor-pointer"
          id={`add-to-cart-${product.id}`}
        >
          <ShoppingBag size={20} />
          {t.showcase.addToBag}
        </button>
      </div>
    </div>
  );
}
