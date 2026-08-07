import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import "./Dashboard.css";

const CATEGORIES = [
  "Rent",
  "Utility",
  "Salary",
  "Fuel",
  "Maintenance",
  "Office Supplies",
  "Other"
];

function Dexpenses() {

  // Form states
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // CRUD & Search states
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Fetch all expenses
  const getExpenses = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/expense`)
      .then((resp) => {
        setExpenses(resp.data);
      })
      .catch((err) => {
        console.error("Failed to fetch expenses:", err);
        toast.error("Failed to load expenses");
      });
  };

  useEffect(() => {
    getExpenses();
  }, []);

  // Reset form
  const handleReset = () => {
    setName("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("");
    setDescription("");
    setAmount("");
    setEditingId(null);
  };

  // Add or Update expense
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !date || !category || !amount) {
      toast.error("Please fill in all required fields (Name, Date, Category, Amount)");
      return;
    }

    const payload = {
      name,
      date,
      category,
      amount: Number(amount),
      description
    };

    if (editingId) {
      // Update
      axios
        .put(`${process.env.REACT_APP_API_URL}/expense/${editingId}`, payload)
        .then((resp) => {
          toast.success("Expense updated successfully");
          getExpenses();
          handleReset();
        })
        .catch((err) => {
          console.error("Update error:", err);
          toast.error("Failed to update expense");
        });
    } else {
      // Add
      axios
        .post(`${process.env.REACT_APP_API_URL}/expense`, payload)
        .then((resp) => {
          toast.success("Expense added successfully");
          getExpenses();
          handleReset();
        })
        .catch((err) => {
          console.error("Creation error:", err);
          toast.error("Failed to create expense");
        });
    }
  };

  // Set form to edit mode
  const handleEditClick = (expense) => {
    setEditingId(expense._id);
    setName(expense.name || "");
    setDate(expense.date || new Date().toISOString().split("T")[0]);
    setCategory(expense.category || "");
    setDescription(expense.description || "");
    setAmount(expense.amount || "");
  };

  // Delete expense
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/expense/${id}`)
        .then((resp) => {
          toast.success("Expense deleted successfully");
          getExpenses();
        })
        .catch((err) => {
          console.error("Delete error:", err);
          toast.error("Failed to delete expense");
        });
    }
  };

  // Filtering
  const filteredExpenses = expenses.filter((exp) => {
    if (searchDate && exp.date !== searchDate) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (exp.name && exp.name.toLowerCase().includes(query)) ||
        (exp.category && exp.category.toLowerCase().includes(query)) ||
        (exp.description && exp.description.toLowerCase().includes(query)) ||
        (exp.amount && exp.amount.toString().includes(query))
      );
    }
    return true;
  });

  // Calculate totals
  const totalAmount = filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Category breakdown calculation
  const getCategoryBreakdown = () => {
    const breakdown = CATEGORIES.reduce((acc, cat) => {
      acc[cat] = 0;
      return acc;
    }, {});

    filteredExpenses.forEach((exp) => {
      const cat = exp.category || "Other";
      if (breakdown[cat] !== undefined) {
        breakdown[cat] += Number(exp.amount) || 0;
      } else {
        if (!breakdown["Other"]) breakdown["Other"] = 0;
        breakdown["Other"] += Number(exp.amount) || 0;
      }
    });

    return breakdown;
  };

  const categoryTotals = getCategoryBreakdown();

  // Export PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add border/styling
    doc.setDrawColor(220, 220, 220);
    doc.rect(5, 5, 200, 287);

    // Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 167, 69); // Green color theme for Lucky Fruits/Shop
    doc.text("LUCKY SHOP", 14, 25);

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("Expense Ledger Report", 14, 33);

    // Line separator
    doc.setDrawColor(40, 167, 69);
    doc.setLineWidth(1);
    doc.line(14, 38, 196, 38);

    // Report Info
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const dateStr = new Date().toLocaleString();
    doc.text(`Generated on: ${dateStr}`, 14, 46);

    let filterText = "None (All Expenses)";
    if (searchQuery && searchDate) {
      filterText = `Search: "${searchQuery}" | Date: ${searchDate}`;
    } else if (searchQuery) {
      filterText = `Search: "${searchQuery}"`;
    } else if (searchDate) {
      filterText = `Date: ${searchDate}`;
    }
    doc.text(`Search Filters: ${filterText}`, 14, 52);
    doc.text(`Total Records: ${filteredExpenses.length}`, 14, 58);
    doc.text(`Total Outflow: Rs. ${totalAmount.toLocaleString()}`, 14, 64);

    // Category Breakdown on report
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 167, 69);
    doc.text("Category Breakdown Summary:", 14, 73);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    
    let breakdownX = 14;
    let breakdownY = 79;
    Object.keys(categoryTotals).forEach((cat, index) => {
      if (categoryTotals[cat] > 0) {
        doc.text(`${cat}: Rs. ${categoryTotals[cat].toLocaleString()}`, breakdownX, breakdownY);
        breakdownX += 45;
        if (breakdownX > 170) {
          breakdownX = 14;
          breakdownY += 6;
        }
      }
    });

    // AutoTable for expenses
    autoTable(doc, {
      head: [["#", "Expense Name", "Date", "Category", "Description", "Amount (Rs.)"]],
      body: filteredExpenses.map((exp, idx) => [
        idx + 1,
        exp.name || "-",
        exp.date || "-",
        exp.category || "-",
        exp.description || "-",
        exp.amount || "0"
      ]),
      startY: breakdownY + 10,
      theme: "striped",
      headStyles: { fillColor: [40, 167, 69], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 50 },
        5: { cellWidth: 27, halign: "right" }
      }
    });

    // Save report
    const filename = `Expense_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="container-fluid py-4 px-2 px-md-4 dashboard-main">
      <h3 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
        <i className="fa-solid fa-receipt text-success"></i> Expense Management
      </h3>

      <div className="card shadow-sm border-0 mb-4 p-3 p-sm-4">
        <h5 className="fw-bold mb-3 text-secondary">
          {editingId ? (
            <span className="text-warning">
              <i className="fa-solid fa-pen-to-square me-2"></i>Edit Expense Record
            </span>
          ) : (
            <span className="text-success">
              <i className="fa-solid fa-plus-circle me-2"></i>Record New Expense
            </span>
          )}
        </h5>
        
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6 col-lg-3">
            <label className="form-label fw-semibold text-secondary fs-7">Expense Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Electric Bill, Rent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="col-md-6 col-lg-3">
            <label className="form-label fw-semibold text-secondary fs-7">Date *</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6 col-lg-3">
            <label className="form-label fw-semibold text-secondary fs-7">Category *</label>
            <select
              className="form-select form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 col-lg-3">
            <label className="form-label fw-semibold text-secondary fs-7">Amount (Rs.) *</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold text-secondary fs-7">Description</label>
            <textarea
              className="form-control"
              placeholder="Add optional notes or descriptions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
            />
          </div>

          <div className="col-12 d-flex flex-wrap gap-2">
            <button
              type="submit"
              className={`btn px-4 flex-grow-1 flex-sm-grow-0 ${editingId ? "btn-warning text-dark fw-bold" : "btn-success"}`}
            >
              <i className={`fa-solid ${editingId ? "fa-floppy-disk" : "fa-plus"} me-2`}></i>
              {editingId ? "Update Expense" : "Add Expense"}
            </button>
            
            {(editingId || name || category || description || amount) && (
              <button
                type="button"
                className="btn btn-outline-secondary px-4 flex-grow-1 flex-sm-grow-0"
                onClick={handleReset}
              >
                <i className="fa-solid fa-arrow-rotate-left me-2"></i>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card shadow-sm border-0 p-3 p-sm-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <h5 className="fw-bold m-0 text-secondary">Expense Records Ledger</h5>
          
          <div className="d-flex flex-column flex-sm-row flex-wrap gap-2 align-items-stretch align-items-sm-center w-100 w-md-auto">
            <div className="flex-grow-1 flex-sm-grow-0" style={{ minWidth: "200px", maxWidth: "100%" }}>
              <input
                type="text"
                className="form-control form-control-sm w-100"
                placeholder="🔍 Search name, category, desc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex-grow-1 flex-sm-grow-0" style={{ minWidth: "150px", maxWidth: "100%" }}>
              <input
                type="date"
                className="form-control form-control-sm w-100"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2 flex-grow-1 flex-sm-grow-0 justify-content-end">
              {(searchQuery || searchDate) && (
                <button
                  className="btn btn-sm btn-outline-secondary flex-grow-1 flex-sm-grow-0"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchDate("");
                  }}
                >
                  Clear
                </button>
              )}

              <button
                className="btn btn-sm btn-success d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-sm-grow-0"
                onClick={generatePDF}
                disabled={filteredExpenses.length === 0}
              >
                <i className="fa-solid fa-file-pdf"></i>
                Report
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="table-light">
              <tr>
                <th className="py-3">Name</th>
                <th className="py-3">Date</th>
                <th className="py-3">Category</th>
                <th className="py-3">Description</th>
                <th className="py-3 text-end">Amount</th>
                <th className="py-3 text-center" style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <i className="fa-solid fa-folder-open fs-3 d-block mb-2"></i>
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="fw-semibold text-dark">{expense.name}</td>
                    <td className="text-nowrap">{expense.date}</td>
                    <td className="text-nowrap">
                      <span className="badge bg-opacity-10 bg-success text-success border border-success border-opacity-25 px-2.5 py-1.5 rounded">
                        {expense.category}
                      </span>
                    </td>
                    <td className="text-muted text-wrap" style={{ maxWidth: "250px" }}>
                      {expense.description || "-"}
                    </td>
                    <td className="text-nowrap fw-bold text-dark text-end">
                      Rs. {Number(expense.amount).toLocaleString()}
                    </td>
                    <td className="text-nowrap text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary py-1 px-2 border-0"
                          onClick={() => handleEditClick(expense)}
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger py-1 px-2 border-0"
                          onClick={() => handleDelete(expense._id)}
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Aggregated Totals and Category Breakdown */}
        {filteredExpenses.length > 0 && (
          <div className="row g-4 mt-2">
            <div className="col-lg-4">
              <div className="p-4 bg-light rounded border text-center h-100 d-flex flex-column justify-content-center">
                <span className="text-secondary text-uppercase fw-bold fs-8 mb-1">Total Period Outflow</span>
                <h3 className="fw-extrabold text-danger m-0">
                  Rs. {totalAmount.toLocaleString()}
                </h3>
                <span className="badge bg-secondary mt-2 mx-auto">
                  {filteredExpenses.length} Expense Records
                </span>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="p-4 bg-light rounded border h-100">
                <h6 className="fw-bold mb-3 text-secondary">Outflow by Category</h6>
                <div className="row g-2">
                  {Object.keys(categoryTotals).map((cat) => {
                    const amt = categoryTotals[cat];
                    if (amt === 0) return null;
                    const pct = totalAmount > 0 ? ((amt / totalAmount) * 100).toFixed(0) : 0;
                    return (
                      <div className="col-sm-6" key={cat}>
                        <div className="bg-white p-2.5 rounded border border-light shadow-2xs d-flex justify-content-between align-items-center">
                          <div>
                            <span className="fw-semibold text-dark fs-7 d-block">{cat}</span>
                            <span className="text-secondary fs-8">{pct}% of total</span>
                          </div>
                          <span className="fw-bold text-danger fs-7">
                            Rs. {amt.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dexpenses;