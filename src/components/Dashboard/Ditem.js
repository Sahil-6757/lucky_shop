import { useEffect, useState } from "react";
import React from "react";
import "./Dashboard.css";
import axios from "axios";
import { toast } from "react-toastify";

function Ditem() {
  const [Name, setName] = useState("");
  const [Description, setDescrition] = useState("");
  const [Rate, setRate] = useState("");
  const [File, setFile] = useState(null);
  const [Data, setData] = useState([]);
  const [Id, setId] = useState();


  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const getData = async () => {
    await axios
      .get("https://lucky-shop-backend.onrender.com/item")
      .then((resp) => {
        console.log(resp.data)
        setData(resp.data);
      });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!(Name && Description && Rate && File)) {
    toast.error("Empty fields");
    return;
  }

  try {
    // Upload Image to Cloudinary
    const cloudData = new FormData();
    cloudData.append("file", File);
    cloudData.append("upload_preset", "lucky-shop");

    const cloudRes = await axios.post(
      "https://api.cloudinary.com/v1_1/dbi2w9wjw/image/upload",
      cloudData
    );

    const formData = {
      name: Name,
      description: Description,
      rate: Rate,
      image: cloudRes.data.secure_url,
    }
    // Send to Backend ✅ With Headers
    await axios.post(
      "https://lucky-shop-backend.onrender.com/item",formData,{
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Item Added Successfully");

    getData();

    setName("");
    setDescrition("");
    setRate("");
    setFile(null);

  } catch (error) {
    console.log("Submit Error:", error);
  }
};



 const handleUpdate = async () => {
  let name = document.getElementById("name").value;
  let description = document.getElementById("description").value;
  let rate = document.getElementById("rate").value;

  if (!(name && description && rate)) {
    toast.error("Empty fields", { autoClose: 2000 });
    return;
  }

  try {
    // ✅ Create new FormData here also
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("rate", rate);

    // ✅ If user selected new image
    if (File) {
      const cloudData = new FormData();
      cloudData.append("file", File);
      cloudData.append("upload_preset", "lucky-shop");

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dbi2w9wjw/image/upload",
        cloudData
      );

      formData.append("image", cloudRes.data.secure_url);
    }

    await axios.put(
      `https://lucky-shop-backend.onrender.com/edititem/${Id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Updated Successfully");

    getData(); // refresh

  } catch (error) {
    console.log(error);
  }
};


  const handleEdit = async (id, name, description, rate, image) => {
    document.getElementById("name").value = name;
    document.getElementById("description").value = description;
    document.getElementById("rate").value = rate;
    setId(id);
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure?")) return;

  await axios.delete(
    `https://lucky-shop-backend.onrender.com/deleteitem/${id}`
  );

  toast.success("Deleted Successfully");

  getData();
};


  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <form
        action=""
        onSubmit={handleSubmit}
        method="post"
        enctype="multipart/form-data"
      >
        <div className="item-page">
          <div className="item-form">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Name
              </label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                name="name"
                value={Name}
                id="name"
                placeholder="Item Name"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label"
              >
                Description
              </label>
              <textarea
                className="form-control"
                name="description"
                id="description"
                value={Description}
                rows="3"
                onChange={(e)=>setDescrition(e.target.value)}
                placeholder="Item Description"
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Rate
              </label>
              <input
                type="number"
                value={Rate}
                className="form-control"
                onChange={(e)=>setRate(e.target.value)}
                
                name="rate"
                id="rate"
                placeholder="Item Rate"
              />
            </div>
            <div className="input-group mb-3">
              <input
                type="file"
                className="form-control"
                name="image"
                
                onChange={handleFile}
                id="image"
              />
            </div>
            <input type="submit" value="Post" className="btn btn-success " />
            <input
              type="button"
              value="Update"
              onClick={handleUpdate}
              className="btn btn-secondary mx-3"
            />
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="text-center text-success">Item Records</h2>
        <div className="row">
          {Data.length < 0 ? (
            <p>No Data Found</p>
          ) : (
            Data.map((value, index) => {
              return (
                <>
                  {index < 0 ? (
                    <p>No item Found</p>
                  ) : (
                    <div className="col-md-4 col-sm-6 col-xs-12 item-container" key={index}>
                      <div
                        className="card my-2"
                        key={value.image}
                        style={{ width: "20rem", height: "auto" }}
                      >
                        <img
                          src={value.image}
                          alt={value.image}
                          style={{ height: "15rem", objectFit: "cover" }}
                        />

                        <div className="card-body">
                          <h5 className="card-title text-center">
                            {value.name}
                          </h5>
                          <p className="card-text text-center">
                            {value.description}
                          </p>
                          <p className="card-text text-center ">
                            {value.rate}
                          </p>
                          <div className="buttonElement">
                            <button
                              href="#"
                              className="btn btn-primary m-auto"
                              onClick={() =>
                                handleEdit(
                                  value._id,
                                  value.name,
                                  value.description,
                                  value.rate,
                                  value.image,
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              href="#"
                              className="btn btn-danger m-auto"
                              onClick={() => handleDelete(value._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* <img src={`data:${value.image.contentType};base64,${Buffer.from(value.image.data).toString('base64')}`} alt={value.image.data} style={{height:"23px", width:"23px"}}/> */}
                </>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default Ditem;
