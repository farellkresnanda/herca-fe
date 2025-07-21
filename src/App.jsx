import { Routes, Route, Link } from "react-router-dom";
import KomisiList from "./pages/KomisiList";
import PembayaranDetail from "./pages/PembayaranDetail";
import PenjualanList from "./pages/PenjualanList";

function App() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Sistem Komisi
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Komisi
                </Link>
                <Link className="nav-link" to="/penjualan">
                  List Penjualan
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="bg-light min-vh-100">
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
