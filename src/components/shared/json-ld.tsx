/**
 * Renders a schema.org JSON-LD block. `data` must come from the typed
 * builders in src/lib/schema.ts — never from user input (XSS surface).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
