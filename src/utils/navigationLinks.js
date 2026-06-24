export function parseGoogleMapsUrl(url) {
    try {
        const parsed = new URL(url);
        const q = parsed.searchParams.get("q");
        if (!q) return null;

        const cleaned = q.replace(/\s/g, "");
        const [latStr, lngStr] = cleaned.split(",");
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
        return { lat, lng };
    } catch {
        return null;
    }
}

export function buildNavigationUrls(lat, lng, label = "") {
    const query = label.trim() || `${lat},${lng}`;
    const encodedQuery = encodeURIComponent(query);

    return {
        google: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
        apple: `https://maps.apple.com/?ll=${lat},${lng}&q=${encodedQuery}`,
    };
}
