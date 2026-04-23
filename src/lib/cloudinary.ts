// Cloudinary URL builder with memoization. Pure URL generation — no SDK runtime
// in the browser, no API calls; we just build deterministic CDN URLs.

import { Cloudinary } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';
import { quality } from '@cloudinary/url-gen/actions/delivery';
import { format } from '@cloudinary/url-gen/actions/delivery';
const CLOUD_NAME =
  import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'rosettasangels';

const cld = new Cloudinary({
  cloud: { cloudName: CLOUD_NAME },
  url: { secure: true },
});

const imageCache = new Map<string, string>();
const videoCache = new Map<string, string>();
const thumbCache = new Map<string, string>();

/** Build an optimized image URL. width=0 means deliver original. */
export function getImageUrl(publicId: string, width = 0): string {
  const key = `${publicId}@${width}`;
  const cached = imageCache.get(key);
  if (cached) return cached;

  let img = cld
    .image(publicId)
    .delivery(quality(autoQuality()))
    .delivery(format(autoFormat()));

  if (width > 0) img = img.resize(scale().width(width));

  const url = img.toURL();
  imageCache.set(key, url);
  return url;
}

/** Build a `srcset` string for responsive images. */
export function getResponsiveSrcSet(
  publicId: string,
  widths: number[] = [480, 768, 1024, 1440, 1920],
): string {
  return widths.map((w) => `${getImageUrl(publicId, w)} ${w}w`).join(', ');
}

/** Build an optimized video URL (HD by default). */
export function getVideoUrl(publicId: string, width = 1920): string {
  const key = `${publicId}@${width}`;
  const cached = videoCache.get(key);
  if (cached) return cached;

  const url = cld
    .video(publicId)
    .delivery(quality(autoQuality()))
    .delivery(format(autoFormat()))
    .resize(scale().width(width))
    .toURL();
  videoCache.set(key, url);
  return url;
}

/** Frame extracted from a video — used as a poster for <video> elements.
 *  Uses Cloudinary's `so_` (start offset) + jpg extension to grab a single frame. */
export function getVideoThumbnail(
  publicId: string,
  startOffsetSeconds = 60,
  width = 1920,
): string {
  const key = `${publicId}@${startOffsetSeconds}@${width}`;
  const cached = thumbCache.get(key);
  if (cached) return cached;

  // Cloudinary returns a JPEG frame when we request a video with .jpg extension
  // and a start-offset transformation.
  const url =
    `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/` +
    `so_${startOffsetSeconds},w_${width},c_scale,q_auto,f_jpg/` +
    `${publicId}.jpg`;
  thumbCache.set(key, url);
  return url;
}
