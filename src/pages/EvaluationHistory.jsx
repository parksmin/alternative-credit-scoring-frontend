import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentEvaluations } from "../api/evaluationApi";

function EvaluationHistory() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvaluations() {
      try {
        setLoading(true);
        setError("");

        const data = await getRecentEvaluations(20);

        setEvaluations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvaluations();
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getRiskLabel(riskLevel) {
    if (riskLevel === "LOW") return "낮은 위험";
    if (riskLevel === "MEDIUM") return "중간 위험";
    return "높은 위험";
  }

  function getRiskClass(riskLevel) {
    if (riskLevel === "LOW") return "low";
    if (riskLevel === "MEDIUM") return "medium";
    return "high";
  }

  function getThinFilerLabel(status) {
    if (status === "THIN") return "Thin Filer";
    return "일반";
  }

  if (loading) {
    return (
      <div className="state-message">
        평가 이력을 불러오는 중입니다.
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-message error">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <p className="eyebrow">EVALUATION HISTORY</p>

        <h1>평가 이력</h1>

        <p className="page-description">
          최근에 실행한 고객 신용위험 평가 결과를 확인합니다.
        </p>
      </div>

      <section className="panel history-panel">
        <div className="history-header">
          <div>
            <span className="section-label">RECENT EVALUATIONS</span>
            <h2>최근 평가</h2>
          </div>

          <span className="history-count">
            총 {evaluations.length}건
          </span>
        </div>

        {evaluations.length === 0 ? (
          <div className="empty-state">
            평가 이력이 없습니다.
          </div>
        ) : (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>고객</th>
                  <th>평가일시</th>
                  <th>위험 확률</th>
                  <th>위험 수준</th>
                  <th>Thin Filer</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.evaluationId}>
                    <td>
                      <div className="history-customer">
                        <strong>
                          {evaluation.customerName}
                        </strong>

                        <span>
                          고객 ID {evaluation.customerId}
                        </span>
                      </div>
                    </td>

                    <td>
                      {formatDate(evaluation.evaluatedAt)}
                    </td>

                    <td>
                      <strong>
                        {Number(
                          evaluation.riskProbabilityPercent || 0
                        ).toFixed(2)}
                        %
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`risk-badge ${getRiskClass(
                          evaluation.riskLevel
                        )}`}
                      >
                        {getRiskLabel(evaluation.riskLevel)}
                      </span>
                    </td>

                    <td>
                      {getThinFilerLabel(
                        evaluation.thinFilerStatus
                      )}
                    </td>

                    <td className="history-action">
                      <Link
                        to={`/evaluations/${evaluation.evaluationId}`}
                      >
                        상세 보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default EvaluationHistory;