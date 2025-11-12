export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>🌱 Harvest Hub</h3>
          <p>Connecting farmers and consumers for a fresher, healthier future.</p>
        </div>
        <div>
          <h4>For Customers</h4>
          <ul>
            <li><a href="/products">Browse Products</a></li>
            <li><a href="/cart">Track Orders</a></li>
            <li><a href="/signin">My Account</a></li>
          </ul>
        </div>
        <div>
          <h4>For Farmers</h4>
          <ul>
            <li><a href="/signup">Sell Products</a></li>
            <li><a href="#">Manage Inventory</a></li>
            <li><a href="#">Earnings</a></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© 2025 Harvest Hub. All rights reserved.</div>
    </footer>
  );
}


