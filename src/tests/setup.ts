import { db } from "./db";

// Clears out old data
db(true).then(() => process.exit());
