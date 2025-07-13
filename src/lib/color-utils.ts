// A simple hashing function to get a number from a string
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Converts HSL color values to a hex string
function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Converts a hex color string to HSL values
function hexToHsl(hex: string): { h: number, s: number, l: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
}


// A small, expandable map of color names to hex codes.
const PREDEFINED_COLORS: Record<string, string> = {
    "red": "#FF0000",
    "green": "#00FF00",
    "blue": "#0000FF",
    "yellow": "#FFFF00",
    "cyan": "#00FFFF",
    "magenta": "#FF00FF",
    "electric indigo": "#6F00FF",
    "luminous vivid violet": "#A020F0",
    "dark slate gray": "#2F4F4F",
    "chartreuse": "#7FFF00",
    "deep sky blue": "#00BFFF",
    "orange red": "#FF4500",
    "hot pink": "#FF69B4",
    "spring green": "#00FF7F"
};

/**
 * Maps a color name to a hex code. If the name is not in the predefined map,
 * it generates a deterministic, pseudo-random color based on the name.
 * @param name The color name string.
 * @param seed A number to vary the generated color, like a path number.
 * @returns A hex color string (e.g., "#RRGGBB").
 */
export function mapColorNameToHex(name: string, seed: number = 0): string {
    const lowerCaseName = name.toLowerCase();
    if (PREDEFINED_COLORS[lowerCaseName]) {
        return PREDEFINED_COLORS[lowerCaseName];
    }
    
    // Generate a color if not found
    const hash = simpleHash(name + seed.toString());
    const h = hash % 360;
    const s = 70 + (hash % 30); // Saturation between 70% and 100%
    const l = 50 + (hash % 10); // Lightness between 50% and 60%

    return hslToHex(h, s, l);
}

/**
 * Dims a color by reducing its saturation and lightness.
 * @param hex The hex color string to dim.
 * @returns A new, dimmed hex color string.
 */
export function dimColor(hex: string): string {
    const hsl = hexToHsl(hex);
    // Reduce saturation and lightness, but not to zero
    hsl.s = Math.max(hsl.s * 0.5, 20);
    hsl.l = Math.max(hsl.l * 0.7, 25);
    return hslToHex(hsl.h, hsl.s, hsl.l);
}


/**
 * Creates a "noise" color by slightly shifting the hue of the original.
 * @param hex The original hex color string.
 * @returns A new hex color string with a slightly different hue.
 */
export function getNoiseColor(hex: string): string {
    const hsl = hexToHsl(hex);
    // Shift hue by a small random amount
    const shift = 15 - Math.random() * 30; // -15 to +15
    hsl.h = (hsl.h + shift + 360) % 360;
    return hslToHex(hsl.h, hsl.s, hsl.l);
}
