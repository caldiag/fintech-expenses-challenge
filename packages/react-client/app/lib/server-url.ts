export function serverUrl(): string {
  const hostname =
    typeof window === "undefined" ? "localhost" : window.location.hostname
  return `http://${hostname}:3000/api`
}
