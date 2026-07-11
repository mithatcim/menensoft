import { notFound } from "next/navigation";

/** Unmatched /en/* paths render the branded English 404. */
export default function EnCatchAll() {
  notFound();
}
