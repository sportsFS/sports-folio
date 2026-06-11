import fs from "fs";

const data = fs.readFileSync("convex/productData.ts", "utf-8");
const map = JSON.parse(fs.readFileSync("scripts/image-map.json", "utf-8"));

let result = data;

for (const [name, imgPath] of Object.entries(map)) {
  // Escape special regex chars in name
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Match the product entry up to image: IMG
  // The pattern: { name: "EXACT_NAME", ...(anything but {})... image: IMG
  const regex = new RegExp(`(\\{\\s*name:\\s*"${escaped}"[^}]*?)(image:\\s*)IMG\\b`);
  const match = result.match(regex);
  if (match) {
    const fullMatch = match[0];
    const replacement = match[1] + match[2] + `"${imgPath}"`;
    result = result.replace(fullMatch, replacement);
  } else {
    console.warn(`Could not find product: "${name}"`);
  }
}

// Remove IMG constant if no longer used
const imgConst = result.match(/^const (\w+) = "\/images\/products\/product\.jpg";$/m);
if (imgConst) {
  const varName = imgConst[1];
  if (!result.includes(varName)) {
    result = result.replace(new RegExp(`^const ${varName} = "[^"]+";\n`, "m"), "");
  }
}

fs.writeFileSync("convex/productData.ts", result);
console.log("✅ Updated productData.ts with all image paths");
