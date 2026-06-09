/* ============================================================
 * build-assets.js — image asset pipeline for Hotel Touring Livigno
 * ------------------------------------------------------------
 * 1. GALLERY: web-optimises every source image listed below into
 *    assets/img/gallery/, then writes gallery/manifest.json by
 *    scanning the folder. The site reads that manifest, so to add a
 *    new gallery photo: drop a .jpg/.png into assets/img/gallery/
 *    (or add it to GALLERY_SOURCES and re-run) then re-run this script.
 * 2. BRAND: derives the favicon / apple-touch / header-logo set from
 *    "stella alpina.png" (the edelweiss mark).
 *
 * Run:  node scripts/build-assets.js
 * ============================================================ */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMG = path.join(__dirname, "..", "assets", "img");
const GALLERY = path.join(IMG, "gallery");

/* Source photos shown in the "Galleria & ospiti" slideshow.
 * Each gets resized into assets/img/gallery/ at web size.
 * `alt` carries the localized-neutral description used in the manifest. */
const GALLERY_SOURCES = [
  { src: "touring-hotel.jpg",            alt: "La valle di Livigno" },
  { src: "TOURING_PISCINA_0168.jpg",     alt: "Piscina coperta dell'hotel" },
  { src: "5-ristorante.jpg",             alt: "Sala ristorante" },
  { src: "BagnoTurco.jpg",               alt: "Bagno turco" },
  { src: "slider_hotel-1.jpg",           alt: "Esterno dell'hotel in estate" },
  { src: "TOURING_GIOCHI_043.jpg",       alt: "Sala giochi per bambini" },
  { src: "family-hotel-livigno.jpg",     alt: "Famiglia in camera" },
  { src: "touring-winter.jpg",           alt: "Le montagne di Livigno in inverno" },
  { src: "box-3.jpg",                    alt: "Camera Superior" },
  { src: "family-hotel-livigno-1.jpg",   alt: "Camera Lupigno" },
];

const MAX_W = 1600;   // gallery display never exceeds this on screen
const Q = 80;

async function buildGallery() {
  fs.mkdirSync(GALLERY, { recursive: true });
  for (const { src } of GALLERY_SOURCES) {
    const from = path.join(IMG, src);
    if (!fs.existsSync(from)) { console.warn("  ! missing source:", src); continue; }
    const out = path.join(GALLERY, src.replace(/\.png$/i, ".jpg"));
    await sharp(from)
      .resize({ width: MAX_W, withoutEnlargement: true })
      .jpeg({ quality: Q, mozjpeg: true })
      .toFile(out);
    const kb = (fs.statSync(out).size / 1024).toFixed(0);
    console.log(`  gallery ✓ ${path.basename(out)} (${kb} KB)`);
  }
  writeManifest();
}

/* Scan the gallery folder and emit manifest.json. Any image present in
 * the folder is included, so new drop-ins are picked up automatically. */
function writeManifest() {
  const altMap = Object.fromEntries(
    GALLERY_SOURCES.map(g => [g.src.replace(/\.png$/i, ".jpg"), g.alt])
  );
  const files = fs.readdirSync(GALLERY)
    .filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort((a, b) => {
      // keep the curated order first, then any new files alphabetically
      const ia = GALLERY_SOURCES.findIndex(g => g.src.replace(/\.png$/i, ".jpg") === a);
      const ib = GALLERY_SOURCES.findIndex(g => g.src.replace(/\.png$/i, ".jpg") === b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });
  const manifest = files.map(f => ({
    src: "assets/img/gallery/" + f,
    alt: altMap[f] || prettify(f),
  }));
  fs.writeFileSync(
    path.join(GALLERY, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );
  console.log(`  manifest ✓ ${manifest.length} images`);
}

function prettify(file) {
  return file.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim();
}

/* Brand mark → favicon / apple-touch / header logo set. */
async function buildBrand() {
  const src = path.join(IMG, "stella alpina.png");
  if (!fs.existsSync(src)) { console.warn("  ! missing stella alpina.png"); return; }
  const png = (size, name) =>
    sharp(src).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 }).toFile(path.join(IMG, name))
      .then(() => console.log(`  brand ✓ ${name} (${size}px)`));
  await png(16, "favicon-16.png");
  await png(32, "favicon-32.png");
  await png(48, "favicon-48.png");
  await png(180, "apple-touch-icon.png");
  await png(192, "icon-192.png");
  await png(512, "icon-512.png");
  // crisp transparent header logo (~40px display, 3x for retina)
  await png(120, "stella-alpina-logo.png");
}

(async () => {
  console.log("Gallery:");
  await buildGallery();
  console.log("Brand:");
  await buildBrand();
  console.log("Done.");
})().catch(e => { console.error(e); process.exit(1); });
