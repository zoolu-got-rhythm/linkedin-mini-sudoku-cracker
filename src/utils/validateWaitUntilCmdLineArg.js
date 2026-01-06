export function validateWaitUntilCmdLineArg(time) {
    if (!time) {
        return { valid: false, error: "Missing time value after --wait-until" };
    }
    if (!/^\d{1,2}:\d{2}$/.test(time)) {
        return {
            valid: false,
            error: `Invalid time format "${time}". Expected format: M:SS (e.g., 2:05)`,
        };
    }
    const [minutes, seconds] = time.split(":").map(Number);
    if (seconds > 59) {
        return {
            valid: false,
            error: `Invalid seconds value "${seconds}". Seconds must be 0-59`,
        };
    }
    return { valid: true };
}
