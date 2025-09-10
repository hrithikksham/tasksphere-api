// middleware/logActivity.js
import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "activity.log");

export const logActivity = (userId, action, details = "") => {
  const logEntry = `[${new Date().toISOString()}] User: ${userId} | Action: ${action} | Details: ${details}\n`;
  
  // Save log to file
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error("Error logging activity:", err);
  });

  console.log(logEntry.trim()); // Also log in console
};
