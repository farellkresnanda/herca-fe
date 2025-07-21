import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PenjualanList() {
  const [penjualan, setPenjualan] = useState([]);

  useEffect(() => {
    axios
      .get("/api/penjualan")
      .then((res) => setPenjualan(res.data))
      .catch((err) => console.error("Gagal ambil data penjualan:", err));
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow border-0">
        <div className="card-body">
          <h3 className="card-title mb-4">Daftar Penjualan</h3>

          {penjualan.length === 0 ? (
            <p className="text-muted fst-italic">Belum ada data penjualan.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Nomor Transaksi</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {penjualan.map((p, index) => (
                    <tr key={p.id}>
                      <td>{index + 1}</td>
                      <td>{p.transaction_number}</td>
                      <td>{p.date}</td>
                      <td>
                        <Link
                          to={`/pembayaran/${p.id}`}
                          className="btn btn-sm btn-primary"
                        >
                          Bayar
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
