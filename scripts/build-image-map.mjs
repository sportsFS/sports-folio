import fs from "fs";
import path from "path";

const productsDir = path.resolve("public/images/products");
const files = new Set(fs.readdirSync(productsDir).filter(f => f.endsWith(".webp")));

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const hardcodedMap = {
  // Bats
  "MRF CHASE MASTER": "bat-english-willow-mrf-chase-master.webp",
  "MRF GOLD": "bat-english-willow-mrf-gold.webp",
  "MRF GRAND EDITION": "bat-english-willow-mrf-grand-edition.webp",
  "MRF GRAND 2": "bat-english-willow-mrf-grand-2.webp",
  "MASTER 9000 (SS)": "bat-english-willow-master-9000.webp",
  "MASTER 2000 (SS)": "bat-english-willow-master-2000.webp",
  "THALA 20 (SS)": "bat-english-willow-thala-20.webp",
  "ORANGE (SS)": "bat-english-willow-orange.webp",
  "POWERPLUS (SS)": "bat-english-willow-powerplus.webp",
  "DEVIL RED (SS)": "bat-english-willow-devil-red.webp",
  "RICHARD (SS)": "bat-english-willow-richard.webp",
  "WORLD CUP EDITION (SS)": "bat-english-willow-world-cup-edition.webp",
  "FIRE (SS)": "bat-english-willow-fire.webp",
  "VERTU 15 (SS)": "bat-english-willow-vertu-15.webp",
  "TON LEGEND 20 (SS)": "bat-english-willow-ton-legend-20.webp",
  "PRESALM (SS)": "bat-english-willow-presalm.webp",
  "THUNDER (SS)": "bat-english-willow-thunder.webp",
  "SKY 30 21 (SS)": "bat-english-willow-sky-30-21.webp",
  "SG SUNNY TONNY ARC 4G": "bat-english-willow-sg-sunny-tonny-arc-4g.webp",
  "SG TRIPLE CROWN EXTREME": "bat-english-willow-sg-triple-crown-extreme.webp",
  "SG SAVAGE EXTREME": "bat-english-willow-sg-savage-extreme.webp",
  "KOOKABURRA GHOST PRO 1.1": "bat-english-willow-kookaburra-ghost-pro-11.webp",
  "REEBOK SUPER DRIVE PRO": "bat-english-willow-reebok-super-drive-pro.webp",
  "SS-GT10": "bat-english-willow-ss-gt10.webp",
  "BAS CLUB": "bat-english-willow-bas-club.webp",
  "DSC SPLIT 222": "bat-english-willow-dsc-split-222.webp",
  "DSC-BL 200": "bat-english-willow-dsc-bl-200.webp",
  "DSC-XLITE 5.0": "bat-english-willow-dsc-xlite-50.webp",
  "BDM JAI HO": "bat-english-willow-bdm-jai-ho.webp",
  "GM HYPR 444": "bat-english-willow-gm-hypr-444.webp",
  "GM DIAMOND 444": "bat-english-willow-gm-diamond-444.webp",
  "GM BRAVA 444": "bat-english-willow-gm-brava-444.webp",
  "GRAY NICHOLLS COBRA EDITION 5": "bat-english-willow-gray-nicholls-cobra-edition-5.webp",
  "NEW BALANCE TC PRO": "bat-english-willow-new-balance-tc-pro.webp",
  "AZTRAL HARROW": "bat-english-willow-aztral-harrow.webp",
  "AZTRAL SIZE 6": "bat-english-willow-aztral-size-6.webp",
  "AZTRAL SIZE 5": "bat-english-willow-aztral-size-5.webp",
  "AZTRAL SIZE 4": "bat-english-willow-aztral-size-4.webp",
  "AZTRAL SIZE 3": "bat-english-willow-aztral-size-3.webp",
  "MRF MASTER": "bat-kashmir-willow-mrf-master.webp",
  "RNS KIDS BAT KASHMIR WILLOW": "bat-kashmir-willow-rns-kids-bat-kashmir-willow.webp",
  "CA COCONUT BAT": "bat-tapeball-tennis-ca-coconut-bat.webp",
  "CA TAPE BAT": "bat-tapeball-tennis-ca-tape-bat.webp",
  "AS KERALA SCOOP BATS": "bat-tapeball-tennis-as-kerala-scoop-bats.webp",
  "MIDWICKET GALAXIAN SCOOP BATS": "bat-tapeball-tennis-midwicket-galaxian-scoop-bats.webp",
  "7F SCOOP BATS": "bat-tapeball-tennis-7f-scoop-bats.webp",
  "FIPCO PLASTIC BAT": "bat-tapeball-tennis-fipco-plastic-bat.webp",
  // Protection
  "ELBOW GUARD MATCH": "protective-upper-body-elbow-guard-match.webp",
  "ELBOW GUARD TON 1.0 31": "protective-upper-body-elbow-guard-ton-10-31.webp",
  "ELBOW GUARD MILLENIUM": "protective-upper-body-elbow-guard-millenium.webp",
  "MOONWALKR CHEST GUARD": "protective-upper-body-moonwalkr-chest-guard.webp",
  "CHEST GUARD": "protective-upper-body-chest-guard.webp",
  "TRUNK SUPPORTER": "protective-lower-body-trunk-supporter.webp",
  "ABDO GUARD FEMALE": "protective-lower-body-abdo-guard-female.webp",
  "ABDO GUARD MALE": "protective-lower-body-abdo-guard-male.webp",
  "ABDO GUARD": "protective-lower-body-abdo-guard.webp",
  "SPORTSFOLIO-ABDO GUARD": "protective-lower-body-sportsfolio-abdo-guard.webp",
  "YONKER ABDO GUARD": "protective-lower-body-yonker-abdo-guard.webp",
  "THIGH GUARD COMBO": "protective-lower-body-thigh-guard-combo.webp",
  "MOONWALKR THIGH GUARD COMBO": "protective-lower-body-moonwalkr-thigh-guard-combo.webp",
  "SG-BL COLORED PADS": "protective-lower-body-sg-bl-colored-pads.webp",
  "SG-BL XTREME": "protective-lower-body-sg-bl-xtreme.webp",
  "CEIL COLORED": "protective-lower-body-ceil-colored.webp",
  "YONKER-COLORED HELMETS": "protective-helmets-yonker-colored-helmets.webp",
  "MOONWALKR HELMET": "protective-helmets-moonwalkr-helmet.webp",
  "FORMA HELMET": "protective-helmets-forma-helmet.webp",
  "SHREY HELMET": "protective-helmets-shrey-helmet.webp",
  "SHREY NECK GUARD": "protective-helmets-shrey-neck-guard.webp",
  // Gloves
  "MRF BIG CHASE MASTER": "gloves-batting-mrf-big-chase-master.webp",
  "MRF LEGEND VK": "gloves-batting-mrf-legend-vk.webp",
  "MRF GRAND 20": "gloves-batting-mrf-grand-20.webp",
  "BIG POWERPLUS (SS)": "gloves-batting-big-powerplus.webp",
  "6/6 GOLDEN GUTSY (SS)": "gloves-batting-6-6-golden-gutsy.webp",
  "BIG TON SUPREME (SS)": "gloves-batting-big-ton-supreme.webp",
  "6/6 CLUBLITE (SS)": "gloves-batting-6-6-clublite.webp",
  "RNS BIG SPORTSFOLIO": "gloves-batting-rns-big-sportsfolio.webp",
  "BG PLATINO": "gloves-batting-bg-platino.webp",
  "WK GLOVES DRAGON (SS)": "gloves-wicketkeeping-wk-gloves-dragon.webp",
  "WK GLOVES TON 10 41 (SS)": "gloves-wicketkeeping-wk-gloves-ton-10-41.webp",
  "WK PAD (SS)": "gloves-wicketkeeping-wk-pad.webp",
  "RNS-WK GLOVES": "gloves-wicketkeeping-rns-wk-gloves.webp",
  "RNS-WK COLORED PADS": "gloves-wicketkeeping-rns-wk-colored-pads.webp",
  "Z HORSES-WK GLOVES": "gloves-wicketkeeping-z-horses-wk-gloves.webp",
  // Balls
  "SPORTSFOLIO LEATHER PRACTICE BALLS": "balls-sportsfolio-leather-practice-balls.webp",
  "SG-CLUB LEATHER": "balls-sg-club-leather.webp",
  "SG-SHIELD 20": "balls-sg-shield-20.webp",
  "NIVIA BALL DOZEN": "balls-nivia-ball-dozen.webp",
  "CENTRE COURT-PK SIXER BALL DOZEN": "balls-centre-court-pk-sixer-ball-dozen.webp",
  "CA SPEED TENNIS BALL": "balls-ca-speed-tennis-ball.webp",
  "AFO-YELLOW BALLS": "balls-afo-yellow-balls.webp",
  "WILSON SOFT TENNIS BALLS": "balls-wilson-soft-tennis-balls.webp",
  // Apparel
  "MRF KITBAG & TROLLEYS": "bags-kits-mrf-kitbag-and-trolleys.webp",
  "PROFESSIONAL WHEELIE 24 (SS)": "bags-kits-professional-wheelie-24.webp",
  "MATRIX WHEELIE (SS)": "bags-kits-matrix-wheelie.webp",
  "BLASTER WHEELIE (SS)": "bags-kits-blaster-wheelie.webp",
  "MASTER KITBAG (SS)": "bags-kits-master-kitbag.webp",
  "RANGER KITBAG (SS)": "bags-kits-ranger-kitbag.webp",
  "FIRST KIT BAG (SS)": "bags-kits-first-kit-bag.webp",
  "KIDS PLASTIC KIT (SS)": "youth-kits-kids-plastic-kit.webp",
  "FIRST KIT (SS)": "youth-kits-first-kit.webp",
  "BIG CAMPUS": "youth-kits-big-campus.webp",
  "17 BIL CLUBBLITE": "youth-kits-17-bil-clubblite.webp",
  "FIPCO KIDS KIT": "youth-kits-fipco-kids-kit.webp",
  "ADIDAS INDIAN JERSEY": "team-sportswear-adidas-indian-jersey.webp",
  "CSK JERSEY": "team-sportswear-csk-jersey.webp",
  "MI JERSEY": "team-sportswear-mi-jersey.webp",
  // Accessories
  "WAX DOGM": "accessories-bat-care-wax-dogm.webp",
  "WAX 25GM / STUMP": "accessories-bat-care-wax-25gm-stump.webp",
  "TOE GUARD KIT": "accessories-bat-care-toe-guard-kit.webp",
  "BAT MALLET": "accessories-bat-care-bat-mallet.webp",
  "BALL MALLET": "accessories-bat-care-ball-mallet.webp",
  "SIDE TAPE ROLL": "accessories-bat-care-side-tape-roll.webp",
  "SIDE TAPE ROLL 1.75": "accessories-bat-care-side-tape-roll-175.webp",
  "SCUFF SHEET": "accessories-bat-care-scuff-sheet.webp",
  "GRIP CONE": "accessories-grips-grip-cone.webp",
  "SINGLE PREMIUM GRIP": "accessories-grips-single-premium-grip.webp",
  "GRIPS HACK": "accessories-grips-grips-hack.webp",
  "MATTING GRIPS": "accessories-grips-matting-grips.webp",
  "ROBOARM SHORT": "accessories-training-roboarm-short.webp",
  "ROBOARM LONG": "accessories-training-roboarm-long.webp",
  "BATTING TEES": "accessories-training-batting-tees.webp",
  "SPORTSFOLIO PLASTIC CONE": "accessories-training-sportsfolio-plastic-cone.webp",
  "STRINGING BALL": "accessories-training-stringing-ball.webp",
  "STR8BAT BATTING SENSOR": "accessories-training-str8bat-batting-sensor.webp",
  "TARGET STUMPS": "accessories-stumps-target-stumps.webp",
  "GRAVITY STUMP": "accessories-stumps-gravity-stump.webp",
  "PROTOS-LIGHTING STUMP": "accessories-stumps-protos-lighting-stump.webp",
  "SPORTSFOLIO PLASTIC STUMP": "accessories-stumps-sportsfolio-plastic-stump.webp",
  "SPORTSFOLIO-RUBBER BASE STUMP": "accessories-stumps-sportsfolio-rubber-base-stump.webp",
  "SPORTSFOLIO SPRING STUMP": "accessories-stumps-sportsfolio-spring-stump.webp",
  "4 WAY SLEEVE": "accessories-clothing-4-way-sleeve.webp",
  "PADDED SLEEVE": "accessories-clothing-padded-sleeve.webp",
  "COLORED SLEEVE": "accessories-clothing-colored-sleeve.webp",
  "LEGGUARD CLADIS": "accessories-clothing-legguard-cladis.webp",
  "BATTING INNERS": "accessories-clothing-batting-inners.webp",
  "FINGER CUT INNERS": "accessories-clothing-finger-cut-inners.webp",
  "WK INNER GLOVES": "accessories-clothing-wk-inner-gloves.webp",
  "BATTING INNERS (Youth)": "accessories-clothing-batting-inners-youth.webp",
  "PANAMA HAT": "accessories-clothing-panama-hat.webp",
  "SUNGLASSES": "accessories-clothing-sunglasses.webp",
  "TOSS COIN": "accessories-clothing-toss-coin.webp",
  "UMPIRE COUNTER": "accessories-clothing-umpire-counter.webp",
  "HELMET NUTS": "accessories-clothing-helmet-nuts.webp",
  "TENNIS BATTING GLOVES": "accessories-clothing-tennis-batting-gloves.webp",
  "GRAY NICHOLLS MOP": "accessories-clothing-gray-nicholls-mop.webp",
};

const result = {};
const missingFiles = [];
for (const [product, filename] of Object.entries(hardcodedMap)) {
  if (files.has(filename)) {
    result[product] = "/images/products/" + filename;
  } else {
    missingFiles.push({ product, filename });
  }
}

fs.writeFileSync("scripts/image-map.json", JSON.stringify(result, null, 2));
console.log(`Mapped ${Object.keys(result).length} products`);
console.log(`Total webp files: ${files.size - 1}`); // -1 for product.jpg

if (missingFiles.length > 0) {
  console.log("\nMISSING FILES:");
  for (const m of missingFiles) {
    console.log(`  ${m.filename} ← ${m.product}`);
  }
}
