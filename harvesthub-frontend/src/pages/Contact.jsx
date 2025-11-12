import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e) => {
    e.preventDefault();
    alert("Thanks for reaching out! We'll get back to you shortly.");
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <section className="section">
      <div className="container">
        <button className="btn-outline" onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = "/")}>← Back</button>
        <h2>Contact Us</h2>
        <p className="subtitle">Have a question? We'd love to hear from you.</p>
        <form className="card" onSubmit={submit}>
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label>Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required />
          </div>
          <button className="btn-primary" type="submit" style={{ marginTop: "1rem" }}>Send</button>
        </form>
      </div>
    </section>
  );
}


