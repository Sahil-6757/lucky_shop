import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Product() {
    const [data,setData] = useState([])
    useEffect(() => {
        axios.get("https://lucky-shop-backend.onrender.com/item").then((res)=>{
            console.log(res.data)
            setData(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    }, [])


  return (
    <div>
      <h3 className='text-center my-3'>Product Page</h3>
      <div className="container">
        <div className="rows">
          {
            data.map((item)=>{
                return(
                    <div className="cols-md-4 my-3">
                        <div className="card" style={{width: "18rem"}}>
                            <div className="card-body">
                                <img src={item.image} alt={item.name} className='card-img-top'/>
                                <h5 className="card-title">{item.name}</h5>
                                <p className="card-text">{item.description}</p>
                                <p className="card-text">Price: {item.rate}</p>
                            </div>
                        </div>
                    </div>
                )
            })
        }
      </div>
      </div>
    </div>
  )
}

export default Product
