import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DATA_PATH = path.join(ROOT, "data", "shops.json");
const PUBLIC_DIR = path.join(ROOT, "public");
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

export { ROOT, DATA_PATH, PUBLIC_DIR, PORT, HOST };
