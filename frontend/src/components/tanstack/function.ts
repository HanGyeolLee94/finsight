export function formatValue(value: any, formatType?: string): any {
  switch (formatType) {
    case "comma":
      return typeof value === "number" ? value.toLocaleString() : value;
    case "currency":
      return typeof value === "number"
        ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        : value;
    case "percentage":
      return typeof value === "number" ? `${value.toFixed(2)}%` : value;
    case "uppercase":
      return typeof value === "string" ? value.toUpperCase() : value;
    case "lowercase":
      return typeof value === "string" ? value.toLowerCase() : value;
    default:
      return value; // Return value as-is for unsupported formats
  }
}
