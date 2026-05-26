"use client";

import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Fatima R.",
    location: "Dhaka",
    rating: 5,
    text: "My daughter absolutely LOVES the pink Sweet Heart teddy! The quality is amazing — the stitching is so neat and the fur is super soft. Arrived within 2 days. Will definitely order more!",
    product: "Sweet Heart Teddy — Pink",
    avatar: "F",
  },
  {
    id: 2,
    name: "Arif K.",
    location: "Chittagong",
    rating: 5,
    text: "Ordered the Big Cuddle Bear as a birthday gift for my wife. She was so happy! It's much bigger and fluffier than expected. Great value for the price.",
    product: "Big Cuddle Bear — Gold",
    avatar: "A",
  },
  {
    id: 3,
    name: "Nusrat J.",
    location: "Sylhet",
    rating: 5,
    text: "The Pikachu plush is so adorable! My son carries it everywhere now. Colors are vibrant and the material feels premium. RiseUpZone never disappoints! ⭐",
    product: "Pikachu Plush",
    avatar: "N",
  },
  {
    id: 4,
    name: "Tanvir H.",
    location: "Rajshahi",
    rating: 5,
    text: "Bought the red Sweet Heart teddy for Valentine's Day. My girlfriend cried tears of joy! The heart pillow detail is so cute. Highly recommend this store.",
    product: "Sweet Heart Teddy — Red",
    avatar: "T",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-warm-500 font-semibold text-sm tracking-wider uppercase mb-3 font-[var(--font-heading)]">
            Happy Customers
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-navy">
            What Our Customers{" "}
            <span className="gradient-text">Say</span>
          </h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className="fill-warm-400 text-warm-400"
              />
            ))}
            <span className="ml-2 text-sm font-medium text-navy-light/60">
              4.9/5 from 200+ reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-6 border border-warm-100 hover:border-warm-200 hover:shadow-lg hover:shadow-warm-100/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warm-300 to-warm-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 font-[var(--font-heading)]">
                  {review.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy text-sm">
                        {review.name}
                      </p>
                      <p className="text-xs text-navy-light/50">
                        {review.location}
                      </p>
                    </div>
                    <Quote
                      size={24}
                      className="text-warm-200 group-hover:text-warm-300 transition-colors flex-shrink-0"
                    />
                  </div>
                  <div className="flex items-center gap-0.5 mt-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className="fill-warm-400 text-warm-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-navy-light/70 mt-3 leading-relaxed">
                    {review.text}
                  </p>
                  <p className="text-xs font-medium text-warm-500 mt-3">
                    Purchased: {review.product}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
