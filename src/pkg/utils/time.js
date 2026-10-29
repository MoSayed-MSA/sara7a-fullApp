export function timeToMS(time, unit) {
    switch (unit) {
        case "sec":
            return time * 1000;
        case "min":
            return time * 60 * 1000;
        case "h":
            return time * 60 * 60 * 1000;
        default:
            throw new Error("Invalid unit");
    }
}