// Cloudinary URL builder - no SDK import needed for URL generation

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  apiKey: process.env.CLOUDINARY_API_KEY || "",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "",
};

export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
): string {
  const { width, height, quality = 80, format = "auto" } = options;
  const transforms: string[] = [`q_${quality}`, `f_${format}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push("c_fill");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicId}`;
}

export function getProductImageUrl(publicId: string, size: "thumbnail" | "card" | "detail" | "zoom" = "card"): string {
  const sizeMap = {
    thumbnail: { width: 100, height: 100 },
    card: { width: 400, height: 500 },
    detail: { width: 800, height: 1000 },
    zoom: { width: 1600, height: 2000 },
  };
  return getCloudinaryUrl(publicId, sizeMap[size]);
}
