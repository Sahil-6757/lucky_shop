import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Dashboard.css";
import { Button } from "@mui/material";

const DVechical = () => {
  const [rows, setrows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalVal, setTotal] = useState(0);

  // Installment history states
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [instAmount, setInstAmount] = useState("");
  const [instDate, setInstDate] = useState(new Date().toISOString().split("T")[0]);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    totalAmount: "",
    paidAmount: "",
    pendingAmount: 0,
  });

  // Fetch all vehicle records
  const getData = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/vehical`)
      .then((resp) => {
        setrows(resp.data);
        // Refresh selected vehicle in case data has updated
        if (selectedVehicle) {
          const updatedSelected = resp.data.find((v) => v._id === selectedVehicle._id);
          if (updatedSelected) {
            setSelectedVehicle(updatedSelected);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching vehicle data:", error);
        toast.error("Failed to fetch vehicle records");
      });
  };

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      const totalAmount = parseFloat(name === "totalAmount" ? value : updated.totalAmount) || 0;
      const paidAmount = parseFloat(name === "paidAmount" ? value : updated.paidAmount) || 0;
      const pendingAmount = totalAmount - paidAmount;

      updated.pendingAmount = pendingAmount >= 0 ? pendingAmount : 0;
      setTotal(totalAmount);

      return updated;
    });
  };

  // Perform sum calculation for blur event
  const calculatePending = () => {
    const totalAmount = parseFloat(formData.totalAmount) || 0;
    const paidAmount = parseFloat(formData.paidAmount) || 0;
    let pendingAmount = totalAmount - paidAmount;
    if (pendingAmount < 0) pendingAmount = 0;

    setFormData((prev) => ({
      ...prev,
      pendingAmount: pendingAmount,
    }));
  };

  // Handle row selection for editing and installment viewing
  const handleEditClick = (value) => {
    setFormData({
      name: value.name || "",
      date: value.date || "",
      totalAmount: value.totalAmount !== undefined ? value.totalAmount : "",
      paidAmount: value.paidAmount !== undefined ? value.paidAmount : "",
      pendingAmount: value.pendingAmount !== undefined ? value.pendingAmount : 0,
    });
    setEditingId(value._id);
    setSelectedVehicle(value);
    setInstAmount("");
    setInstDate(new Date().toISOString().split("T")[0]);
  };

  // Update existing record
  const handleUpdate = () => {
    if (!(formData.name && formData.date && formData.totalAmount)) {
      toast.error("Please fill Name, Date and Total Amount fields", {
        autoClose: 2000,
        position: "bottom-center",
      });
      return;
    }

    const payload = {
      ...formData,
      totalAmount: Number(formData.totalAmount) || 0,
      paidAmount: Number(formData.paidAmount) || 0,
      pendingAmount: Number(formData.pendingAmount) || 0,
      payments: selectedVehicle ? selectedVehicle.payments : [],
    };

    axios
      .put(`${process.env.REACT_APP_API_URL}/vehical/${editingId}`, payload)
      .then((resp) => {
        getData();
        handleReset();
        toast.success("Vehicle Bill updated successfully", {
          autoClose: 2000,
          position: "bottom-center",
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update vehicle record");
      });
  };

  // Add Installment Payment
  const handleAddInstallment = () => {
    const amount = parseFloat(instAmount);
    if (!amount || amount <= 0) {
      toast.warn("Please enter a valid installment amount", {
        autoClose: 2000,
        position: "bottom-center",
      });
      return;
    }

    if (amount > selectedVehicle.pendingAmount) {
      toast.error(`Installment amount cannot exceed the pending amount (Rs. ${selectedVehicle.pendingAmount})`, {
        autoClose: 2000,
        position: "bottom-center",
      });
      return;
    }

    const newPaid = (selectedVehicle.paidAmount || 0) + amount;
    const newPending = selectedVehicle.totalAmount - newPaid;
    const newPayment = {
      amount: amount,
      date: instDate || new Date().toISOString().split("T")[0],
    };
    const updatedPayments = [...(selectedVehicle.payments || []), newPayment];

    const payload = {
      name: selectedVehicle.name,
      date: selectedVehicle.date,
      totalAmount: selectedVehicle.totalAmount,
      paidAmount: newPaid,
      pendingAmount: newPending >= 0 ? newPending : 0,
      payments: updatedPayments,
    };

    axios
      .put(`${process.env.REACT_APP_API_URL}/vehical/${selectedVehicle._id}`, payload)
      .then((resp) => {
        getData();
        setSelectedVehicle(resp.data);
        // Sync editing form fields if currently editing this vehicle
        if (editingId === selectedVehicle._id) {
          setFormData({
            name: resp.data.name,
            date: resp.data.date,
            totalAmount: resp.data.totalAmount,
            paidAmount: resp.data.paidAmount,
            pendingAmount: resp.data.pendingAmount,
          });
        }
        setInstAmount("");
        toast.success("Installment payment added successfully", {
          autoClose: 2000,
          position: "bottom-center",
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to add installment payment");
      });
  };

  // Delete record
  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the bill for vehicle: ${name}?`);
    if (confirmDelete) {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/vehical/${id}`)
        .then(() => {
          getData();
          toast.success("Vehicle Bill deleted successfully", {
            autoClose: 2000,
            position: "bottom-center",
          });
          if (editingId === id || (selectedVehicle && selectedVehicle._id === id)) {
            handleReset();
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete record");
        });
    }
  };

  // Settle pending amount (mark as fully paid and record installment)
  const handleSettlePending = (item) => {
    const confirmSettle = window.confirm(`Are you sure you want to settle/clear the pending amount for ${item.name}?`);
    if (confirmSettle) {
      const remaining = Number(item.totalAmount) - Number(item.paidAmount);
      const newPayment = {
        amount: remaining,
        date: new Date().toISOString().split("T")[0],
      };
      const updatedPayments = [...(item.payments || []), newPayment];

      const updatedData = {
        ...item,
        paidAmount: Number(item.totalAmount) || 0,
        pendingAmount: 0,
        payments: updatedPayments,
      };

      axios
        .put(`${process.env.REACT_APP_API_URL}/vehical/${item._id}`, updatedData)
        .then((resp) => {
          getData();
          if (selectedVehicle && selectedVehicle._id === item._id) {
            setSelectedVehicle(resp.data);
            if (editingId === item._id) {
              setFormData({
                name: resp.data.name,
                date: resp.data.date,
                totalAmount: resp.data.totalAmount,
                paidAmount: resp.data.paidAmount,
                pendingAmount: resp.data.pendingAmount,
              });
            }
          }
          toast.success("Pending amount settled successfully", {
            autoClose: 2000,
            position: "bottom-center",
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to settle pending amount");
        });
    }
  };

  // Submit new record
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!(formData.name && formData.date && formData.totalAmount)) {
      toast.warn("Required fields are empty", {
        autoClose: 2000,
        position: "bottom-center",
      });
      return;
    }

    const payload = {
      name: formData.name,
      date: formData.date,
      totalAmount: Number(formData.totalAmount) || 0,
      paidAmount: Number(formData.paidAmount) || 0,
      pendingAmount: Number(formData.pendingAmount) || 0,
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/vehical`, payload)
      .then(() => {
        getData();
        handleReset();
        toast.success("Vehicle Bill saved successfully", {
          autoClose: 2000,
          position: "bottom-center",
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to save vehicle bill");
      });
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: "",
      date: "",
      totalAmount: "",
      paidAmount: "",
      pendingAmount: 0,
    });
    setEditingId(null);
    setSelectedVehicle(null);
    setTotal(0);
    setInstAmount("");
    setInstDate(new Date().toISOString().split("T")[0]);
  };

  useEffect(() => {
    getData();
  }, []);

  // Filter rows by search query
  const filteredRows = rows.filter((row) => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    return (
      (row.name && row.name.toLowerCase().includes(term)) ||
      (row.date && row.date.toLowerCase().includes(term)) ||
      (row.totalAmount && row.totalAmount.toString().includes(term)) ||
      (row.paidAmount && row.paidAmount.toString().includes(term)) ||
      (row.pendingAmount && row.pendingAmount.toString().includes(term))
    );
  });

  // Calculate totals
  const totalAmountSum = rows.reduce((acc, row) => acc + (parseFloat(row.totalAmount) || 0), 0);
  const totalPaidSum = rows.reduce((acc, row) => acc + (parseFloat(row.paidAmount) || 0), 0);
  const totalPendingSum = rows.reduce((acc, row) => acc + (parseFloat(row.pendingAmount) || 0), 0);

  // Search summary totals
  const searchTotals = filteredRows.reduce(
    (acc, row) => {
      acc.total += parseFloat(row.totalAmount) || 0;
      acc.paid += parseFloat(row.paidAmount) || 0;
      acc.pending += parseFloat(row.pendingAmount) || 0;
      return acc;
    },
    { total: 0, paid: 0, pending: 0 }
  );

  return (
    <div className="container-fluid py-4 px-2 px-md-4 dashboard-main">
      <div className="d-flex justify-content-between align-items-center mb-4 header-section">
        <div>
          <h2 className="fw-bold m-0">Vehicles Bill Directory</h2>
          <p className="text-secondary m-0">Manage vehicle import bills, payment records, and pending balances</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        {/* Total Cost */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm stat-card gradient-teal p-4 text-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="fs-6 fw-bold opacity-80 uppercase tracking-wider">Total Vehicles Cost</span>
                <h2 className="display-6 fw-bold mt-2 mb-0">Rs. {totalAmountSum.toFixed(2)}</h2>
              </div>
              <div className="icon-wrapper bg-white bg-opacity-20 rounded-3 p-3">
                <i className="fa-solid fa-truck fs-2 text-white"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Total Paid */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm stat-card gradient-blue p-4 text-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="fs-6 fw-bold opacity-80 uppercase tracking-wider">Total Paid Amount</span>
                <h2 className="display-6 fw-bold mt-2 mb-0">Rs. {totalPaidSum.toFixed(2)}</h2>
              </div>
              <div className="icon-wrapper bg-white bg-opacity-20 rounded-3 p-3">
                <i className="fa-solid fa-circle-check fs-2 text-white"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Total Pending */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm stat-card gradient-rose p-4 text-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="fs-6 fw-bold opacity-80 uppercase tracking-wider">Total Pending Amount</span>
                <h2 className="display-6 fw-bold mt-2 mb-0">Rs. {totalPendingSum.toFixed(2)}</h2>
              </div>
              <div className="icon-wrapper bg-white bg-opacity-20 rounded-3 p-3">
                <i className="fa-solid fa-clock-rotate-left fs-2 text-white"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Entry Form */}
        <div className={selectedVehicle ? "col-lg-6 col-md-12" : "col-lg-12"}>
          <div className="card border-0 shadow-sm modern-card">
            <div className="card-header bg-white py-3 border-bottom border-light">
              <h5 className="m-0 fw-bold text-dark">{editingId ? "Edit Vehicle Record" : "Add Vehicle Record"}</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={editingId ? (e) => e.preventDefault() : handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold text-secondary">Vehicle Name / Number</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control modern-input"
                      placeholder="e.g. MH-19-AX-1234 or Importer Name"
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-bold text-secondary">Import Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="form-control modern-input"
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-bold text-secondary">Total Amount (Rs.)</label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleChange}
                      onBlur={calculatePending}
                      className="form-control modern-input"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  {!editingId && (
                    <div className="col-md-12">
                      <label className="form-label fw-bold text-secondary">Paid Amount (Rs.)</label>
                      <input
                        type="number"
                        name="paidAmount"
                        value={formData.paidAmount}
                        onChange={handleChange}
                        onBlur={calculatePending}
                        className="form-control modern-input"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                  <div className="col-md-12">
                    <label className="form-label fw-bold text-secondary">Pending Amount (Rs.) (Auto-Calculated)</label>
                    <input
                      type="number"
                      name="pendingAmount"
                      value={formData.pendingAmount}
                      className="form-control modern-input bg-light"
                      placeholder="0.00"
                      readOnly
                    />
                  </div>
                </div>

                <hr className="my-4 text-light" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="text-secondary fw-semibold">Summary for current entry:</span>
                  <h4 className="m-0 text-success fw-bold">Bill total: Rs. {totalVal || 0}</h4>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  {!editingId ? (
                    <Button
                      type="submit"
                      variant="contained"
                      style={{
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: "10px",
                        padding: "10px 24px",
                      }}
                    >
                      Save Bill
                    </Button>
                  ) : (
                    <Button
                      onClick={handleUpdate}
                      variant="contained"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: "10px",
                        padding: "10px 24px",
                      }}
                    >
                      Update Bill
                    </Button>
                  )}
                  <Button
                    onClick={handleReset}
                    variant="contained"
                    style={{
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      padding: "10px 24px",
                    }}
                  >
                    Reset Form
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Installment History Panel */}
        {selectedVehicle && (
          <div className="col-lg-6 col-md-12">
            <div className="card border-0 shadow-sm modern-card">
              <div className="card-header bg-white py-3 border-bottom border-light d-flex justify-content-between align-items-center">
                <h5 className="m-0 fw-bold text-dark">Installment History: {selectedVehicle.name}</h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSelectedVehicle(null)}
                  style={{ borderRadius: "8px" }}
                >
                  Close Panel
                </button>
              </div>
              <div className="card-body p-4">
                <div className="table-responsive mb-4" style={{ maxHeight: "220px", overflowY: "auto" }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>No.</th>
                        <th>Payment Date</th>
                        <th className="text-end">Amount Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedVehicle.payments || []).map((p, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{p.date}</td>
                          <td className="text-end fw-bold text-success">Rs. {p.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                      {(selectedVehicle.payments || []).length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center text-secondary py-3">
                            No installments recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {selectedVehicle.pendingAmount > 0 ? (
                  <div className="border p-3 rounded bg-light">
                    <h6 className="fw-bold mb-3 text-secondary">Record Installment Payment</h6>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <label className="form-label fw-bold text-secondary">Installment Amount (Rs.)</label>
                        <input
                          type="number"
                          className="form-control modern-input"
                          value={instAmount}
                          onChange={(e) => setInstAmount(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label fw-bold text-secondary">Payment Date</label>
                        <input
                          type="date"
                          className="form-control modern-input"
                          value={instDate}
                          onChange={(e) => setInstDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddInstallment}
                      className="btn btn-success mt-3 w-100 fw-bold py-2"
                      style={{ borderRadius: "10px" }}
                    >
                      Add Installment
                    </button>
                  </div>
                ) : (
                  <div className="alert alert-success text-center fw-bold m-0" role="alert">
                    <i className="fa-solid fa-circle-check me-2"></i> This vehicle bill has been fully settled!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Record Table Card */}
      <div className="card border-0 shadow-sm table-card">
        <div className="card-header bg-white py-3 border-bottom border-light d-flex flex-column flex-md-row justify-content-md-between align-items-md-center align-items-stretch gap-3">
          <h5 className="m-0 fw-bold text-dark text-center text-md-start">Vehicles Bill Registry</h5>
          <div className="d-flex align-items-center gap-2" style={{ maxWidth: "350px", flex: "1" }}>
            <input
              type="text"
              className="form-control modern-input py-1 px-3"
              placeholder="🔍 Search registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSearchQuery("")}
                style={{ borderRadius: "8px" }}
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
                <span className="text-secondary fs-7 fw-bold uppercase d-block" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>Search Active</span>
                <span className="text-dark fw-bold">Showing results for: "{searchQuery}"</span>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-4 align-items-center justify-content-start justify-content-md-end">
              <div>
                <span className="text-secondary d-block" style={{ fontSize: "0.75rem", fontWeight: "600" }}>Total Cost</span>
                <span className="text-dark fw-extrabold fs-5">Rs. {searchTotals.total.toFixed(2)}</span>
              </div>
              <div className="border-start ps-3">
                <span className="text-success d-block" style={{ fontSize: "0.75rem", fontWeight: "600" }}>Paid Amount</span>
                <span className="text-success fw-extrabold fs-5">Rs. {searchTotals.paid.toFixed(2)}</span>
              </div>
              <div className="border-start ps-3">
                <span className="text-danger d-block" style={{ fontSize: "0.75rem", fontWeight: "600" }}>Pending Balance</span>
                <span className="text-danger fw-extrabold fs-5">Rs. {searchTotals.pending.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="card-body p-0">
          <div className="table-responsive" style={{ maxHeight: "420px", overflowY: "auto" }}>
            <table className="table table-hover align-middle mb-0 modern-table">
              <thead className="table-light sticky-top">
                <tr>
                  <th scope="col" className="ps-4">#</th>
                  <th scope="col">Vehicle / Importer</th>
                  <th scope="col">Import Date</th>
                  <th scope="col" className="text-end">Total Amount</th>
                  <th scope="col" className="text-end">Paid Amount</th>
                  <th scope="col" className="text-center">Status / Pending</th>
                  <th scope="col" className="text-center pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((value, index) => {
                  const isSettled = value.pendingAmount === 0 || (value.totalAmount - (value.paidAmount || 0) <= 0);
                  return (
                    <tr
                      key={value._id}
                      onClick={() => handleEditClick(value)}
                      className="table-row-item"
                      style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                    >
                      <th scope="row" className="ps-4 text-secondary">{index + 1}</th>
                      <td className="fw-semibold text-dark">{value.name}</td>
                      <td>{value.date}</td>
                      <td className="text-end text-dark fw-medium">Rs. {value.totalAmount.toFixed(2)}</td>
                      <td className="text-end text-success fw-medium">Rs. {value.paidAmount.toFixed(2)}</td>
                      <td className="text-center">
                        {isSettled ? (
                          <span className="badge-settled">Fully Settled</span>
                        ) : (
                          <span className="badge-pending">
                            Pending: Rs. {value.pendingAmount.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="text-center pe-4" onClick={(e) => e.stopPropagation()}>
                        {!isSettled && (
                          <button
                            className="btn btn-outline-success btn-sm rounded-circle p-2 action-btn-success me-2"
                            title="Settle Pending Amount"
                            onClick={() => handleSettlePending(value)}
                          >
                            <i className="fa-solid fa-check" style={{ fontSize: "14px" }}></i>
                          </button>
                        )}
                        <button
                          className="btn btn-outline-danger btn-sm rounded-circle p-2 action-btn"
                          title="Delete Record"
                          onClick={() => handleDelete(value._id, value.name)}
                        >
                          <i className="fa-solid fa-trash-can" style={{ fontSize: "14px" }}></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-secondary">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DVechical;