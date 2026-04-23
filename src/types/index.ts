// Shared types — kept narrow on purpose. If a value can be empty in HTML, type
// it as a plain string ("" allowed) and validate in the form layer.

export type DeliveryAnswer = 'Yes' | 'No' | 'Maybe';

export interface VolunteerFormData {
  name: string;
  email: string;
  phone: string;
  additionalNames: string;
  /** Empty string before user picks an option */
  delivery: '' | DeliveryAnswer;
  comments: string;
  honeypot: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  honeypot: string;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  message: string;
  data?: T;
  /** Only populated on errors, never echoed verbatim to UI in production */
  errorCode?: string;
}

export type GalleryAssetType = 'image' | 'video';

export interface GalleryAsset {
  type: GalleryAssetType;
  /** Cloudinary public_id, no extension */
  id: string;
  /** Year if the asset corresponds to an event year — used for label/sort */
  year?: number;
  /** Author-provided alt text. If absent we synthesize from year/type. */
  alt?: string;
}

export interface ResolvedGalleryAsset extends GalleryAsset {
  url: string;
  thumbnailUrl?: string;
  alt: string;
}
