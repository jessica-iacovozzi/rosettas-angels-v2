// Gallery & home media manifest. Public IDs match the Cloudinary `rosettasangels`
// account. Year is parsed from the id where present so we can group/sort
// in the gallery view without hand-maintaining a parallel list.

import type { GalleryAsset, ResolvedGalleryAsset } from '~/types';
import { getImageUrl, getVideoUrl, getVideoThumbnail } from './cloudinary';

export const HOME_BANNER_VIDEO_ID = 'home/banner_video';
export const FEATURE_VIDEO_ID = 'gallery/2025_video';

const RAW_ASSETS: GalleryAsset[] = [
  { type: 'video', id: 'gallery/2025_video' },
  { type: 'image', id: 'gallery/2025' },
  { type: 'image', id: 'gallery/2024' },
  { type: 'image', id: 'gallery/2023' },
  { type: 'image', id: 'gallery/2022' },
  { type: 'image', id: 'gallery/2019' },
  { type: 'image', id: 'gallery/2018' },
  { type: 'image', id: 'gallery/2017' },
  { type: 'image', id: 'gallery/2016' },
  { type: 'image', id: 'gallery/2015' },
  { type: 'image', id: 'gallery/2014' },
  { type: 'image', id: 'gallery/2013' },
  { type: 'image', id: 'gallery/2012' },
  { type: 'image', id: 'gallery/2009' },
  { type: 'image', id: 'gallery/gallery-1' },
  { type: 'image', id: 'gallery/gallery-2' },
  { type: 'image', id: 'gallery/gallery-3' },
  { type: 'image', id: 'gallery/gallery-4' },
  { type: 'image', id: 'gallery/gallery-5' },
  { type: 'image', id: 'gallery/gallery-6' },
  { type: 'image', id: 'gallery/gallery-7' },
  { type: 'image', id: 'gallery/gallery-8' },
  { type: 'image', id: 'gallery/gallery-9' },
  { type: 'image', id: 'gallery/gallery-10' },
  { type: 'image', id: 'gallery/gallery-11' },
  { type: 'image', id: 'gallery/gallery-12' },
  { type: 'image', id: 'gallery/gallery-13' },
  { type: 'image', id: 'gallery/gallery-14' },
  { type: 'image', id: 'gallery/gallery-15' },
  { type: 'image', id: 'gallery/gallery-18' },
  { type: 'image', id: 'gallery/gallery-19' },
  { type: 'image', id: 'gallery/gallery-20' },
  { type: 'image', id: 'gallery/gallery-23' },
  { type: 'image', id: 'gallery/gallery-24' },
];

function parseYear(id: string): number | undefined {
  const m = id.match(/\/(\d{4})(?:_|$)/);
  return m ? Number(m[1]) : undefined;
}

function defaultAlt(asset: GalleryAsset, year: number | undefined): string {
  if (year) {
    return asset.type === 'video'
      ? `Highlight video from the ${year} Rosetta's Angels holiday basket event`
      : `Photograph from the ${year} Rosetta's Angels holiday basket event`;
  }
  return asset.type === 'video'
    ? `Rosetta's Angels volunteers preparing and delivering holiday baskets`
    : `Rosetta's Angels volunteers preparing and delivering holiday baskets to Montreal families`;
}

export const GALLERY_ASSETS: ResolvedGalleryAsset[] = RAW_ASSETS.map((a) => {
  const year = a.year ?? parseYear(a.id);
  const alt = a.alt ?? defaultAlt(a, year);
  if (a.type === 'video') {
    return {
      ...a,
      year,
      alt,
      url: getVideoUrl(a.id, 1920),
      thumbnailUrl: getVideoThumbnail(a.id, 60, 1280),
    };
  }
  return {
    ...a,
    year,
    alt,
    url: getImageUrl(a.id, 1600),
  };
});

/** Sort: videos first, then years descending, then unsorted gallery-N items. */
export const GALLERY_ASSETS_SORTED: ResolvedGalleryAsset[] = [...GALLERY_ASSETS]
  .sort((a, b) => {
    if (a.type !== b.type) return a.type === 'video' ? -1 : 1;
    if (a.year && b.year) return b.year - a.year;
    if (a.year) return -1;
    if (b.year) return 1;
    return a.id.localeCompare(b.id, 'en', { numeric: true });
  });
