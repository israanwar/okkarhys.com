import { site } from "../data/site";

export const SOCIAL_CARD_PATH = "/assets/social/okkarhys-blog-share.png";
export const SOCIAL_CARD_WIDTH = 1200;
export const SOCIAL_CARD_HEIGHT = 630;

export function getSocialImageUrl(imagePath = SOCIAL_CARD_PATH) {
  return new URL(imagePath, site.url).toString();
}

export function getSocialSiteName() {
  return site.domain.replace(/^www\./i, "");
}
