/**
 * Generates ADMIN_PASSWORD_HASH for .env.local (Phase 33D).
 *
 *   node scripts/hash-admin-password.mjs
 *
 * Reads the password from stdin without echoing it, so it never lands in your
 * shell history, your terminal scrollback, or a screenshot. Prints only the
 * hash — the password itself is never written anywhere.
 *
 * Format: scrypt:N:r:p:saltHex:hashHex. The parameters travel with the hash, so
 * they can be raised later without invalidating what already exists.
 *
 * COLONS, NOT DOLLARS — and this is not cosmetic. The conventional PHC form
 * (scrypt$N$r$p$...) is unusable in a .env file: dotenv expands variables, so
 * `$16384` is read as a reference to a variable named `1` followed by `6384`.
 * The hash arrives at the app mangled and every correct password is silently
 * rejected. Nothing errors; it just never matches.
 */
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

const N = 16384;
const r = 8;
const p = 1;

function hash(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password.normalize("NFKC"), salt, 64, { N, r, p });
  return `scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${key.toString("hex")}`;
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    // Suppress the echo so the password is never shown or scrolled back to.
    const onData = (char) => {
      if (["\n", "\r", ""].includes(char.toString("utf8"))) {
        process.stdin.removeListener("data", onData);
      } else {
        process.stdout.write("\x1b[2K\x1b[200D" + question);
      }
    };
    process.stdin.on("data", onData);

    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const password = await ask("Admin parolası: ");

if (password.length < 12) {
  console.error(
    "\nParola en az 12 karakter olmalı. Bu, internete açık tek giriş noktanız.",
  );
  process.exit(1);
}

const confirm = await ask("Tekrar: ");
if (confirm !== password) {
  console.error("\nParolalar eşleşmedi.");
  process.exit(1);
}

console.log("\n.env.local dosyanıza şu satırı ekleyin:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash(password)}`);
console.log(
  "\nParolanın kendisi hiçbir yere yazılmadı. Hash'i commit etmeyin —\n" +
    ".env.local zaten git tarafından yok sayılıyor.\n",
);
