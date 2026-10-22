import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import "./Dashboard.css";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AuthContext } from "../../context/AuthContext";

function Dhome() {
  const [rows, setrows] = useState([]);
  const [data, setData] = useState([]);
  const [Id, setId] = useState();
  const [sales, setSales] = useState();
  const [salesTotal, setSalestotal] = useState();
  const [totalVal, setTotal] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingSearchQuery, setPendingSearchQuery] = useState("");
  const [todayPaid, setTodayPaid] = useState(0);
  const [todayPending, setTodayPending] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    rate: "",
    quantity: "",
    total: "",
    paid: 0,
    pending: 0,
    receivedBy: "",
    mode: "Cash"
  });

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [newPayment, setNewPayment] = useState({
    amount: "",
    date: new Date().toISOString().split('T')[0],
    receivedBy: "",
    mode: "Cash"
  });
  const [settlementSearchQuery, setSettlementSearchQuery] = useState("");
  const [settlementTab, setSettlementTab] = useState("all");
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const Datee = `${year}-${month}-${day}`;
  const [todayDate, setdate] = useState({
    date: Datee,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getData = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/sales`).then((resp) => {
      setrows(resp.data);
    });
  };

  let result;

  const handleChange = (e) => {
    let { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Calculate total
      const rate = parseFloat(name === 'rate' ? value : updated.rate) || 0;
      const quantity = parseFloat(name === 'quantity' ? value : updated.quantity) || 0;
      const total = rate * quantity;

      updated.total = total;
      setTotal(total);

      // Calculate paid and pending
      let paid = parseFloat(name === 'paid' ? value : updated.paid) || 0;
      let pending = parseFloat(name === 'pending' ? value : updated.pending) || 0;

      if (name === 'paid') {
        pending = total - paid;
        if (pending < 0) pending = 0;
        const pendingInput = document.getElementById("pending");
        if (pendingInput) pendingInput.value = pending;
      } else if (name === 'pending') {
        paid = total - pending;
        if (paid < 0) paid = 0;
        const paidInput = document.getElementById("paid");
        if (paidInput) paidInput.value = paid;
      } else {
        // total or other fields changed, update pending based on current paid
        pending = total - paid;
        if (pending < 0) pending = 0;
        const pendingInput = document.getElementById("pending");
        if (pendingInput) pendingInput.value = pending;
      }

      updated.paid = paid;
      updated.pending = pending;

      return updated;
    });
  };

  function sum() {
    const rate = parseFloat(formData.rate) || 0;
    const quantity = parseFloat(formData.quantity) || 0;
    const total = rate * quantity;
    const paid = parseFloat(formData.paid) || 0;
    let pending = total - paid;
    if (pending < 0) pending = 0;

    setTotal(total);
    setFormData((prev) => ({
      ...prev,
      total: total,
      paid: paid,
      pending: pending
    }));

    const pendingInput = document.getElementById("pending");
    if (pendingInput) pendingInput.value = pending;
    const paidInput = document.getElementById("paid");
    if (paidInput) paidInput.value = paid;
  }

  function getsalesData() {
    axios
      .post(`${process.env.REACT_APP_API_URL}/sales-result`, todayDate)
      .then((resp) => {
        setData(resp.data);
        let result = resp.data;
        let sum = result.reduce((curtval, accumulator) => {
          return parseInt(curtval) + parseInt(accumulator.quantity || 0);
        }, 0);
        setSales(sum);
        console.log(sum);
        let totalSum = result.reduce((curtval, accumulator) => {
          return parseInt(curtval) + parseInt(accumulator.total || 0);
        }, 0);
        setSalestotal(totalSum);
        console.log(salesTotal);

        let todayPaidSum = result.reduce((curtval, accumulator) => {
          return parseInt(curtval) + parseInt(accumulator.paid || 0);
        }, 0);
        setTodayPaid(todayPaidSum);

        let todayPendingSum = result.reduce((curtval, accumulator) => {
          return parseInt(curtval) + parseInt(accumulator.pending || 0);
        }, 0);
        setTodayPending(todayPendingSum);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleClick = (value) => {
    document.getElementById("name").value = value.name || "";
    document.getElementById("date").value = value.date || "";
    document.getElementById("rate").value = value.rate || "";
    document.getElementById("quantity").value = value.quantity || "";
    document.getElementById("paid").value = value.paid !== undefined ? value.paid : 0;
    document.getElementById("pending").value = value.pending !== undefined ? value.pending : (value.total || 0);
    const receivedByInput = document.getElementById("receivedBy");
    if (receivedByInput) receivedByInput.value = "";
    const modeInput = document.getElementById("mode");
    if (modeInput) modeInput.value = "Cash";

    setFormData({
      name: value.name || "",
      date: value.date || "",
      rate: value.rate || "",
      quantity: value.quantity || "",
      total: value.total || "",
      paid: value.paid !== undefined ? value.paid : 0,
      pending: value.pending !== undefined ? value.pending : (value.total || 0),
      receivedBy: "",
      mode: "Cash",
      payments: value.payments || []
    });
    setTotal(value.total || 0);
    setId(value._id);
    getData();
  };

  const handleEdit = () => {
    let name = document.getElementById("name").value;
    let date = document.getElementById("date").value;
    let rate = document.getElementById("rate").value;
    let quantity = document.getElementById("quantity").value;
    if (!(name && date && rate && quantity)) {
      toast.error("Fill the Form", {
        autoClose: 1000,
      });
    } else {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/sales-edit/${Id}`,
          formData
        )
        .then((resp) => {
          getData();
          getsalesData();
        });
      toast.success("Updated Succssfully", {
        autoClose: 1000,
      });
    }
    getData();
  };

  const handleDelete = (e, name) => {
    let result = window.confirm(`Are you really want to Delete ${name}`);
    console.log(result);
    if (result) {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/sales-delete/${e}`)
        .then(async (resp) => {
          getData();
          toast.success("Deleted Succssfully", {
            autoClose: 1000,
          });
          await getsalesData();
          document.getElementById("name").value = "";
          document.getElementById("date").value = "";
          document.getElementById("rate").value = "";
          document.getElementById("quantity").value = "";
          document.getElementById("paid").value = 0;
          document.getElementById("pending").value = 0;
        })
        .catch((error) => { });
      getData();
      getsalesData();
    }
  };

  const handleSettlePending = (item) => {
    let result = window.confirm(`Are you sure you want to settle/clear the pending amount for ${item.name}?`);
    if (result) {
      const pendingAmt = item.pending !== undefined ? Number(item.pending) : (Number(item.total) - Number(item.paid || 0));
      const newPmt = {
        amount: pendingAmt,
        date: new Date().toISOString().split('T')[0],
        receivedBy: "Admin",
        mode: "Cash"
      };
      const updatedData = {
        ...item,
        paid: Number(item.total) || 0,
        pending: 0,
        payments: [...(item.payments || []), newPmt]
      };
      axios
        .put(`${process.env.REACT_APP_API_URL}/sales-edit/${item._id}`, updatedData)
        .then(() => {
          getData();
          getsalesData();
          toast.success("Pending amount settled successfully", {
            autoClose: 1000,
          });
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to settle pending amount");
        });
    }
  };

  const handleBlur = () => {
    sum();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !(formData.name && formData.date && formData.rate && formData.quantity)
    ) {
      toast.warn("Fields are empty", {
        autoClose: 1000,
        pauseOnFocusLoss: false,
      });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/sales`, formData)
        .then((resp) => {
          getsalesData();
          getData();
        });
      toast.success("Successfully Saved", {
        autoClose: 1000,
      });
      document.getElementById("name").value = "";
      document.getElementById("date").value = "";
      document.getElementById("rate").value = "";
      document.getElementById("quantity").value = "";
      document.getElementById("paid").value = 0;
      document.getElementById("pending").value = 0;
      const receivedByInput = document.getElementById("receivedBy");
      if (receivedByInput) receivedByInput.value = "";
      const modeInput = document.getElementById("mode");
      if (modeInput) modeInput.value = "Cash";
      document.getElementById("name").focus();
      setFormData({ name: "", date: "", rate: "", quantity: "", total: "", paid: 0, pending: 0, receivedBy: "", mode: "Cash" });
    }
    getData();
  };

  const handleReset = () => {
    document.getElementById("name").value = "";
    document.getElementById("date").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("paid").value = 0;
    document.getElementById("pending").value = 0;
    const receivedByInput = document.getElementById("receivedBy");
    if (receivedByInput) receivedByInput.value = "";
    const modeInput = document.getElementById("mode");
    if (modeInput) modeInput.value = "Cash";
    document.getElementById("name").focus();
    setFormData({ name: "", date: "", rate: "", quantity: "", total: "", paid: 0, pending: 0, receivedBy: "", mode: "Cash" });
  };

  const handleOpenPaymentModal = (sale) => {
    setSelectedSale(sale);
    setNewPayment({
      amount: "",
      date: new Date().toISOString().split('T')[0],
      receivedBy: "",
      mode: "Cash"
    });
    setPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
    setSelectedSale(null);
  };

  const handleAddPayment = () => {
    if (!newPayment.amount || Number(newPayment.amount) <= 0) {
      toast.warn("Please enter a valid amount", { autoClose: 1500 });
      return;
    }
    if (!newPayment.date) {
      toast.warn("Please select a date", { autoClose: 1500 });
      return;
    }
    if (!newPayment.receivedBy.trim()) {
      toast.warn("Please specify who received this payment", { autoClose: 1500 });
      return;
    }

    const paymentAmount = Number(newPayment.amount);
    const currentPending = selectedSale.pending !== undefined ? selectedSale.pending : Number(selectedSale.total || 0);

    if (paymentAmount > currentPending) {
      toast.warn(`Amount cannot exceed the pending amount of Rs. ${currentPending}`, { autoClose: 2000 });
      return;
    }

    const existingPayments = selectedSale.payments || [];
    const updatedPayments = [
      ...existingPayments,
      {
        amount: paymentAmount,
        date: newPayment.date,
        receivedBy: newPayment.receivedBy,
        mode: newPayment.mode
      }
    ];

    const newPaid = Number(selectedSale.paid || 0) + paymentAmount;
    const newPending = Math.max(0, Number(selectedSale.total || 0) - newPaid);

    const updatedSaleData = {
      ...selectedSale,
      paid: newPaid,
      pending: newPending,
      payments: updatedPayments
    };

    axios
      .put(`${process.env.REACT_APP_API_URL}/sales-edit/${selectedSale._id}`, updatedSaleData)
      .then((resp) => {
        toast.success("Payment recorded successfully", { autoClose: 1500 });
        getData();
        getsalesData();
        handleClosePaymentModal();
      })
      .catch((error) => {
        console.error("Failed to record payment:", error);
        toast.error("Failed to record payment");
      });
  };

  const downloadPendingPDF = () => {
    const doc = new jsPDF();

    // Add border/styling
    doc.setDrawColor(220, 220, 220);
    doc.rect(5, 5, 200, 287);

    // Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(220, 53, 69); // Rose/Red theme for pending
    doc.text("LUCKY SHOP", 14, 25);

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("Pending Amount Report", 14, 33);

    // Line separator
    doc.setDrawColor(220, 53, 69);
    doc.setLineWidth(1);
    doc.line(14, 38, 196, 38);

    // Report Info
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const dateStr = new Date().toLocaleString();
    doc.text(`Generated on: ${dateStr}`, 14, 46);

    let filterText = "None (All Pending Records)";
    if (pendingSearchQuery) {
      filterText = `Search: "${pendingSearchQuery}"`;
    }
    doc.text(`Search Filter: ${filterText}`, 14, 52);
    doc.text(`Total Records: ${filteredPendingRows.length}`, 14, 58);

    // Summary Card (Pending Amount)
    const currentPendingTotal = filteredPendingRows.reduce((acc, row) => acc + (row.pending || 0), 0);

    doc.setFillColor(253, 242, 242); // light red
    doc.rect(14, 66, 70, 20, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(220, 53, 69);
    doc.text("TOTAL PENDING", 18, 73);
    doc.setFontSize(12);
    doc.text(`Rs. ${currentPendingTotal}`, 18, 81);

    // AutoTable for pending transactions
    autoTable(doc, {
      head: [['#', 'Customer Name', 'Date', 'Total Amount', 'Paid Amount', 'Pending Amount']],
      body: filteredPendingRows.map((row, idx) => [
        idx + 1,
        row.name || "-",
        row.date || "-",
        `Rs. ${row.total || 0}`,
        `Rs. ${row.paid !== undefined ? row.paid : 0}`,
        `Rs. ${row.pending !== undefined ? row.pending : row.total}`
      ]),
      startY: 92,
      theme: 'striped',
      headStyles: { fillColor: [220, 53, 69], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 32, halign: 'right' },
        4: { cellWidth: 32, halign: 'right' },
        5: { cellWidth: 32, halign: 'right' }
      }
    });

    // Save report
    const filename = `Pending_Amount_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  };

  useEffect(() => {
    getData();
    getsalesData();
  }, []);

  const filteredRows = rows.filter((row) => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    return (
      (row.name && row.name.toLowerCase().includes(term)) ||
      (row.date && row.date.toLowerCase().includes(term)) ||
      (row.rate && row.rate.toString().includes(term)) ||
      (row.quantity && row.quantity.toString().includes(term)) ||
      (row.total && row.total.toString().includes(term)) ||
      (row.paid && row.paid.toString().includes(term)) ||
      (row.pending && row.pending.toString().includes(term))
    );
  });

  const searchTotals = filteredRows.reduce(
    (acc, row) => {
      acc.totalSales += parseFloat(row.total) || 0;
      acc.totalPaid += parseFloat(row.paid) || 0;
      acc.totalPending += parseFloat(row.pending) || 0;
      return acc;
    },
    { totalSales: 0, totalPaid: 0, totalPending: 0 }
  );

  const pendingRows = rows.filter((row) => row.pending > 0);

  const totalPendingAmount = pendingRows.reduce((acc, row) => acc + (row.pending || 0), 0);

  const filteredPendingRows = pendingRows.filter((row) => {
    if (!pendingSearchQuery) return true;
    const term = pendingSearchQuery.toLowerCase();
    return (
      (row.name && row.name.toLowerCase().includes(term)) ||
      (row.date && row.date.toLowerCase().includes(term)) ||
      (row.total && row.total.toString().includes(term)) ||
      (row.paid && row.paid.toString().includes(term)) ||
      (row.pending && row.pending.toString().includes(term))
    );
  });

  const allSettledPayments = rows.flatMap((row) => {
    return (row.payments || []).map((pmt) => ({
      _id: row._id,
      customerName: row.name || "Unknown",
      date: pmt.date || row.date,
      amount: Number(pmt.amount) || 0,
      receivedBy: pmt.receivedBy || "Admin",
      mode: pmt.mode || "Cash",
      paymentId: pmt._id || Math.random().toString()
    }));
  });

  const sortedSettledPayments = [...allSettledPayments].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const filteredSettledPayments = sortedSettledPayments.filter((pmt) => {
    if (settlementTab !== "all" && pmt.mode !== settlementTab) {
      return false;
    }
    if (!settlementSearchQuery) return true;
    const term = settlementSearchQuery.toLowerCase();
    return (
      pmt.customerName.toLowerCase().includes(term) ||
      pmt.date.toLowerCase().includes(term) ||
      pmt.receivedBy.toLowerCase().includes(term) ||
      pmt.mode.toLowerCase().includes(term) ||
      pmt.amount.toString().includes(term)
    );
  });

  const totalCashSettled = allSettledPayments
    .filter((pmt) => pmt.mode === "Cash")
    .reduce((sum, pmt) => sum + pmt.amount, 0);

  const totalOnlineSettled = allSettledPayments
    .filter((pmt) => pmt.mode === "Online")
    .reduce((sum, pmt) => sum + pmt.amount, 0);

  const totalAllSettled = totalCashSettled + totalOnlineSettled;

  const todayCashCollected = allSettledPayments
    .filter((pmt) => pmt.date === Datee && pmt.mode === "Cash")
    .reduce((sum, pmt) => sum + pmt.amount, 0);

  const todayOnlineCollected = allSettledPayments
    .filter((pmt) => pmt.date === Datee && pmt.mode === "Online")
    .reduce((sum, pmt) => sum + pmt.amount, 0);

  return (
    <div className="container-fluid py-4 px-2 px-md-4 dashboard-main">
      <div className="d-flex justify-content-between align-items-center mb-4 header-section">
        <div>
          <h2 className="fw-bold m-0">Daily Entry</h2>
          <p className="text-secondary m-0">Manage daily sales entries, payments, and settlements</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Left column: Entry Form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm modern-card">
            <div className="card-header bg-white py-3 border-bottom border-light">
              <h5 className="m-0 fw-bold text-dark">Add / Edit Sale Record</h5>
            </div>
            <div className="card-body p-4">
              <form method="post" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label fw-bold text-secondary">Customer Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      onChange={handleChange}
                      className="form-control modern-input"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-bold text-secondary">Date</label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      onChange={handleChange}
                      className="form-control modern-input"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-bold text-secondary">Rate (Rs.)</label>
                    <input
                      type="number"
                      name="rate"
                      id="rate"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control modern-input"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-bold text-secondary">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control modern-input"
                      placeholder="0"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-bold text-secondary">Paid Amount (Rs.)</label>
                    <input
                      type="number"
                      name="paid"
                      id="paid"
                      onChange={handleChange}
                      className="form-control modern-input"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-bold text-secondary">Pending Amount (Rs.)</label>
                    <input
                      type="number"
                      name="pending"
                      id="pending"
                      onChange={handleChange}
                      className="form-control modern-input"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-bold text-secondary">Received By</label>
                    <input
                      type="text"
                      name="receivedBy"
                      id="receivedBy"
                      onChange={handleChange}
                      className="form-control modern-input"
                      placeholder="Admin/Staff name"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-bold text-secondary">Payment Mode</label>
                    <select
                      name="mode"
                      id="mode"
                      onChange={handleChange}
                      className="form-select modern-input"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                </div>

                <hr className="my-4 text-light" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="text-secondary fw-semibold">Auto Calculated Total:</span>
                  <h3 className="m-0 text-success fw-extrabold">Total: Rs. {totalVal || 0}</h3>
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-sm-end gap-2 w-100">
                  <Button type="submit" variant="contained" className="py-2 px-4 shadow-sm form-action-btn" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: 'bold', borderRadius: '10px' }}>
                    Save Entry
                  </Button>
                  <Button variant="contained" onClick={handleEdit} className="py-2 px-4 shadow-sm form-action-btn" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', fontWeight: 'bold', borderRadius: '10px' }}>
                    Update
                  </Button>
                  <Button variant="contained" onClick={handleReset} className="py-2 px-4 shadow-sm form-action-btn" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', fontWeight: 'bold', borderRadius: '10px' }}>
                    Reset
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right column: Today's Summary */}
        <div className="col-lg-4 col-md-12">
          <div className="row g-4">
            {/* Sales Stats Card */}
            <div className="col-md-6 col-lg-12">
              <div className="card border-0 shadow-sm stat-card gradient-emerald p-4 text-white">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="fs-6 fw-bold opacity-80 uppercase tracking-wider">Today's Sales Count</span>
                    <h1 className="display-4 fw-bold mt-2 mb-0">{sales || 0}</h1>
                  </div>
                  <div className="icon-wrapper bg-white bg-opacity-20 rounded-3 p-3">
                    <i className="fa-solid fa-basket-shopping fs-2 text-white"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Stats Card */}
            <div className="col-md-6 col-lg-12">
              <div className="card border-0 shadow-sm stat-card gradient-teal p-4 text-white">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="fs-6 fw-bold opacity-80 uppercase tracking-wider">Today's Total Revenue</span>
                    <h2 className="display-6 fw-bold mt-2 mb-0">Rs. {salesTotal || 0}</h2>
                  </div>
                  <div className="icon-wrapper bg-white bg-opacity-20 rounded-3 p-3">
                    <i className="fa-solid fa-indian-rupee-sign fs-2 text-white"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Cash Collected Card */}
            <div className="col-md-6 col-lg-12">
              <div className="card border-0 shadow-sm stat-card gradient-blue p-4 text-white">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="fs-6 fw-bold opacity-80 uppercase tracking-wider">Today's Cash Collected</span>
                    <h2 className="display-6 fw-bold mt-2 mb-0">Rs. {todayCashCollected || 0}</h2>
                  </div>
                  <div className="icon-wrapper bg-white bg-opacity-20 rounded-3 p-3">
                    <i className="fa-solid fa-wallet fs-2 text-white"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Online Collected Card */}
            <div className="col-md-6 col-lg-12">
              <div className="card border-0 shadow-sm stat-card gradient-purple p-4 text-white">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="fs-6 fw-bold opacity-80 uppercase tracking-wider">Today's Online Collected</span>
                    <h2 className="display-6 fw-bold mt-2 mb-0">Rs. {todayOnlineCollected || 0}</h2>
                  </div>
                  <div className="icon-wrapper bg-white bg-opacity-20 rounded-3 p-3">
                    <i className="fa-solid fa-globe fs-2 text-white"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Amount Card */}
            <div className="col-md-6 col-lg-12">
              <div className="card border-0 shadow-sm stat-card gradient-rose p-4 text-white">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="fs-6 fw-bold opacity-80 uppercase tracking-wider">Pending Sales Amount</span>
                    <h2 className="display-6 fw-bold mt-2 mb-0">Rs. {totalPendingAmount || 0}</h2>
                    <span className="fs-7 opacity-75 mt-1 d-block">Today's Pending: Rs. {todayPending || 0}</span>
                  </div>
                  <div className="icon-wrapper bg-white bg-opacity-20 rounded-3 p-3">
                    <i className="fa-solid fa-clock-rotate-left fs-2 text-white"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card border-0 shadow-sm table-card">
        <div className="card-header bg-white py-3 border-bottom border-light d-flex flex-column flex-md-row justify-content-md-between align-items-md-center align-items-stretch gap-3">
          <h5 className="m-0 fw-bold text-dark text-center text-md-start">Recent Sales History</h5>
          <div className="d-flex align-items-center gap-2" style={{ maxWidth: '350px', flex: '1' }}>
            <input
              type="text"
              className="form-control modern-input py-1 px-3"
              placeholder="🔍 Search sales history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSearchQuery("")}
                style={{ borderRadius: '8px' }}
              >
                Clear
              </button>
            )}
          </div>
          <div className="text-center text-md-end">
            <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill fw-semibold">
              {searchQuery ? `${filteredRows.length} of ${rows.length}` : rows.length} Records
            </span>
          </div>
        </div>
        {searchQuery && (
          <div className="search-summary-banner d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 p-2 rounded-circle">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <div>
                <span className="text-secondary fs-7 fw-bold uppercase d-block" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Search Query Active</span>
                <span className="text-dark fw-bold">Showing results for: "{searchQuery}"</span>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-4 align-items-center justify-content-start justify-content-md-end">
              <div>
                <span className="text-secondary d-block" style={{ fontSize: '0.75rem', fontWeight: '600' }}>Total Sales</span>
                <span className="text-dark fw-extrabold fs-5">Rs. {searchTotals.totalSales.toFixed(2)}</span>
              </div>
              <div className="border-start ps-3">
                <span className="text-success d-block" style={{ fontSize: '0.75rem', fontWeight: '600' }}>Total Cash In</span>
                <span className="text-success fw-extrabold fs-5">Rs. {searchTotals.totalPaid.toFixed(2)}</span>
              </div>
              <div className="border-start ps-3">
                <span className="text-danger d-block" style={{ fontSize: '0.75rem', fontWeight: '600' }}>Pending Amount</span>
                <span className="text-danger fw-extrabold fs-5">Rs. {searchTotals.totalPending.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
        <div className="card-body p-0">
          <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table className="table table-hover align-middle mb-0 modern-table">
              <thead className="table-light sticky-top">
                <tr>
                  <th scope="col" className="ps-4">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Date</th>
                  <th scope="col" className="text-end">Rate</th>
                  <th scope="col" className="text-end">Quantity</th>
                  <th scope="col" className="text-end">Total</th>
                  <th scope="col" className="text-end">Paid</th>
                  <th scope="col" className="text-center">Status / Pending</th>
                  <th scope="col" className="text-center pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((value, index) => {
                  const isSettled = value.pending === 0 || (value.total - (value.paid || 0) <= 0);
                  return (
                    <tr
                      key={value._id}
                      onClick={() => handleClick(value)}
                      className="table-row-item"
                      style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                    >
                      <th scope="row" className="ps-4 text-secondary">{index + 1}</th>
                      <td className="fw-semibold text-dark">{value.name}</td>
                      <td>{value.date}</td>
                      <td className="text-end text-muted">Rs. {value.rate}</td>
                      <td className="text-end fw-medium">{value.quantity}</td>
                      <td className="text-end fw-bold text-dark">Rs. {value.total}</td>
                      <td className="text-end text-success fw-medium">Rs. {value.paid !== undefined ? value.paid : 0}</td>
                      <td className="text-center">
                        {isSettled ? (
                          <span className="badge-settled">Amount Settled</span>
                        ) : (
                          <span className="badge-pending">
                            Pending: Rs. {value.pending !== undefined ? value.pending : value.total}
                          </span>
                        )}
                      </td>
                      <td className="text-center pe-4 d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-circle p-2"
                          title="View & Add Payments"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPaymentModal(value);
                          }}
                          style={{
                            width: '34px',
                            height: '34px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #dbeafe',
                            color: '#3b82f6',
                            backgroundColor: '#fff',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <i className="fa-solid fa-wallet" style={{ fontSize: '14px' }}></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-circle p-2 action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(value._id, value.name);
                          }}
                          style={{ margin: 0 }}
                        >
                          <i className="fa-solid fa-trash-can" style={{ fontSize: '14px' }}></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pending Amount Table Section */}
      <div className="card border-0 shadow-sm table-card">
        <div className="card-header bg-white py-3 border-bottom border-light d-flex flex-column flex-md-row justify-content-md-between align-items-md-center align-items-stretch gap-3">
          <h5 className="m-0 fw-bold text-dark text-center text-md-start">Pending Amount List</h5>
          <div className="d-flex align-items-center gap-2" style={{ maxWidth: '350px', flex: '1' }}>
            <input
              type="text"
              className="form-control modern-input py-1 px-3"
              placeholder="🔍 Search pending list..."
              value={pendingSearchQuery}
              onChange={(e) => setPendingSearchQuery(e.target.value)}
            />
            {pendingSearchQuery && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setPendingSearchQuery("")}
                style={{ borderRadius: '8px' }}
              >
                Clear
              </button>
            )}
          </div>
          <div className="d-flex flex-wrap justify-content-center justify-content-md-end align-items-center gap-2">
            <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-20 px-3 py-2 rounded-pill fw-bold">
              Total Pending: Rs. {totalPendingAmount}
            </span>
            <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill fw-semibold">
              {pendingSearchQuery ? `${filteredPendingRows.length} of ${pendingRows.length}` : pendingRows.length} Records
            </span>
            <Button
              variant="contained"
              onClick={downloadPendingPDF}
              disabled={filteredPendingRows.length === 0}
              className="pdf-download-btn shadow-sm"
              startIcon={<i className="fa-solid fa-file-pdf"></i>}
            >
              Download PDF
            </Button>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table className="table table-hover align-middle mb-0 modern-table">
              <thead className="table-light sticky-top">
                <tr>
                  <th scope="col" className="ps-4">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Date</th>
                  <th scope="col" className="text-end">Total</th>
                  <th scope="col" className="text-end">Paid</th>
                  <th scope="col" className="text-center">Pending Amount</th>
                  <th scope="col" className="text-center pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPendingRows.map((value, index) => {
                  return (
                    <tr
                      key={value._id}
                      onClick={() => handleClick(value)}
                      className="table-row-item"
                      style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                    >
                      <th scope="row" className="ps-4 text-secondary">{index + 1}</th>
                      <td className="fw-semibold text-dark">{value.name}</td>
                      <td>{value.date}</td>
                      <td className="text-end fw-bold text-dark">Rs. {value.total}</td>
                      <td className="text-end text-success fw-medium">Rs. {value.paid !== undefined ? value.paid : 0}</td>
                      <td className="text-center">
                        <span className="badge-pending">
                          Pending: Rs. {value.pending !== undefined ? value.pending : value.total}
                        </span>
                      </td>
                      <td className="text-center pe-4 d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-circle p-2"
                          title="View & Add Payments"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPaymentModal(value);
                          }}
                          style={{
                            width: '34px',
                            height: '34px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #dbeafe',
                            color: '#3b82f6',
                            backgroundColor: '#fff',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <i className="fa-solid fa-wallet" style={{ fontSize: '14px' }}></i>
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm rounded-circle p-2 action-btn-success"
                          title="Settle pending amount"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSettlePending(value);
                          }}
                          style={{ margin: 0 }}
                        >
                          <i className="fa-solid fa-check" style={{ fontSize: '14px' }}></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredPendingRows.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-secondary">
                      No pending records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Settlements Table Section */}
      <div className="card border-0 shadow-sm table-card mt-4">
        <div className="card-header bg-white py-3 border-bottom border-light d-flex flex-column flex-md-row justify-content-md-between align-items-md-center align-items-stretch gap-3">
          <div>
            <h5 className="m-0 fw-bold text-dark text-center text-md-start">Payment Settlements History</h5>
            <p className="text-secondary m-0 fs-7 text-center text-md-start">View payments settled via Cash and Online modes</p>
          </div>

          <div className="d-flex align-items-center gap-2" style={{ maxWidth: '350px', flex: '1' }}>
            <input
              type="text"
              className="form-control modern-input py-1 px-3"
              placeholder="🔍 Search settlements..."
              value={settlementSearchQuery}
              onChange={(e) => setSettlementSearchQuery(e.target.value)}
            />
            {settlementSearchQuery && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSettlementSearchQuery("")}
                style={{ borderRadius: '8px' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection & Mini Stats */}
        <div className="p-3 bg-light border-bottom d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
          {/* Custom segment control tabs */}
          <div className="d-flex bg-white p-1 rounded-3 border align-self-start" style={{ gap: '2px' }}>
            <button
              onClick={() => setSettlementTab("all")}
              className={`btn btn-sm border-0 px-3 py-1.5 fw-semibold ${settlementTab === 'all' ? 'bg-primary text-white shadow-sm' : 'text-secondary bg-transparent'}`}
              style={{ borderRadius: '6px', fontSize: '0.85rem' }}
            >
              All ({allSettledPayments.length})
            </button>
            <button
              onClick={() => setSettlementTab("Cash")}
              className={`btn btn-sm border-0 px-3 py-1.5 fw-semibold ${settlementTab === 'Cash' ? 'bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}
              style={{ borderRadius: '6px', fontSize: '0.85rem' }}
            >
              💵 Cash ({allSettledPayments.filter(p => p.mode === 'Cash').length})
            </button>
            <button
              onClick={() => setSettlementTab("Online")}
              className={`btn btn-sm border-0 px-3 py-1.5 fw-semibold ${settlementTab === 'Online' ? 'bg-info text-white shadow-sm' : 'text-secondary bg-transparent'}`}
              style={{ borderRadius: '6px', fontSize: '0.85rem' }}
            >
              🌐 Online ({allSettledPayments.filter(p => p.mode === 'Online').length})
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div className="px-3 py-1.5 rounded-3 bg-success bg-opacity-10 text-success border border-success border-opacity-20 d-flex align-items-center gap-2">
              <span className="fs-7 fw-semibold text-secondary">Total Cash:</span>
              <strong className="fs-6">Rs. {totalCashSettled}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-3 bg-info bg-opacity-10 text-info border border-info border-opacity-20 d-flex align-items-center gap-2">
              <span className="fs-7 fw-semibold text-secondary">Total Online:</span>
              <strong className="fs-6">Rs. {totalOnlineSettled}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-3 bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 d-flex align-items-center gap-2">
              <span className="fs-7 fw-semibold text-secondary">Combined:</span>
              <strong className="fs-6">Rs. {totalAllSettled}</strong>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table className="table table-hover align-middle mb-0 modern-table">
              <thead className="table-light sticky-top">
                <tr>
                  <th scope="col" className="ps-4">#</th>
                  <th scope="col">Date</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col" className="text-center">Payment Mode</th>
                  <th scope="col">Received By</th>
                  <th scope="col" className="text-end pe-4">Settled Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredSettledPayments.map((pmt, index) => (
                  <tr
                    key={pmt.paymentId}
                    className="table-row-item"
                    style={{ transition: 'background-color 0.2s' }}
                  >
                    <th scope="row" className="ps-4 text-secondary">{index + 1}</th>
                    <td>{pmt.date}</td>
                    <td className="fw-semibold text-dark">{pmt.customerName}</td>
                    <td className="text-center">
                      <span className={`badge ${pmt.mode === 'Online' ? 'bg-primary' : 'bg-success'} bg-opacity-10 text-opacity-100 ${pmt.mode === 'Online' ? 'text-primary' : 'text-success'} px-3 py-1.5 rounded-pill fw-bold`}>
                        {pmt.mode === 'Online' ? '🌐 Online' : '💵 Cash'}
                      </span>
                    </td>
                    <td>{pmt.receivedBy}</td>
                    <td className="text-end fw-bold text-success pe-4">Rs. {pmt.amount}</td>
                  </tr>
                ))}
                {filteredSettledPayments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-secondary">
                      No settlement records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Outlet />

      {/* Payment History & Installment Management Modal */}
      <Dialog
        open={paymentModalOpen}
        onClose={handleClosePaymentModal}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          style: {
            borderRadius: isMobile ? '0' : '16px',
            padding: isMobile ? '8px' : '16px',
            fontFamily: "'Inter', sans-serif"
          }
        }}
      >
        <DialogTitle className="fw-bold pb-2 text-dark border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-1 gap-sm-2">
            <span className="fs-5">💳 Payment Management</span>
            <span className="fs-7 text-secondary fw-normal">
              Customer: <strong className="text-dark">{selectedSale?.name}</strong>
            </span>
          </div>
          <button
            onClick={handleClosePaymentModal}
            className="btn-close ms-2"
            aria-label="Close"
            style={{ fontSize: '0.85rem' }}
          ></button>
        </DialogTitle>

        <DialogContent className="pt-4">
          <div className="row g-4">
            {/* Sale Stats Overview */}
            <div className="col-12">
              <div className="p-3 rounded-3 bg-light border d-flex flex-wrap justify-content-around align-items-center gap-3">
                <div className="text-center">
                  <span className="text-secondary fs-7 d-block uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Total Amount</span>
                  <span className="fw-extrabold fs-5 text-dark">Rs. {selectedSale?.total}</span>
                </div>
                <div className="text-center border-start ps-3 ps-md-5">
                  <span className="text-success fs-7 d-block uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Total Paid</span>
                  <span className="fw-extrabold fs-5 text-success">Rs. {selectedSale?.paid !== undefined ? selectedSale?.paid : 0}</span>
                </div>
                <div className="text-center border-start ps-3 ps-md-5">
                  <span className="text-danger fs-7 d-block uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Remaining Pending</span>
                  <span className="fw-extrabold fs-5 text-danger">Rs. {selectedSale?.pending !== undefined ? selectedSale?.pending : selectedSale?.total}</span>
                </div>
              </div>
            </div>

            {/* Payment History List */}
            <div className="col-md-7 pe-md-4 payment-modal-history">
              <h6 className="fw-bold mb-3 text-dark">Payment History</h6>
              <div className="table-responsive" style={{ maxHeight: '250px' }}>
                <table className="table table-sm align-middle table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th className="text-end">Amount</th>
                      <th>Received By</th>
                      <th>Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale?.payments && selectedSale.payments.length > 0 ? (
                      selectedSale.payments.map((pmt, idx) => (
                        <tr key={idx}>
                          <td>{pmt.date}</td>
                          <td className="text-end fw-bold text-success">Rs. {pmt.amount}</td>
                          <td>{pmt.receivedBy || "Admin"}</td>
                          <td>
                            <span className={`badge ${pmt.mode === 'Online' ? 'bg-primary' : 'bg-success'} bg-opacity-10 text-opacity-100 ${pmt.mode === 'Online' ? 'text-primary' : 'text-success'} px-2 py-1`}>
                              {pmt.mode || "Cash"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-secondary fs-7">
                          No partial payments recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Record New Payment Form */}
            <div className="col-md-5 ps-md-4 payment-modal-form">
              <h6 className="fw-bold mb-3 text-dark">Record New Payment</h6>
              {(selectedSale?.pending === 0 || (Number(selectedSale?.total) - Number(selectedSale?.paid || 0) <= 0)) ? (
                <div className="alert alert-success d-flex align-items-center gap-2 py-2" role="alert">
                  <i className="fa-solid fa-circle-check fs-5"></i>
                  <span className="fs-7">This sale is fully paid!</span>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>Payment Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm modern-input"
                      value={newPayment.date}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>Amount Paid (Rs.)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm modern-input"
                      placeholder="Enter amount"
                      max={selectedSale?.pending}
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>Received By</label>
                    <input
                      type="text"
                      className="form-control form-control-sm modern-input"
                      placeholder="Receiver name"
                      value={newPayment.receivedBy}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, receivedBy: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>Payment Mode</label>
                    <select
                      className="form-select form-select-sm modern-input"
                      value={newPayment.mode}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, mode: e.target.value }))}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                  <Button
                    variant="contained"
                    onClick={handleAddPayment}
                    className="w-100 py-2 mt-2"
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      textTransform: 'none'
                    }}
                  >
                    Record Payment
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>

        <DialogActions className="border-top pt-2">
          <Button onClick={handleClosePaymentModal} className="text-secondary fw-bold" style={{ textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dhome;
