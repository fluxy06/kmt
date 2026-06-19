export function optimizeCloudinaryUrl(url: string, width?: number): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const parts = ["q_auto", "f_auto"];
  if (width) parts.push(`w_${width}`);
  return url.replace("/upload/", `/upload/${parts.join(",")}/`);
}
