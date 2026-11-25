
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const input = "public/favicon.png";
const output = "public";

async function generateIcons() {
  if (!fs.existsSync(input)) {
    throw new Error("favicon.png not found!");
  }

  const iconsDir = path.join(output, "icons");
  fs.mkdirSync(iconsDir, { recursive: true });

  const icons = [
    { name: "favicon-16.png", size: 16, folder: output },
    { name: "favicon-32.png", size: 32, folder: output },
    { name: "apple-touch-icon.png", size: 180, folder: output },
    { name: "icon-192.png", size: 192, folder: iconsDir },
    { name: "icon-512.png", size: 512, folder: iconsDir }
  ];

  for (const icon of icons) {
    await sharp(input)
      .resize(icon.size, icon.size, {
        fit: "contain",
        kernel: sharp.kernel.lanczos3,
        withoutEnlargement: true
      })
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true
      })
      .toFile(path.join(icon.folder, icon.name));

    console.log("Generated:", icon.name);
  }

  // Maskable icon with safe area
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: "#fff1f7"
    }
  })
    .composite([
      {
        input: await sharp(input)
          .resize(410, 410, {
            fit: "contain",
            kernel: sharp.kernel.lanczos3
          })
          .png()
          .toBuffer(),
        gravity: "centre"
      }
    ])
    .png()
    .toFile(path.join(iconsDir, "icon-512-maskable.png"));

  console.log("Generated: icon-512-maskable.png");

  console.log("All icons generated successfully!");
}

generateIcons().catch(console.error);
