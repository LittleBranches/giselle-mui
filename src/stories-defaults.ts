// ----------------------------------------------------------------------
// Shared placeholder assets for Storybook stories.
//
// Use these instead of external URLs (via.placeholder.com, picsum, etc.) so stories
// are self-contained and work offline / in CI without network access.
// ----------------------------------------------------------------------

function svgDataUri(width: number, height: number, fill: string, label: string): string {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`,
    `<rect width="${width}" height="${height}" fill="${fill}"/>`,
    `<text x="${width / 2}" y="${Math.round(height * 0.55)}" `,
    `font-family="sans-serif" font-size="${Math.round(width / 10)}" `,
    `fill="#fff" text-anchor="middle">${label}</text>`,
    `</svg>`,
  ].join('');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Placeholder for the artistic logo overlay slot (240×240, mango gold).
 *
 * Use wherever a story needs an `artisticLogoSrc` but no real asset is available.
 */
export const PLACEHOLDER_ART_SRC = svgDataUri(240, 240, '#F5A623', 'art');

/**
 * Placeholder for the portrait slot (480×480, deep grove green).
 *
 * Use wherever a story needs a `portraitSrc` but no real asset is available.
 */
export const PLACEHOLDER_PORTRAIT_SRC = svgDataUri(480, 480, '#2E7D32', 'portrait');
