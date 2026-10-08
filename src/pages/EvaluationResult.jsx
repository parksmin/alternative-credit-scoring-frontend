import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getEvaluation,
  getEvaluationExplanation,
} from "../api/evaluationApi";

function EvaluationResult() {
  const { evaluationId } = useParams();

  const [evaluation, setEvaluation] = useState(null);
  const [explanation, setExplanation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResult() {
      try {
        setLoading(true);
        setError("");

        const [evaluationData, explanationData] =
          await Promise.all([
            getEvaluation(evaluationId),
            getEvaluationExplanation(evaluationId),
          ]);

          console.log("평가 데이터:", evaluationData);
          console.log("설명 데이터:", explanationData);

        setEvaluation(evaluationData);
        setExplanation(
  explanationData?.factors || []
);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [evaluationId]);

  function getRiskClass(riskLevel) {
    if (riskLevel === "LOW") return "low";
    if (riskLevel === "MEDIUM") return "medium";
    return "high";
  }

  function getRiskLabel(riskLevel) {
    if (riskLevel === "LOW") return "낮은 위험";
    if (riskLevel === "MEDIUM") return "중간 위험";
    return "높은 위험";
  }

  function getDirectionLabel(direction) {
    if (direction === "NEGATIVE") return "위험도를 낮추는 요인";
    if (direction === "POSITIVE") return "위험도를 높이는 요인";
    return "영향이 적은 요인";
  }

  if (loading) {
    return (
      <div className="empty-state">
        <p>평가 결과를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state error-state">
        <p>{error}</p>

        <Link to="/customers" className="primary-button">
          고객 평가로 돌아가기
        </Link>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="empty-state">
        <p>평가 결과를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const riskProbability = Number(
    evaluation.riskProbabilityPercent || 0
  );

  const negativeFactors = explanation.filter(
    (item) => item.factorDirection === "NEGATIVE"
  );

  const positiveFactors = explanation.filter(
    (item) => item.factorDirection === "POSITIVE"
  );

  return (
    <>
      <div className="page-header">
        <p className="eyebrow">EVALUATION RESULT</p>

        <h1>평가 결과</h1>

        <p className="page-description">
          고객의 신용위험 평가 결과와 주요 영향 요인을 확인합니다.
        </p>
      </div>

      {/* 평가 결과 */}

      <section className="panel result-main">
        <div className="result-customer">
          <div>
            <span className="panel-label">CUSTOMER</span>

            <h2>
              {evaluation.customerName || "고객"}
            </h2>

            <p>
              고객 ID {evaluation.customerId}
            </p>
          </div>

          <div
            className={`result-risk ${getRiskClass(
              evaluation.riskLevel
            )}`}
          >
            <span>
              {getRiskLabel(evaluation.riskLevel)}
            </span>

            <strong>
              {riskProbability.toFixed(1)}%
            </strong>

            <small>위험 확률</small>
          </div>
        </div>

        <div className="risk-gauge">
          <div className="risk-gauge-track">
            <div
              className={`risk-gauge-value ${getRiskClass(
                evaluation.riskLevel
              )}`}
              style={{
                width: `${Math.min(
                  riskProbability,
                  100
                )}%`,
              }}
            />
          </div>

          <div className="risk-gauge-labels">
            <span>낮은 위험</span>
            <span>높은 위험</span>
          </div>
        </div>

        <div className="result-meta">
          <div>
            <span>모델</span>
            <strong>XGBOOST_V1</strong>
          </div>

          <div>
            <span>평가 상태</span>
            <strong>
              {evaluation.evaluationStatus ===
              "COMPLETED"
                ? "평가 완료"
                : evaluation.evaluationStatus}
            </strong>
          </div>

          <div>
            <span>Thin Filer</span>
            <strong>
              {evaluation.thinFilerStatus === "THIN"
                ? "해당"
                : "일반"}
            </strong>
          </div>
        </div>
      </section>

      {/* 주요 영향 요인 */}

      <section className="panel explanation-panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">
              KEY FACTORS
            </span>

            <h3>평가 결과의 주요 영향 요인</h3>
          </div>
        </div>

        <div className="factor-columns">
          <div className="factor-section">
            <div className="factor-title negative">
              <span>✓</span>
              <strong>위험도를 낮추는 요인</strong>
            </div>

            {negativeFactors.length === 0 ? (
              <p className="factor-empty">
                해당 요인이 없습니다.
              </p>
            ) : (
              negativeFactors.map((factor) => (
                <div
                  className="factor-row"
                  key={factor.featureName}
                >
                  <div>
                    <strong>
                      {factor.featureLabel}
                    </strong>

                    <span>
                      {getDirectionLabel(
                        factor.factorDirection
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="factor-section">
            <div className="factor-title positive">
              <span>•</span>
              <strong>위험도를 높이는 요인</strong>
            </div>

            {positiveFactors.length === 0 ? (
              <p className="factor-empty">
                해당 요인이 없습니다.
              </p>
            ) : (
              positiveFactors.map((factor) => (
                <div
                  className="factor-row"
                  key={factor.featureName}
                >
                  <div>
                    <strong>
                      {factor.featureLabel}
                    </strong>

                    <span>
                      {getDirectionLabel(
                        factor.factorDirection
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <div className="result-actions">
  <Link
    to={`/evaluations/${evaluationId}/explanation`}
    className="secondary-button"
  >
    상세 분석 보기
  </Link>

  <Link to="/customers" className="secondary-button">
    다른 고객 평가
  </Link>

  <Link to="/history" className="primary-button">
    평가 이력 보기
  </Link>
</div>
    </>
  );
}

export default EvaluationResult;