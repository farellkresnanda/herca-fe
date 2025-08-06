import { Routes, Route, Link } from "react-router-dom";
import KomisiList from "./pages/KomisiList";
import PenjualanList from "./pages/PenjualanList";
import PembayaranDetail from "./pages/PembayaranDetail";

function App() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Sistem Komisi
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Komisi
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/penjualan">
                  Penjualan
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="container my-4">
        <Routes>
          <Route path="/" element={<KomisiList />} />
          <Route path="/penjualan" element={<PenjualanList />} />
          <Route path="/pembayaran/:id" element={<PembayaranDetail />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
