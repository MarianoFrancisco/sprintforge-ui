export function formatGTQ(amount: number): string {
  return amount.toLocaleString("es-GT", {
    style: "currency",
    currency: "GTQ",
  });
}