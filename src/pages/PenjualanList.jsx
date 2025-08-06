import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PenjualanList() {
  const [penjualan, setPenjualan] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/penjualan")
      .then((res) => {
        setPenjualan(res.data);
        fetchStatuses(res.data); // Ambil status pembayaran
      })
      .catch((err) => console.error("Gagal ambil data penjualan:", err));
  }, []);

  const fetchStatuses = async (list) => {
    const newStatusMap = {};
    await Promise.all(
      list.map(async (item) => {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/pembayaran/${item.id}`
          );
          newStatusMap[item.id] = res.data.status;
        } catch (err) {
          console.error(
            `Gagal ambil status untuk penjualan ID ${item.id}`,
            err
          );
        }
      })
    );
    setStatusMap(newStatusMap);
  };

  const formatDate = (tanggal) => {
    const [year, month, day] = tanggal.split("-");
    return `${day}-${month}-${year}`;
  };

  const filteredPenjualan = penjualan.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mt-5">
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-receipt-cutoff me-2"></i>
            <strong>Data Penjualan</strong>
          </div>
          <span className="badge bg-light text-primary">
            Total: {filteredPenjualan.length} Data
          </span>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Cari nomor transaksi / tanggal / angka..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredPenjualan.length === 0 ? (
            <p className="text-muted fst-italic">
              Tidak ditemukan data yang cocok.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered align-middle">
                <thead className="table-primary text-center">
                  <tr>
                    <th style={{ width: "5%" }}>No</th>
                    <th>Nomor Transaksi</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th style={{ width: "100px" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPenjualan.map((p, index) => (
                    <tr key={p.id}>
                      <td className="text-center">{index + 1}</td>
                      <td>{p.transaction_number}</td>
                      <td>{formatDate(p.date)}</td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            statusMap[p.id] === "LUNAS"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {statusMap[p.id] || "Memuat..."}
                        </span>
                      </td>
                      <td className="text-center">
                        <Link
                          to={`/pembayaran/${p.id}`}
                          className={`btn btn-sm ${
                            statusMap[p.id] === "LUNAS"
                              ? "btn-outline-success"
                              : "btn-outline-primary"
                          }`}
                        >
                          {statusMap[p.id] === "LUNAS" ? "Detail" : "Bayar"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PenjualanList;
