import React, { useEffect, useState } from "react";
import axios from "axios";

function KomisiList() {
  const [komisiData, setKomisiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/komisi")
      .then((res) => {
        setKomisiData(res.data);
        setFilteredData(res.data);
      })
      .catch((err) => console.error("Gagal ambil data komisi:", err));
  }, []);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();
    const filtered = komisiData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(keyword)
      )
    );
    setFilteredData(filtered);
  }, [searchTerm, komisiData]);

  return (
    <div className="container mt-5">
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-bar-chart-line-fill me-2"></i>
            <strong>Daftar Komisi Marketing</strong>
          </div>
          <span className="badge bg-light text-primary">
            Total: {filteredData.length} Data
          </span>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Cari berdasarkan marketing, bulan, angka, dsb..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredData.length === 0 ? (
            <p className="text-muted fst-italic">
              Tidak ditemukan data yang cocok.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered align-middle">
                <thead className="table-primary">
                  <tr className="text-center">
                    <th style={{ width: "5%" }}>No</th>
                    <th>Marketing</th>
                    <th>Bulan</th>
                    <th>Omzet</th>
                    <th>Komisi (%)</th>
                    <th>Komisi (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item.marketing}</td>
                      <td>{item.bulan}</td>
                      <td>Rp {parseInt(item.omzet).toLocaleString("id-ID")}</td>
                      <td className="text-center">{item.komisi_persen}</td>
                      <td>
                        Rp{" "}
                        {parseInt(item.komisi_nominal).toLocaleString("id-ID")}
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

export default KomisiList;
