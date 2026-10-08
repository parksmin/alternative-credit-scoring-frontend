import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-mark">A</span>
          <span>Alternative Credit</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            대시보드
          </NavLink>

          <NavLink
            to="/customers"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            고객 평가
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            평가 이력
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="model-info">
            <span>현재 모델</span>
            <strong>XGBoost V1</strong>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <p className="eyebrow">ALTERNATIVE CREDIT SCORING</p>
            <h1>대안정보 기반 신용평가</h1>
          </div>

          <div className="header-user">
            <span className="user-avatar">김</span>
            <span>관리자</span>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;