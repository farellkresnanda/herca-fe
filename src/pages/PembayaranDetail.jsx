import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function PembayaranDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [bayarJumlah, setBayarJumlah] = useState("");
  const [bayarTanggal, setBayarTanggal] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const fetchData = () => {
    axios
      .get(`http://localhost:8000/api/pembayaran/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Gagal ambil data pembayaran:", err));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/pembayaran", {
        penjualan_id: data.penjualan.id,
        tanggal_bayar: bayarTanggal,
        jumlah_bayar: bayarJumlah,
      })
      .then(() => {
        alert("Pembayaran berhasil disimpan");
        setBayarJumlah("");
        fetchData();
      })
      .catch((err) => {
        console.error("Gagal menyimpan pembayaran:", err);
        alert("Gagal menyimpan pembayaran");
      });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("STRUK PEMBAYARAN", 105, 15, null, null, "center");

    doc.setFontSize(11);
    doc.text(`Nomor Transaksi: ${data.penjualan.transaction_number}`, 14, 30);
    doc.text(`Tanggal Transaksi: ${data.penjualan.date}`, 14, 38);
    doc.text(`Status: ${data.status}`, 14, 46);

    autoTable(doc, {
      startY: 55,
      head: [["Ongkir", "Total Balance", "Grand Total"]],
      body: [
        [
          `Rp ${parseInt(data.penjualan.cargo_fee).toLocaleString("id-ID")}`,
          `Rp ${parseInt(data.penjualan.total_balance).toLocaleString(
            "id-ID"
          )}`,
          `Rp ${parseInt(data.penjualan.grand_total).toLocaleString("id-ID")}`,
        ],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Tanggal Bayar", "Jumlah Bayar"]],
      body: data.riwayat.map((item) => [
        item.tanggal_bayar,
        `Rp ${parseInt(item.jumlah_bayar).toLocaleString("id-ID")}`,
      ]),
    });

    doc.text(
      `Total Bayar: Rp ${data.total_bayar.toLocaleString("id-ID")}`,
      14,
      doc.lastAutoTable.finalY + 15
    );
    doc.text(
      `Sisa Tagihan: Rp ${data.sisa_tagihan.toLocaleString("id-ID")}`,
      14,
      doc.lastAutoTable.finalY + 22
    );

    doc.save(`Struk-Pembayaran-${data.penjualan.transaction_number}.pdf`);
  };

  if (!data) return <p className="text-center mt-4">Memuat data...</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 bg-white">
        <div className="card-header bg-primary text-white rounded-top-4 d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Detail Pembayaran</h4>
          <span
            className={`badge ${
              data.status === "LUNAS" ? "bg-success" : "bg-warning text-dark"
            }`}
          >
            {data.status}
          </span>
        </div>

        <div className="card-body">
          <h5 className="text-muted mb-3">Penjualan #{data.penjualan.id}</h5>

          <table className="table table-bordered mb-4">
            <thead className="table-light">
              <tr>
                <th>Transaksi</th>
                <th>Tanggal</th>
                <th>Ongkir</th>
                <th>Total Balance</th>
                <th>Grand Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.penjualan.transaction_number}</td>
                <td>{data.penjualan.date}</td>
                <td>
                  Rp{" "}
                  {parseInt(data.penjualan.cargo_fee).toLocaleString("id-ID")}
                </td>
                <td>
                  Rp{" "}
                  {parseInt(data.penjualan.total_balance).toLocaleString(
                    "id-ID"
                  )}
                </td>
                <td>
                  Rp{" "}
                  {parseInt(data.penjualan.grand_total).toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="row mb-4">
            <div className="col-md-4">
              <strong>Total Tagihan:</strong>
              <br />
              Rp {data.total_tagihan.toLocaleString("id-ID")}
            </div>
            <div className="col-md-4">
              <strong>Total Bayar:</strong>
              <br />
              Rp {data.total_bayar.toLocaleString("id-ID")}
            </div>
            <div className="col-md-4">
              <strong>Sisa Tagihan:</strong>
              <br />
              Rp {data.sisa_tagihan.toLocaleString("id-ID")}
            </div>
          </div>

          <h5 className="mb-3">Riwayat Pembayaran</h5>
          {data.riwayat.length === 0 ? (
            <p className="text-muted fst-italic">Belum ada pembayaran.</p>
          ) : (
            <table className="table table-striped table-bordered mb-4">
              <thead className="table-light">
                <tr>
                  <th>Tanggal Bayar</th>
                  <th>Jumlah Bayar</th>
                </tr>
              </thead>
              <tbody>
                {data.riwayat.map((item) => (
                  <tr key={item.id}>
                    <td>{item.tanggal_bayar}</td>
                    <td>
                      Rp {parseInt(item.jumlah_bayar).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {data.status === "LUNAS" ? (
            <div className="alert alert-success d-flex justify-content-between align-items-center">
              <div>Penjualan sudah LUNAS.</div>
              <button
                className="btn btn-outline-success btn-sm"
                onClick={handleDownloadPDF}
              >
                Download Struk
              </button>
            </div>
          ) : (
            <>
              <h5 className="mb-3">Tambah Pembayaran</h5>
              <form onSubmit={handleSubmit} className="border-top pt-3">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Jumlah Bayar</label>
                    <input
                      type="number"
                      className="form-control"
                      value={bayarJumlah}
                      onChange={(e) => setBayarJumlah(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tanggal Bayar</label>
                    <input
                      type="date"
                      className="form-control"
                      value={bayarTanggal}
                      onChange={(e) => setBayarTanggal(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Simpan Pembayaran
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PembayaranDetail;
