import { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    total: 0,
    status: "",
    productName: "",
    productPrice: "",
    method: "",
    trackingNumber: "",
    address: "",
  });

  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-5xl font-bold m-10">Form</h3>
      <form className="border-2 border-black w-80" onSubmit={handleSubmit}>
        <div className="border-2 border-black flex flex-col p-5">
          <h5 className="text-xl text-center font-bold">Generice Details</h5>
          <div className="flex ">
            <label>Total:</label>
            <input name="total" type="text" onChange={handleChange} />
          </div>
          <div className="flex">
            <label>Status:</label>
            <input name="status" type="text" onChange={handleChange} />
          </div>
        </div>
        <div className="border-2 border-black flex flex-col p-5">
          <h5 className="text-xl text-center font-bold">Products Detail</h5>
          <div className="flex">
            <label>Product Name:</label>
            <input name="productName" type="text" onChange={handleChange} />
          </div>
          <div className="flex">
            <label>Product Price:</label>
            <input name="productPrice" type="text" onChange={handleChange} />
          </div>
        </div>
        <div className="border-2 border-black flex flex-col p-5">
          <h5 className="text-xl text-center font-bold">Shipping Details</h5>
          <div className="flex">
            <label>Method:</label>
            <input name="method" type="text" onChange={handleChange} />
          </div>
          <div className="flex">
            <label>Tracking Number:</label>
            <input name="trackingNumber" type="text" onChange={handleChange} />
          </div>
          <div className="flex">
            <label>Address:</label>
            <input name="address" type="text" onChange={handleChange} />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="rounded-[5px] text-center border-2 border-blue-400"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
