import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getEvaluation,
  getEvaluationExplanation,
} from "../api/evaluationApi";

function ExplanationDetail() {
  const { evaluationId } = useParams();

  const [evaluation, setEvaluation] = useState(null);
  const [factors, setFactors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExplanation() {
      try {
        setLoading(true);
        setError("");

        const [evaluationData, explanationData] =
          await Promise.all([
            getEvaluation(evaluationId),
            getEvaluationExplanation(evaluationId),
          ]);

        setEvaluation(evaluationData);
        setFactors(explanationData?.factors || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadExplanation();
  }, [evaluationId]);

  function getDirectionLabel(direction) {
    if (direction === "NEGATIVE") {
      return "위험도를 낮추는 요인";
    }

    if (direction === "POSITIVE") {
      return "위험도를 높이는 요인";
    }

    return "영향이 적은 요인";
  }

  function getDirectionClass(direction) {
    if (direction === "NEGATIVE") {
      return "negative";
    }

    if (direction === "POSITIVE") {
      return "positive";
    }

    return "neutral";
  }

  if (loading) {
    return (
      <div className="state-message">
        평가 설명을 불러오는 중입니다.
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

  if (!evaluation) {
    return (
      <div className="state-message">
        평가 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <p className="eyebrow">XAI ANALYSIS</p>

        <h1>평가 상세 분석</h1>

        <p className="page-description">
          모델이 고객의 신용위험 평가에 영향을 받은 주요 요인을 확인합니다.
        </p>
      </div>

      <section className="panel xai-summary">
        <div>
          <span className="section-label">CUSTOMER</span>

          <h2>{evaluation.customerName}</h2>

          <p>고객 ID {evaluation.customerId}</p>
        </div>

        <div className="xai-risk-summary">
          <span>위험 확률</span>

          <strong>
            {Number(evaluation.riskProbabilityPercent || 0).toFixed(2)}%
          </strong>

          <span>
            {evaluation.riskLevel === "LOW"
              ? "낮은 위험"
              : evaluation.riskLevel === "MEDIUM"
                ? "중간 위험"
                : "높은 위험"}
          </span>
        </div>
      </section>

      <section className="panel xai-panel">
        <div className="section-heading">
          <div>
            <span className="section-label">SHAP ANALYSIS</span>
            <h2>주요 영향 요인</h2>
          </div>

          <p>
            모델의 예측 결과에 영향을 준 요인을 중요도 순으로 표시합니다.
          </p>
        </div>

        <div className="xai-factor-list">
          {factors.length === 0 ? (
            <div className="empty-state">
              분석할 영향 요인이 없습니다.
            </div>
          ) : (
            factors.map((factor, index) => (
              <div
                className="xai-factor"
                key={`${factor.featureName}-${index}`}
              >
                <div className="xai-factor-rank">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="xai-factor-content">
                  <strong>{factor.featureLabel}</strong>

                  <span
                    className={`xai-direction ${getDirectionClass(
                      factor.factorDirection
                    )}`}
                  >
                    {getDirectionLabel(factor.factorDirection)}
                  </span>
                </div>

                <div className="xai-importance">
                  <span>영향도</span>

                  <strong>
                    {Number(factor.importanceScore || 0).toFixed(3)}
                  </strong>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="panel xai-model-panel">
        <div className="section-heading">
          <div>
            <span className="section-label">MODEL</span>
            <h2>평가 모델 정보</h2>
          </div>
        </div>

        <div className="model-detail-grid">
          <div>
            <span>모델 버전</span>
            <strong>XGBOOST_V1</strong>
          </div>

          <div>
            <span>평가 상태</span>
            <strong>
              {evaluation.evaluationStatus === "COMPLETED"
                ? "평가 완료"
                : evaluation.evaluationStatus}
            </strong>
          </div>

          <div>
            <span>Thin Filer</span>
            <strong>
              {evaluation.thinFilerStatus === "THIN"
                ? "Thin Filer"
                : "일반"}
            </strong>
          </div>
        </div>
      </section>

      <div className="result-actions">
        <Link
          to={`/evaluations/${evaluationId}`}
          className="secondary-button"
        >
          평가 결과로 돌아가기
        </Link>

        <Link
          to="/history"
          className="primary-button"
        >
          평가 이력 보기
        </Link>
      </div>
    </div>
  );
}

export default ExplanationDetail;