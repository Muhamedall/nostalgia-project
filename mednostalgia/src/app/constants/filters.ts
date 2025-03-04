export const SIZES = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "18 MONTHS",
    "2 YEARS",
    "2-3 YEARS",
    "4 YEARS",
    "6 YEARS",
    "7-8 YEARS",
    "10 YEARS",
    "20"
  ] as const;
  
  export const GENRES = ["Mens", "Womens"] as const;
  
  export const CATEGORIES = [
    "SHIRT",
    "VEST",
    "ACCESSORIES",
    "ALL-IN-ONES",
    "BACKPACKS",
    "BAGS",
    "BELTS",
    "BLOUSES & TOPS",
    "CHRISTMAS",
    "COATS",
    "DRESSES",
    "DUNGAREES",
    "GIFT CARD",
    "HEADWEAR",
    "JACKET & DRESS SET",
    "JACKET & SKIRT SET",
    "JACKET & TROUSER SET",
    "JACKET ",
    
    "JEANS",
    "JUMPSUITS",
    "KIDS",
    "KIMONOS",
    "KNITS",
    "LINGERIE",
    "PLAYSUITS"
  ] as const;
  
  export const MARKS = [
    "Adidas",
    "Arrow",
    "Brooks Brothers",
    "Calvin Klein",
    "Carhartt",
    "Champion",
    "Coach",
    "Columbia",
    "Converse",
    "Dickies",
    "Disney",
    "DKNY",
    "Dockers",
    "Dr. Marten",
    "Fila",
    "Guess",
    "Harley Davidson",
    "L.L Bean",
    "Lacoste",
    "Lee",
    "Levi's",
    "London Fog",
    "Nike",
    "The North Face",
    "Pendleton",
    "Puma",
    "Ralph Lauren",
    "Reebok",
    "Russell Athletic",
    "Tommy Hilfiger",
    "Woolrich",
    "Wrangler"
  ] as const;

  export const COLORS = [
    "Black",
    "White",
    "Grey",
    "Navy",
    "Blue",
  
    "Red",

    "Pink",
    "Orange",
    "Yellow",
    "Beige",
    "Brown",
    "Green",
    "Olive",
    "Purple",
    "Lavender",
    "Teal",


 
    "Multicolor",


    "Denim"
  ] as const;
  
  export type Size = typeof SIZES[number];
  export type Genre = typeof GENRES[number];
  export type Category = typeof CATEGORIES[number];
  export type Mark = typeof MARKS[number];
  export type Color = typeof COLORS[number];