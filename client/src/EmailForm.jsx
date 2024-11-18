import React, { useState } from "react";
import axios from "axios";
import { TEInput, TERipple } from "tw-elements-react";
import "./App.css";

const EmailForm = () => {
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await axios.post("http://localhost:5000/send-email", formData);
      setStatus(response.data.success);
    } catch (error) {
      setStatus(error.response?.data?.error || "Failed to send email.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-20 text-center">Send-MSG-Email2Email-Application</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
          <TEInput
            type="email"
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            placeholder="Enter recipient email"
            required
            wrapperProps={{
              className: "mb-4",
            }}
            inputProps={{
              className: "focus:ring-2 focus:ring-blue-500",
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <TEInput
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            required
            wrapperProps={{
              className: "mb-4",
            }}
            inputProps={{
              className: "focus:ring-2 focus:ring-blue-500",
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Enter your message"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>

        <TERipple rippleColor="light">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </TERipple>

        {status && <p className="mt-4 text-center text-sm text-gray-500">{status}</p>}
      </form>
    </div>
  );
};

export default EmailForm;
