import React, { useState } from "react";
import axios from "axios";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Send Email</h2>

        <label className="block mb-2">Recipient</label>
        <input
          type="email"
          name="recipient"
          value={formData.recipient}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring"
        />

        <label className="block mb-2">Subject</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring"
        />

        <label className="block mb-2">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>

        {status && <p className="mt-4 text-center">{status}</p>}
      </form>
    </div>
  );
};

export default EmailForm;
