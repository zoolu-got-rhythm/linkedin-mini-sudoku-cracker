import { readFileSync, existsSync } from "fs";

export function validateLoginDetails(filePath) {
    if (!existsSync(filePath)) {
        console.error(`Error: Login details file not found at ${filePath}`);
        console.error(
            'Please create a loginDetails.json file with the format: { "email": "your-email", "password": "your-password" }',
        );
        process.exit(1);
    }

    let fileContents;
    try {
        fileContents = readFileSync(filePath, "utf-8");
    } catch (err) {
        console.error(`Error: Could not read login details file: ${err.message}`);
        process.exit(1);
    }

    let loginDetails;
    try {
        loginDetails = JSON.parse(fileContents);
    } catch (err) {
        console.error(`Error: loginDetails.json is not valid JSON: ${err.message}`);
        console.error(
            'Expected format: { "email": "your-email", "password": "your-password" }',
        );
        process.exit(1);
    }

    if (typeof loginDetails.email !== "string" || !loginDetails.email.trim()) {
        console.error(
            'Error: loginDetails.json must contain an "email" property with a non-empty string value',
        );
        console.error(
            'Expected format: { "email": "your-email", "password": "your-password" }',
        );
        process.exit(1);
    }

    if (typeof loginDetails.password !== "string" || !loginDetails.password) {
        console.error(
            'Error: loginDetails.json must contain a "password" property with a non-empty string value',
        );
        console.error(
            'Expected format: { "email": "your-email", "password": "your-password" }',
        );
        process.exit(1);
    }

    return loginDetails;
}
