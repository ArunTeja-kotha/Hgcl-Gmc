import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";

const Layout = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-[#F4F8FC]">

      {/* Header */}
      <Header />

      {/* Sidebar + Main Content */}
      <div className="w-full flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
};

export default Layout;