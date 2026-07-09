import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: site.availability,
    title: site.headline,
    subtitle: site.subheadline,
    footer: site.positioning,
  });
}
