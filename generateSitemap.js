import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Your base URL (change this to your actual domain)
const BASE_URL = "https://tebakkabupaten.pages.dev";

const indonesiaData = JSON.parse(readFileSync(join(__dirname, "src/data/indonesia.json"), "utf8"));

const provinces = indonesiaData.features.map((feature) => feature.properties.name.replace(/ /g, "_"));

// Generate today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];

// Generate sitemap XML content
const generateSitemap = () => {
  let urls = `<url>
    <loc>${BASE_URL}/</loc>
    <priority>1.0</priority>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
  </url>`;

  provinces.forEach((province) => {
    urls += `
    <url>
      <loc>${BASE_URL}/${province}</loc>
      <priority>0.8</priority>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
    </url>`;
  });

  // Add standalone game modes
  urls += `
    <url>
      <loc>${BASE_URL}/survival</loc>
      <priority>0.7</priority>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
    </url>`;

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${urls}
  </urlset>`;

  writeFileSync(join(__dirname, "public", "sitemap.xml"), sitemapContent);
  console.log("✅ Sitemap generated successfully!");
};

// Run the function
generateSitemap();
