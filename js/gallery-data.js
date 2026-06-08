const defaultAlbumsData = [];

// Always use the hardcoded defaultAlbumsData as the source of truth.
// localStorage is NOT used for display — every visitor sees the same albums.
// The admin panel can still write to localStorage for its own management.
const albumsData = defaultAlbumsData;
window.albumsData = defaultAlbumsData;

// Seed localStorage so the admin panel can also read/manage these albums
try {
    localStorage.setItem('albumsData', JSON.stringify(defaultAlbumsData));
} catch (e) {
    console.warn("Could not seed albumsData to localStorage:", e);
}
