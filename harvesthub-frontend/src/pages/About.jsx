export default function About() {
  return (
    <section className="section">
      <div className="container">
        <button className="btn-outline" onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = "/")}>← Back</button>
        <h2>About Harvest Hub</h2>
        <p className="subtitle">Our mission is to connect local farmers with the community</p>
        <div className="card">
          <p>
            Harvest Hub makes it easy to buy directly from local farmers. We believe in fair pricing,
            transparency, and fresh produce delivered quickly. By removing middlemen, farmers earn more,
            and customers get better quality at better prices.
          </p>
        </div>
      </div>
    </section>
  );
}


