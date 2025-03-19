"use client";

import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import Image from "next/image";

// Function to convert title to slug format
const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ProductPage() {
  const params = useParams(); // ✅ Get slug from URL
  const products = useAppSelector((state: RootState) => state.products.items);

  // Find the product using slug
  const product = products.find((p) => generateSlug(p.title) === params.slug);

  if (!product) return <h1>Product not found</h1>;

  return (
    <div className="flex flex-row mt-5">
      <Image
                          src={product.main_image}
                          alt={product.title}
                          width={100}
                          height={100}
                          className={`w-[50%] h-[50%] object-contain  `}
                        />
       
      <h1>{product.title}</h1>
      <p>Price: {product.price}</p>
      
    </div>
  );
}
