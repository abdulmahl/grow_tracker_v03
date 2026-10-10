export const STRAIN_PREFIXES = [
  "OG",
  "Purple",
  "Lemon",
  "Blue",
  "Gorilla",
  "Zkittlez",
];
export const STRAIN_SUFFIXES = [
  "Haze",
  "Kush",
  "Cookies",
  "Gelato",
  "Diesel",
  "Cake",
];

export function generateRandomStrainName(): string {
  const prefix =
    STRAIN_PREFIXES[Math.floor(Math.random() * STRAIN_PREFIXES.length)];
  const suffix =
    STRAIN_SUFFIXES[Math.floor(Math.random() * STRAIN_SUFFIXES.length)];
  const numbers =
    Math.random() > 0.5 ? ` #${Math.floor(Math.random() * 90) + 10}` : "";
  return `${prefix} ${suffix}${numbers}`;
}

export function calculateNutrientDosage(volume: number, stage: string) {
  let ratios = { micro: 1.0, gro: 1.0, bloom: 1.0, calmag: 1.0, ec: 1000 };

  if (stage === "seedling") {
    ratios = { micro: 0.5, gro: 0.5, bloom: 0.5, calmag: 1.0, ec: 600 };
  } else if (stage === "vegetative") {
    ratios = { micro: 2.0, gro: 2.0, bloom: 1.0, calmag: 1.5, ec: 1200 };
  } else if (stage === "flowering") {
    ratios = { micro: 1.5, gro: 0.5, bloom: 3.0, calmag: 1.0, ec: 1800 };
  }

  return {
    micro: (ratios.micro * volume).toFixed(1),
    gro: (ratios.gro * volume).toFixed(1),
    bloom: (ratios.bloom * volume).toFixed(1),
    calmag: (ratios.calmag * volume).toFixed(1),
    ec: ratios.ec,
  };
}
