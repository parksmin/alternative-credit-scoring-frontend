import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomer } from "../api/customerApi";
import { createEvaluation } from "../api/evaluationApi";

function CustomerEvaluation() {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState("1");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!customerId) {
      setError("고객 ID를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getCustomer(customerId);
      setCustomer(data);
    } catch (err) {
      setCustomer(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

 async function handleEvaluation() {
  if (!customer) return;

  setEvaluating(true);
  setError("");

  try {
    const result = await createEvaluation(
      customer.customerId
    );

    navigate(`/evaluations/${result.evaluationId}`);
  } catch (err) {
    setError(err.message);
  } finally {
    setEvaluating(false);
  }
}

  return (
    <div>
      <div className="page-header">
        <p className="eyebrow">CUSTOMER EVALUATION</p>
        <h1>고객 평가</h1>
        <p className="page-description">
          고객 정보를 조회하고 신용위험 평가를 실행합니다.
        </p>
      </div>

      {/* Customer Search */}
      <section className="panel evaluation-search">
        <div className="panel-header">
          <div>
            <span className="panel-label">CUSTOMER</span>
            <h3>고객 조회</h3>
          </div>
        </div>

        <div className="search-form">
          <div className="input-group">
            <label htmlFor="customerId">고객 ID</label>

            <input
              id="customerId"
              type="number"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="고객 ID를 입력하세요"
            />
          </div>

          <button
            className="primary-button search-button"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "조회 중..." : "고객 조회"}
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}
      </section>

      {/* Customer Information */}
      {customer && (
        <section className="panel customer-detail">
          <div className="panel-header">
            <div>
              <span className="panel-label">CUSTOMER INFORMATION</span>
              <h3>고객 정보</h3>
            </div>
          </div>

          <div className="customer-summary">
            <div className="large-avatar">
              {customer.customerName?.charAt(0) || "고"}
            </div>

            <div>
              <h2>{customer.customerName}</h2>
              <p>고객 ID {customer.customerId}</p>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <span>나이</span>
              <strong>{customer.age}세</strong>
            </div>

            <div className="info-item">
              <span>성별</span>
              <strong>{customer.gender}</strong>
            </div>

            <div className="info-item">
              <span>월 소득</span>
              <strong>
                {Number(
                  customer.financialInfo?.monthlyIncome || 0
                ).toLocaleString()}
                원
              </strong>
            </div>

            <div className="info-item">
              <span>부채 비율</span>
              <strong>
                {customer.financialInfo?.debtRatio}
              </strong>
            </div>

            <div className="info-item">
              <span>신용 이력</span>
              <strong>
                {customer.financialInfo?.creditHistoryMonths}개월
              </strong>
            </div>

            <div className="info-item">
              <span>부양가족</span>
              <strong>
                {customer.financialInfo?.numberOfDependents}명
              </strong>
            </div>
          </div>

          <div className="alternative-section">
            <div>
              <span className="panel-label">ALTERNATIVE DATA</span>
              <h3>대안정보</h3>
            </div>

            <div className="alternative-grid">
              <div className="info-item">
                <span>통신비 납부율</span>
                <strong>
                  {(
                    customer.alternativeData?.telecomPaymentRate *
                    100
                  ).toFixed(0)}
                  %
                </strong>
              </div>

              <div className="info-item">
                <span>공과금 납부율</span>
                <strong>
                  {(
                    customer.alternativeData?.utilityPaymentRate *
                    100
                  ).toFixed(0)}
                  %
                </strong>
              </div>

              <div className="info-item">
                <span>소비 일관성</span>
                <strong>
                  {customer.alternativeData?.spendingConsistency}
                </strong>
              </div>

              <div className="info-item">
                <span>정기 결제 횟수</span>
                <strong>
                  {customer.alternativeData?.regularPaymentCount}회
                </strong>
              </div>

              <div className="info-item">
                <span>앱 이용 빈도</span>
                <strong>
                  {customer.alternativeData?.appLoginFrequency}회
                </strong>
              </div>

              <div className="info-item">
                <span>Thin Filer</span>
                <strong>
                  {customer.alternativeData?.isThinFiler
                    ? "해당"
                    : "일반"}
                </strong>
              </div>
            </div>
          </div>

          <div className="evaluation-action">
            <button
              className="primary-button evaluation-button"
              onClick={handleEvaluation}
              disabled={evaluating}
            >
              {evaluating
                ? "평가 진행 중..."
                : "신용위험 평가 실행"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default CustomerEvaluation;