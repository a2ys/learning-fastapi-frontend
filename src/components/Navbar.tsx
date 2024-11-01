import { logout } from "../utils/logout";

interface NavbarProps {
  activeWindow: string;
  setActiveWindow: (value: string) => void;
}

const Navbar = ({ activeWindow, setActiveWindow }: NavbarProps) => {
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      logout();
    }
  };

  return (
    <nav className="flex justify-between w-full p-3 border-b-2 border-b-black">
      <h1 className="text-2xl font-bold px-4 py-2">ToDo List</h1>
      <div className="flex flex-row">
        <button
          onClick={() =>
            setActiveWindow(activeWindow === "show" ? "create" : "show")
          }
          className="bg-blue-900 hover:bg-blue-950 text-white rounded-lg font-bold px-4 py-2 mr-2"
        >
          {activeWindow === "show" ? "Create New Task" : "Show Tasks"}
        </button>
        <button
          onClick={handleLogout}
          className="text-white font-bold bg-red-900 hover:bg-red-950 rounded-md px-4 py-2"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
