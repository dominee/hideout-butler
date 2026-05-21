import { unlinkSync } from "node:fs";

for (const path of ["dist/_redirects", "dist/_routes.json"]) {
  try {
    unlinkSync(path);
  } catch {
    // file absent — expected for a clean static build
  }
}
