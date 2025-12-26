export function stringifyDates<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
