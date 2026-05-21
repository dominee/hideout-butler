import { unlinkSync, writeFileSync } from "node:fs";

for (const path of ["dist/_redirects", "dist/_routes.json"]) {
  try {
    unlinkSync(path);
  } catch {
    // file absent — expected for a clean static build
  }
}

// Worker entry lives under dist/ but must not be uploaded as a public asset.
writeFileSync("dist/.assetsignore", "_worker.js\n");
