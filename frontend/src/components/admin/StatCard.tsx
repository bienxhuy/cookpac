interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: "blue" | "green" | "yellow" | "red" | "purple";
}

const colorClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  yellow: "bg-yellow-100 text-yellow-600",
  red: "bg-red-100 text-red-600",
  purple: "bg-purple-100 text-purple-600",
};

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value.toLocaleString()}</p>
        </div>
        <div className={`text-4xl p-4 rounded-full ${colorClasses[color]}`}>
            {icon === "Globe" && <span>🌐</span>}
            {icon === "Folder" && <span>📁</span>}
            {icon === "Leaf" && <span>🍃</span>}
            {icon === "Cooking" && <span>🍳</span>}
        </div>
      </div>
    </div>
  );
}