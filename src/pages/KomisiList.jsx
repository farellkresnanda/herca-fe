import React, { useEffect, useState } from "react";
import axios from "axios";

function KomisiList() {
  const [komisiData, setKomisiData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/komisi")
      .then((res) => setKomisiData(res.data))
      .catch((err) => console.error("Gagal ambil data komisi:", err));
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow border-0">
        <div className="card-body">
          <h3 className="card-title mb-4">Daftar Komisi Marketing</h3>

          {komisiData.length === 0 ? (
            <p className="text-muted fst-italic">Belum ada data komisi.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Marketing</th>
                    <th>Bulan</th>
                    <th>Omzet</th>
                    <th>Komisi (%)</th>
                    <th>Komisi (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {komisiData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td> {/* Nomor urut */}
                      <td>{item.marketing}</td>
                      <td>{item.bulan}</td>
                      <td>Rp {parseInt(item.omzet).toLocaleString("id-ID")}</td>
                      <td>{item.komisi_persen}</td>
                      <td>Rp {parseInt(item.komisi_nominal).toLocaleString("id-ID")}</td>
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

export default KomisiList;
