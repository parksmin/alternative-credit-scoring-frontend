const API_BASE_URL = "http://localhost:8000";

export async function getRecentEvaluations(limit = 10) {
  const response = await fetch(
    `${API_BASE_URL}/evaluations/recent?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("최근 평가 정보를 불러오지 못했습니다.");
  }

  const result = await response.json();

  return result.data.evaluations;
}

export async function createEvaluation(customerId) {
  const response = await fetch(
    `${API_BASE_URL}/evaluations?customer_id=${Number(customerId)}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    console.error(
      "평가 API 오류 전체:",
      JSON.stringify(errorData, null, 2)
    );

    throw new Error("신용평가를 실행하지 못했습니다.");
  }

  const result = await response.json();

  return result.data;
}

export async function getEvaluation(evaluationId) {
  const response = await fetch(
    `${API_BASE_URL}/evaluations/${evaluationId}`
  );

  if (!response.ok) {
    throw new Error("평가 정보를 불러오지 못했습니다.");
  }

  const result = await response.json();

  return result.data;
}

export async function getEvaluationExplanation(evaluationId) {
  const response = await fetch(
    `${API_BASE_URL}/evaluations/${evaluationId}/explanation`
  );

  if (!response.ok) {
    throw new Error("평가 설명 정보를 불러오지 못했습니다.");
  }

  const result = await response.json();

  return result.data;
}