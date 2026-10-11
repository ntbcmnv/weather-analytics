export const WEATHER_MAP_STYLE = {
  version: 8 as const,
  sources: {
    'osm-raster': {
      type: 'raster' as const,
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-raster-layer',
      type: 'raster' as const,
      source: 'osm-raster',
    },
  ],
};
