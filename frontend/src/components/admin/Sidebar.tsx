import { NavLink } from "react-router-dom";

const menuItems = [
  { to: "/admin", label: "Tổng quan", icon: "📊" },
  { to: "/admin/areas", label: "Quản lý Khu vực", icon: "🌍" },
  { to: "/admin/categories", label: "Quản lý Danh mục", icon: "📂" },
  { to: "/admin/ingredients", label: "Quản lý Nguyên liệu", icon: "🥬" },
  { to: "/admin/recipes", label: "Quản lý Công thức", icon: "🍳" },
  { to: "/admin/users", label: "Quản lý Người dùng", icon: "👥" },
];

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold mb-10 text-center">Admin Panel</h2>
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            <span className="text-2xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}