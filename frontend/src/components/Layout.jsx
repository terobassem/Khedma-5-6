import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">{children}</main>
    <Footer />
  </div>
);

export default Layout;
