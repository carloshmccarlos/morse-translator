/**
 * SEO asset generator — fixes og-image.png and derives the favicon/PWA
 * icon set from public/favicon.png.
 *
 * Run: node scripts/generate-seo-assets.mjs
 * Requires sharp (uses project node_modules if present, else the isolated
 * tool dir at C:/Users/HMC/.workbuddy/tmp/sharp-tools).
 */
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

const projectRequire = createRequire(new URL("./", import.meta.url));
let sharp;
try {
  sharp = projectRequire("sharp");
} catch {
  const req = createRequire(
    path.join("C:/Users/HMC/.workbuddy/tmp/sharp-tools/package.json")
  );
  sharp = req("sharp");
}

const PUBLIC = path.resolve("public");
const ICONS = path.join(PUBLIC, "icons");

/** Build a modern ICO container (PNG-embedded entries: 16/32/48). */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;
  entries.forEach((img, i) => {
    const b = dir.subarray(i * 16, (i + 1) * 16);
    b[0] = img.size >= 256 ? 0 : img.size;
    b[1] = img.size >= 256 ? 0 : img.size;
    b[2] = 0;
    b[3] = 0;
    b.writeUInt16LE(1, 4); // color planes
    b.writeUInt16LE(32, 6); // bits per pixel
    b.writeUInt32LE(img.data.length, 8);
    b.writeUInt32LE(offset, 12);
    offset += img.data.length;
  });
  return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

fs.mkdirSync(ICONS, { recursive: true });

// 1) Fix og-image.png — the existing file is actually a JPEG with a .png
//    extension, which breaks social previews. Re-encode as a true PNG.
const ogSrc = fs.readFileSync(path.join(PUBLIC, "og-image.png"));
const ogMeta = await sharp(ogSrc).metadata();
console.log(`og-image.png: detected ${ogMeta.format} ${ogMeta.width}x${ogMeta.height}`);
const ogPng = await sharp(ogSrc)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .png()
  .toBuffer();
fs.writeFileSync(path.join(PUBLIC, "og-image.png"), ogPng);
console.log(`og-image.png fixed -> true PNG 1200x630 (${ogPng.length} bytes)`);

// 2) Derive favicon + PWA icons from favicon.png (640x640).
const favicon = fs.readFileSync(path.join(PUBLIC, "favicon.png"));

const fav16 = await sharp(favicon).resize(16, 16).png().toBuffer();
const fav32 = await sharp(favicon).resize(32, 32).png().toBuffer();
const fav48 = await sharp(favicon).resize(48, 48).png().toBuffer();
fs.writeFileSync(path.join(PUBLIC, "favicon-16x16.png"), fav16);
fs.writeFileSync(path.join(PUBLIC, "favicon-32x32.png"), fav32);
fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), buildIco([
  { size: 16, data: fav16 },
  { size: 32, data: fav32 },
  { size: 48, data: fav48 },
]));
console.log("favicon-16x16.png / favicon-32x32.png / favicon.ico written");

const apple180 = await sharp(favicon).resize(180, 180).png().toBuffer();
const icon192 = await sharp(favicon).resize(192, 192).png().toBuffer();
const icon512 = await sharp(favicon).resize(512, 512).png().toBuffer();
fs.writeFileSync(path.join(ICONS, "apple-touch-icon.png"), apple180);
fs.writeFileSync(path.join(ICONS, "icon-192.png"), icon192);
fs.writeFileSync(path.join(ICONS, "icon-512.png"), icon512);
console.log("icons/apple-touch-icon.png (180) / icon-192.png / icon-512.png written");

console.log("All SEO assets generated.");
