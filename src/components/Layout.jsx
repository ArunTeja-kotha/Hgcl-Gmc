import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1">
        <Header />

        <main>
          {/* Page content will come here */}
        </main>
      </div>

    </div>
  );
};

export default Layout;