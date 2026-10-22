import axios from "axios";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Dashboard.css";
import { toast } from "react-toastify";

function Daccount() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Account Form state
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");

  // Transaction Form state
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [txDate, setTxDate] = useState("");
  const [txType, setTxType] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txDescription, setTxDescription] = useState("");

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filterType, setFilterType] = useState("");

  // Show forms
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showTxForm, setShowTxForm] = useState(false);

  const fetchAccounts = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/bank-accounts`)
      .then((res) => {
        setBankAccounts(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load bank accounts");
      });
  };

  const fetchTransactions = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/bank-transactions`)
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load bank transactions");
      });
  };

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
    // Default transaction date to today
    setTxDate(new Date().toISOString().split("T")[0]);
  }, []);

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!bankName || !accountNumber || !holderName) {
      toast.error("Please fill all bank account fields");
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/bank-accounts`, {
        bankName,
        accountNumber,
        holderName,
        balance: initialBalance ? Number(initialBalance) : 0,
      })
      .then((res) => {
        toast.success("Bank Account added successfully");
        fetchAccounts();
        // Reset state
        setBankName("");
        setAccountNumber("");
        setHolderName("");
        setInitialBalance("");
        setShowAccountForm(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error adding bank account");
      });
  };

  const handleDeleteAccount = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this bank account? This will also delete all associated transactions."
      )
    ) {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/bank-accounts/${id}`)
        .then((res) => {
          toast.success("Bank Account and related transactions deleted");
          fetchAccounts();
          fetchTransactions();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error deleting bank account");
        });
    }
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!selectedAccountId || !txDate || !txType || !txAmount) {
      toast.error("Please fill all required transaction fields");
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/bank-transactions`, {
        accountId: selectedAccountId,
        date: txDate,
        type: txType,
        amount: Number(txAmount),
        description: txDescription,
      })
      .then((res) => {
        toast.success("Transaction added successfully");
        fetchAccounts();
        fetchTransactions();
        // Reset state (keep date as is)
        setSelectedAccountId("");
        setTxType("");
        setTxAmount("");
        setTxDescription("");
        setShowTxForm(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error adding transaction");
      });
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction? The bank balance will be adjusted.")) {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/bank-transactions/${id}`)
        .then((res) => {
          toast.success("Transaction deleted, balance adjusted");
          fetchAccounts();
          fetchTransactions();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error deleting transaction");
        });
    }
  };

  // Calculations for Summary
  const totalBalance = bankAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  const filteredTransactions = transactions.filter((tx) => {
    // Filter by date
    if (searchDate && tx.date !== searchDate) return false;
    // Filter by type
    if (filterType && tx.type !== filterType) return false;
    // Filter by search query
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      const accountName = tx.accountId ? tx.accountId.bankName.toLowerCase() : "";
      const desc = tx.description ? tx.description.toLowerCase() : "";
      const amountStr = tx.amount ? tx.amount.toString() : "";
      return accountName.includes(term) || desc.includes(term) || amountStr.includes(term);
    }
    return true;
  });

  const totalSettled = filteredTransactions
    .filter((tx) => tx.type === "Settlement")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const totalDeposited = filteredTransactions
    .filter((tx) => tx.type === "Deposit")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const totalTransferred = filteredTransactions
    .filter((tx) => tx.type === "Transfer")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  // Generate Statement PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setDrawColor(220, 220, 220);
    doc.rect(5, 5, 200, 287);

    // Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 167, 69); // Green theme
    doc.text("LUCKY SHOP", 14, 25);

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("Bank Statement Report", 14, 33);

    // Line separator
    doc.setDrawColor(40, 167, 69);
    doc.setLineWidth(1);
    doc.line(14, 38, 196, 38);

    // Report Info
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 46);

    let filterText = "None (All Transactions)";
    if (searchQuery && searchDate) {
      filterText = `Search: "${searchQuery}" | Date: ${searchDate}`;
    } else if (searchQuery) {
      filterText = `Search: "${searchQuery}"`;
    } else if (searchDate) {
      filterText = `Date: ${searchDate}`;
    }
    if (filterType) {
      filterText += ` | Type: ${filterType}`;
    }
    doc.text(`Filter Applied: ${filterText}`, 14, 52);
    doc.text(`Total Records: ${filteredTransactions.length}`, 14, 58);

    // Summary cards in PDF
    doc.setFillColor(240, 248, 240); // Light Green
    doc.rect(14, 65, 55, 20, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(40, 167, 69);
    doc.text("TOTAL SETTLED", 18, 72);
    doc.setFontSize(11);
    doc.text(`Rs. ${totalSettled}`, 18, 80);

    doc.setFillColor(242, 246, 253); // Light Blue
    doc.rect(76, 65, 55, 20, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0, 123, 255);
    doc.text("TOTAL DEPOSITED", 80, 72);
    doc.setFontSize(11);
    doc.text(`Rs. ${totalDeposited}`, 80, 80);

    doc.setFillColor(253, 242, 242); // Light Red
    doc.rect(138, 65, 58, 20, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(220, 53, 69);
    doc.text("TOTAL TRANSFERRED", 142, 72);
    doc.setFontSize(11);
    doc.text(`Rs. ${totalTransferred}`, 142, 80);

    // AutoTable
    autoTable(doc, {
      head: [["#", "Bank Account", "Date", "Type", "Description", "Amount (Rs.)"]],
      body: filteredTransactions.map((tx, idx) => [
        idx + 1,
        tx.accountId ? `${tx.accountId.bankName} (${tx.accountId.accountNumber.slice(-4)})` : "-",
        tx.date || "-",
        tx.type || "-",
        tx.description || "-",
        tx.type === "Transfer" ? `- Rs. ${tx.amount}` : `+ Rs. ${tx.amount}`,
      ]),
      startY: 92,
      theme: "striped",
      headStyles: { fillColor: [40, 167, 69], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 55 },
        5: { cellWidth: 30, halign: "right" },
      },
    });

    const filename = `Bank_Statement_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="container-fluid py-4 px-2 px-md-4 dashboard-main">
      {/* Top action cards & summary */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark m-0">Bank Accounts & Balance</h2>
          <p className="text-muted m-0">Manage your business bank accounts, track settlements and transfers.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap w-100 justify-content-start justify-content-md-end w-md-auto">
          <button
            onClick={() => setShowAccountForm(!showAccountForm)}
            className="btn btn-primary d-flex align-items-center justify-content-center flex-grow-1 flex-md-grow-0"
          >
            <i className={`fa-solid ${showAccountForm ? "fa-times" : "fa-plus"} me-2`}></i>
            {showAccountForm ? "Close Form" : "New Account"}
          </button>
          <button
            onClick={() => setShowTxForm(!showTxForm)}
            className="btn btn-success d-flex align-items-center justify-content-center flex-grow-1 flex-md-grow-0"
          >
            <i className={`fa-solid ${showTxForm ? "fa-times" : "fa-plus"} me-2`}></i>
            {showTxForm ? "Close Form" : "New Transaction"}
          </button>
        </div>
      </div>

      {/* Grid of Bank Accounts */}
      <div className="row g-3 mb-4">
        {bankAccounts.length === 0 ? (
          <div className="col-12 text-center py-4 bg-light rounded border">
            <h5 className="text-muted m-0">No bank accounts added yet. Click 'New Account' to get started.</h5>
          </div>
        ) : (
          bankAccounts.map((acc) => (
            <div className="col-12 col-sm-6 col-lg-4" key={acc._id}>
              <div
                className="card border-0 shadow-sm text-white position-relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  borderRadius: "16px",
                  minHeight: "180px",
                }}
              >
                <div className="card-body p-3 p-sm-4 d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <h5 className="fw-bold m-0">{acc.bankName}</h5>
                      <span className="text-light-50 fs-7" style={{ opacity: 0.8 }}>
                        Account Number: **** {acc.accountNumber.slice(-4)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteAccount(acc._id)}
                      className="btn btn-link text-white p-0"
                      title="Delete Account"
                      style={{ opacity: 0.8 }}
                    >
                      <i className="fa-solid fa-trash fs-5"></i>
                    </button>
                  </div>
                  <div className="mt-4">
                    <span className="fs-7 text-light-50 d-block" style={{ opacity: 0.8 }}>
                      Balance
                    </span>
                    <h3 className="fw-bold m-0 fs-4 fs-sm-3">Rs. {acc.balance.toLocaleString()}</h3>
                  </div>
                  <div className="mt-2 pt-2 border-top border-light-subtle d-flex justify-content-between">
                    <span className="fs-7 text-wrap" style={{ opacity: 0.9 }}>
                      Holder: {acc.holderName}
                    </span>
                    <i className="fa-solid fa-building-columns fs-4 opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dropdown forms (Account / Transaction) */}
      {showAccountForm && (
        <div className="card shadow-sm border-0 mb-4 p-4 rounded-4 bg-white">
          <h5 className="fw-bold mb-3 text-dark">Add New Bank Account</h5>
          <form onSubmit={handleAddAccount}>
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bank Name (e.g. HDFC)"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Account Holder Name"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-6 col-lg-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Initial Balance"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                />
              </div>
              <div className="col-12 col-lg-1">
                <button type="submit" className="btn btn-primary w-100">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {showTxForm && (
        <div className="card shadow-sm border-0 mb-4 p-3 p-sm-4 rounded-4 bg-white">
          <h5 className="fw-bold mb-3 text-dark">Add Bank Transaction (Deposit / Transfer / Settlement)</h5>
          <form onSubmit={handleAddTransaction}>
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-4">
                <select
                  className="form-select"
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  required
                >
                  <option value="">Select Account</option>
                  {bankAccounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.bankName} - **** {acc.accountNumber.slice(-4)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <input
                  type="date"
                  className="form-control"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <select
                  className="form-select"
                  value={txType}
                  onChange={(e) => setTxType(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Deposit">Deposit</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Settlement">Settlement</option>
                </select>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <button type="submit" className="btn btn-success w-100">
                  Save Transaction
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filtering and transaction logs */}
      <div className="card shadow-sm border-0 rounded-4 bg-white p-3 p-sm-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 border-bottom pb-3">
          <h5 className="fw-bold text-dark m-0">Transaction Statement History</h5>
          <div className="d-flex flex-column flex-sm-row flex-wrap gap-2 mt-2 mt-md-0 w-100 w-md-auto align-items-stretch align-items-sm-center">
            <div className="flex-grow-1 flex-sm-grow-0" style={{ minWidth: "180px", maxWidth: "100%" }}>
              <input
                type="text"
                className="form-control form-control-sm w-100"
                placeholder="Search description, bank..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-grow-1 flex-sm-grow-0" style={{ minWidth: "140px", maxWidth: "100%" }}>
              <input
                type="date"
                className="form-control form-control-sm w-100"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
            <div className="flex-grow-1 flex-sm-grow-0" style={{ minWidth: "120px", maxWidth: "100%" }}>
              <select
                className="form-select form-select-sm w-100"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Deposit">Deposit</option>
                <option value="Transfer">Transfer</option>
                <option value="Settlement">Settlement</option>
              </select>
            </div>
            <div className="d-flex gap-2 flex-grow-1 flex-sm-grow-0 justify-content-end">
              {(searchQuery || searchDate || filterType) && (
                <button
                  className="btn btn-sm btn-outline-secondary flex-grow-1 flex-sm-grow-0"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchDate("");
                    setFilterType("");
                  }}
                >
                  Clear
                </button>
              )}
              <button
                onClick={generatePDF}
                className="btn btn-sm btn-success d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-sm-grow-0"
                disabled={filteredTransactions.length === 0}
              >
                <i className="fa-solid fa-file-pdf me-1"></i>
                Report
              </button>
            </div>
          </div>
        </div>

        {/* List of transactions */}
        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="table-light">
              <tr>
                <th>Bank Account</th>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th className="text-end">Amount</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No transactions found matching filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>
                      <div className="fw-semibold">
                        {tx.accountId ? tx.accountId.bankName : "Unknown Account"}
                      </div>
                      <div className="text-muted small">
                        {tx.accountId ? `**** ${tx.accountId.accountNumber.slice(-4)}` : ""}
                      </div>
                    </td>
                    <td className="text-nowrap">{tx.date}</td>
                    <td className="text-nowrap">
                      <span
                        className={`badge ${
                          tx.type === "Deposit"
                            ? "bg-primary"
                            : tx.type === "Settlement"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td>{tx.description || "-"}</td>
                    <td
                      className={`text-nowrap text-end fw-bold ${
                        tx.type === "Transfer" ? "text-danger" : "text-success"
                      }`}
                    >
                      {tx.type === "Transfer" ? "-" : "+"} Rs. {tx.amount.toLocaleString()}
                    </td>
                    <td className="text-nowrap text-center">
                      <button
                        onClick={() => handleDeleteTransaction(tx._id)}
                        className="btn btn-sm btn-outline-danger border-0"
                        title="Delete Transaction"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Calculations Section */}
        <div className="row g-3 mt-3 pt-3 border-top bg-light rounded p-3">
          <div className="col-12 col-sm-6 col-md-3">
            <div className="text-muted small">Total Combined Balance</div>
            <h4 className="fw-bold text-dark m-0 fs-5 fs-md-4">Rs. {totalBalance.toLocaleString()}</h4>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="text-muted small text-success">Total Settled</div>
            <h4 className="fw-bold text-success m-0 fs-5 fs-md-4">Rs. {totalSettled.toLocaleString()}</h4>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="text-muted small text-primary">Total Deposited</div>
            <h4 className="fw-bold text-primary m-0 fs-5 fs-md-4">Rs. {totalDeposited.toLocaleString()}</h4>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="text-muted small text-danger">Total Transferred</div>
            <h4 className="fw-bold text-danger m-0 fs-5 fs-md-4">Rs. {totalTransferred.toLocaleString()}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Daccount;
