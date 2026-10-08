import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/Layout";
import CustomerEvaluation from "./pages/CustomerEvaluation";
import EvaluationResult from "./pages/EvaluationResult";
import ExplanationDetail from "./pages/ExplanationDetail";
import EvaluationHistory from "./pages/EvaluationHistory";

import { useEffect, useState } from "react";
import { getRecentEvaluations } from "./api/evaluationApi";

import "./App.css";


/* =========================
   Dashboard
========================= */

function Dashboard() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvaluations() {
      try {
        const data = await getRecentEvaluations(10);
        setEvaluations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvaluations();
  }, []);

  const evaluationCount = evaluations.length;

  const averageRisk =
    evaluations.length > 0
      ? evaluations.reduce(
          (sum, evaluation) =>
            sum + Number(evaluation.riskProbabilityPercent || 0),
          0
        ) / evaluations.length
      : 0;

  const lowRiskCount = evaluations.filter(
    (evaluation) => evaluation.riskLevel === "LOW"
  ).length;

  const lowRiskRate =
    evaluations.length > 0
      ? Math.round((lowRiskCount / evaluations.length) * 100)
      : 0;

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

  return (
    <>
      <section className="welcome">
        <div>
          <h2>신용평가 현황을 확인하세요.</h2>

          <p>
            전통 금융정보와 대안정보를 활용한 신용위험 평가 서비스입니다.
          </p>
        </div>

        <Link to="/customers" className="primary-button">
  고객 평가 시작
</Link>
      </section>

      <section className="stats">
        <div className="stat-card">
          <span>최근 평가</span>

          <strong>{evaluationCount}</strong>

          <small>건</small>
        </div>

        <div className="stat-card">
          <span>평균 위험 확률</span>

          <strong>{averageRisk.toFixed(1)}</strong>

          <small>%</small>
        </div>

        <div className="stat-card">
          <span>낮은 위험 평가</span>

          <strong>{lowRiskRate}</strong>

          <small>%</small>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">RECENT EVALUATIONS</span>

              <h3>최근 평가</h3>
            </div>

            <Link to="/history" className="text-button">
  전체 보기 →
</Link>
          </div>

          <div className="evaluation-list">
            {loading && (
              <div className="empty-state">
                <p>최근 평가를 불러오는 중...</p>
              </div>
            )}

            {!loading && error && (
              <div className="empty-state error-state">
                <p>{error}</p>

                <small>
                  FastAPI 서버가 실행 중인지 확인해주세요.
                </small>
              </div>
            )}

            {!loading && !error && evaluations.length === 0 && (
              <div className="empty-state">
                <p>최근 평가 내역이 없습니다.</p>
              </div>
            )}

            {!loading &&
              !error &&
              evaluations.map((evaluation) => (
                <div
                  className="evaluation-row"
                  key={evaluation.evaluationId}
                >
                  <div className="customer">
                    <span className="customer-avatar">
                      {evaluation.customerName?.charAt(0) || "고"}
                    </span>

                    <div>
                      <strong>
                        {evaluation.customerName || "고객"}
                      </strong>

                      <span>
                        고객 ID {evaluation.customerId}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`risk ${getRiskClass(
                      evaluation.riskLevel
                    )}`}
                  >
                    <strong>
                      {Number(
                        evaluation.riskProbabilityPercent || 0
                      ).toFixed(1)}
                      %
                    </strong>

                    <span>
                      {getRiskLabel(evaluation.riskLevel)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="panel model-panel">
          <span className="panel-label">MODEL STATUS</span>

          <h3>모델 상태</h3>

          <div className="model-score">
            <span>AUC</span>

            <strong>0.903</strong>
          </div>

          <div className="model-detail">
            <span>모델 버전</span>

            <strong>XGBOOST_V1</strong>
          </div>

          <div className="model-detail">
            <span>Thin Filer AUC</span>

            <strong>0.917</strong>
          </div>

          <div className="model-detail">
            <span>PSI</span>

            <strong>0.0005</strong>
          </div>
        </div>
      </section>
    </>
  );
}


/* =========================
   History
========================= */

function History() {
  return (
    <>
      <div className="page-header">
        <p className="eyebrow">EVALUATION HISTORY</p>

        <h1>평가 이력</h1>

        <p className="page-description">
          고객의 신용위험 평가 이력을 확인합니다.
        </p>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">
              EVALUATION HISTORY
            </span>

            <h3>평가 이력</h3>
          </div>
        </div>

        <div className="empty-state">
          <p>평가 이력 화면을 준비 중입니다.</p>
        </div>
      </section>
    </>
  );
}


/* =========================
   App
========================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/customers"
            element={<CustomerEvaluation />}
          />

          <Route
            path="/evaluations/:evaluationId"
            element={<EvaluationResult />}
          />

          <Route
            path="/evaluations/:evaluationId/explanation"
            element={<ExplanationDetail />}
          />

          <Route
  path="/history"
  element={<EvaluationHistory />}
/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;