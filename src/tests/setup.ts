import { connect } from "../postgres";

// Clears out old data
connect().then(() => process.exit());
