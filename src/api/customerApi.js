const API_BASE_URL = "http://localhost:8000";

export async function getCustomer(customerId) {
  const response = await fetch(
    `${API_BASE_URL}/customers/${customerId}`
  );

  if (!response.ok) {
    throw new Error("고객 정보를 불러오지 못했습니다.");
  }

  const result = await response.json();

  return result.data;
}