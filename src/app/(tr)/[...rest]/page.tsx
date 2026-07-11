import { notFound } from "next/navigation";

/**
 * Kök yakala-hepsi: iki kök layout'lu (tr)/(en) yapıda eşleşmeyen her yol
 * markalı 404'e düşsün diye vardır. /en altı kendi yakala-hepsi'ni kullanır.
 */
export default function CatchAll() {
  notFound();
}
