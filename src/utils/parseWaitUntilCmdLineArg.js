import { validateWaitUntilCmdLineArg } from "./validateWaitUntilCmdLineArg.js";

export function parseWaitUntilCmdLineArg(args) {
    let waitUntilTime = null;

    // Check for --wait-until <time> format
    const waitUntilIndex = args.indexOf("--wait-until");
    if (waitUntilIndex !== -1) {
        waitUntilTime = args[waitUntilIndex + 1];
    } else {
        // Check for --wait-until=<time> format
        const equalsArg = args.find((arg) => arg.startsWith("--wait-until="));
        if (equalsArg) {
            waitUntilTime = equalsArg.split("=")[1];
        }
    }

    // Validate --wait-until if provided
    if (waitUntilTime !== null || waitUntilIndex !== -1) {
        const validation = validateWaitUntilCmdLineArg(waitUntilTime);
        if (!validation.valid) {
            console.error(`Error: ${validation.error}`);
            process.exit(1);
        }
    }

    return waitUntilTime;
}
