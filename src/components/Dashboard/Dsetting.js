import axios from "axios";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Dashboard.css";
import { toast } from "react-toastify";

function Dsetting() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const handleAddTransaction = () => {
    if (!name || !date || !type || !description || !amount) {
      toast.error("Please fill all the fields",
        {
          position: "bottom-center"
        }
      );
      return;
    }
    else {
      axios.post(`${process.env.REACT_APP_API_URL}/addTransaction`, {
        name,
        date,
        type,
        description,
        amount,
      }).then((resp) => {
        console.log(resp.data);
        getTransaction();
        setName("");
        setDate("");
        setType("");
        setDescription("");
        setAmount("");
      });
    };
  };

  const transactionsForTotals = searchDate
    ? allTransactions.filter((t) => t.date === searchDate)
    : allTransactions.filter((t) => {
      if (!t.date) return false;
      const now = new Date();
      const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      return t.date.startsWith(currentYearMonth);
    });

  const receivedAmount = () => {
    return transactionsForTotals
      .filter((vale) => vale.type === "recieved")
      .reduce((sum, vale) => sum + Number(vale.amount || 0), 0);
  };

  const paidAmount = () => {
    return transactionsForTotals
      .filter((vale) => vale.type === "paid")
      .reduce((sum, vale) => sum + Number(vale.amount || 0), 0);
  };

  const getTotalsLabel = () => {
    if (searchDate) {
      return `Selected Date: ${searchDate}`;
    }
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()} (Current Month)`;
  };

  const filteredTransactions = allTransactions.filter((transaction) => {
    // 1. Filter by Date if selected
    if (searchDate && transaction.date !== searchDate) {
      return false;
    }

    // 2. Filter by search query (name, description, type, amount)
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      return (
        (transaction.name && transaction.name.toLowerCase().includes(term)) ||
        (transaction.description && transaction.description.toLowerCase().includes(term)) ||
        (transaction.type && transaction.type.toLowerCase().includes(term)) ||
        (transaction.amount && transaction.amount.toString().includes(term))
      );
    }

    return true;
  });

  const getTransaction = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/getTransaction`).then((resp) => {
      setAllTransactions(resp.data);
    });
  };

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
    doc.text("Transaction History Report", 14, 33);

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

    let filterText = "None (All Transactions)";
    if (searchQuery && searchDate) {
      filterText = `Search: "${searchQuery}" | Date: ${searchDate}`;
    } else if (searchQuery) {
      filterText = `Search: "${searchQuery}"`;
    } else if (searchDate) {
      filterText = `Date: ${searchDate}`;
    }
    doc.text(`Search Filter: ${filterText}`, 14, 52);
    doc.text(`Calculations Period: ${getTotalsLabel()}`, 14, 58);
    doc.text(`Total Records: ${filteredTransactions.length}`, 14, 64);

    // Summary Cards (Received, Paid, Net Balance)
    const totalRec = receivedAmount();
    const totalPaid = paidAmount();
    const netBal = totalRec - totalPaid;

    doc.setFillColor(240, 248, 240); // light green
    doc.rect(14, 72, 55, 20, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(40, 167, 69);
    doc.text("TOTAL RECEIVED", 18, 79);
    doc.setFontSize(12);
    doc.text(`Rs. ${totalRec}`, 18, 87);

    doc.setFillColor(253, 242, 242); // light red
    doc.rect(76, 72, 55, 20, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(220, 53, 69);
    doc.text("TOTAL PAID", 80, 79);
    doc.setFontSize(12);
    doc.text(`Rs. ${totalPaid}`, 80, 87);

    doc.setFillColor(242, 246, 253); // light blue
    doc.rect(138, 72, 58, 20, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 123, 255);
    doc.text("NET BALANCE", 142, 79);
    doc.setFontSize(12);
    doc.text(`Rs. ${netBal}`, 142, 87);

    // AutoTable for transactions
    autoTable(doc, {
      head: [['#', 'Name', 'Date', 'Type', 'Description', 'Amount (Rs.)']],
      body: filteredTransactions.map((t, idx) => [
        idx + 1,
        t.name || "-",
        t.date || "-",
        t.type === "recieved" ? "Received" : "Paid",
        t.description || "-",
        t.amount || "0"
      ]),
      startY: 100,
      theme: 'striped',
      headStyles: { fillColor: [40, 167, 69], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 50 },
        5: { cellWidth: 27, halign: 'right' }
      }
    });

    // Save report
    const filename = `Transaction_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  };


  useEffect(() => {
    getTransaction();
    receivedAmount();
  }, []);

  return (
    <div className="container-fluid py-4 px-2 px-md-4 dashboard-main">
      <div className="payement-form">

        <input type="text" className="form-control my-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
        <input type="date" className="form-control my-2" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Enter Date" />
        <select className="form-control my-2" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="" disabled >Select Category</option>
          <option value="recieved" >Payment Recieved</option>
          <option value="paid">Payment Paid</option>
        </select>
        <input type="text" className="form-control my-2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" />
        <input type="number" className="form-control my-2" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter Amount" />
        <button className="btn btn-primary payement-btn" onClick={handleAddTransaction}>Add</button>
      </div>
      <hr />
      <div className="payement-table mt-3">
        <div className="row g-2 mb-3 align-items-center">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search by name, description, amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
          <div className="col-md-3 d-flex justify-content-end align-items-center">
            {(searchQuery || searchDate) && (
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => {
                  setSearchQuery("");
                  setSearchDate("");
                }}
              >
                Clear
              </button>
            )}
            <button
              className="btn btn-success d-flex align-items-center"
              onClick={generatePDF}
              disabled={filteredTransactions.length === 0}
            >
              <i className="fa-solid fa-file-pdf me-2"></i>
              Report
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.name}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="amount mt-4 p-3 bg-light rounded border text-center">
        <div className="mb-2">
          <span className="badge bg-secondary">Calculations Period: {getTotalsLabel()}</span>
        </div>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
          <div>
            <h5 className="text-success m-0">Total Received: {receivedAmount()}</h5>
          </div>
          <div>
            <h5 className="text-danger m-0">Total Paid: {paidAmount()}</h5>
          </div>
          <div>
            <h5 className="text-primary m-0">Net Balance: {receivedAmount() - paidAmount()}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dsetting;
