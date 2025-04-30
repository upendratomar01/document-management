export function formatISODate(isoDate?: string): string | null {
  if (!isoDate) return null;

  const date = new Date(isoDate);
  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are zero-based
  const year = date.getFullYear().toString().slice(2); // '25' from '2025'

  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  const hour12 = pad(hours);

  return `${day}-${month}-${year} ${hour12}:${minutes}:${seconds} ${ampm}`;
}

export const downloadFile = (filePath: string) => {
  const a = document.createElement("a");
  a.href = filePath;
  a.download = filePath.split("/").pop()!;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
