import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getAreas } from "@/services/area.service";
import { getCategories } from "@/services/category.service";
import { getIngredients } from "@/services/ingredient.service";
import { getRecipes, countRecipesByFilter } from "@/services/recipe.service";
import StatCard from "@/components/admin/StatCard";

interface Stats {
  areas: number;
  categories: number;
  ingredients: number;
  recipes: number;
}

interface AreaRecipeCount {
  name: string;
  count: number;
}

interface CategoryRecipeCount {
  name: string;
  value: number;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#84cc16", "#14b8a6"];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    areas: 0,
    categories: 0,
    ingredients: 0,
    recipes: 0,
  });
  const [areaData, setAreaData] = useState<AreaRecipeCount[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryRecipeCount[]>([]);
  const [loading, setLoading] = useState(true);

  const monthlyData = [
    { month: "Th1", recipes: 1 },
    { month: "Th2", recipes: 2 },
    { month: "Th3", recipes: 3 },
    { month: "Th4", recipes: 4 },
    { month: "Th5", recipes: 19 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
        try {
        const [areasRes, categoriesRes, ingredientsRes] = await Promise.all([
                getAreas(),
                getCategories(),
                getIngredients(),
            ]);
        const areas = areasRes.data.areas || [];
        const categories = categoriesRes.data.categories || [];
        const ingredients = ingredientsRes.data.ingredients || [];

        setStats({
            areas: areas.length,
            categories: categories.length,
            ingredients: ingredients.length,
            recipes: 0, 
        });

        const areaPromises = areas.map(async (area: any) => {
            if (!area.isActive) return { name: area.name, count: 0 }; 

            const total = await countRecipesByFilter({
            areaIds: area.id.toString(),
            page: 1,
            pageSize: 1,
            });

            return {
            name: area.name,
            count: total,
            };
        });

        const areaChartDataRaw = await Promise.all(areaPromises);
        const areaChartData = areaChartDataRaw
            .filter(item => item.count > 0)
            .sort((a, b) => b.count - a.count);

        setAreaData(areaChartData.length > 0 ? areaChartData : [{ name: "Chưa có công thức", count: 0 }]);

        const totalRecipes = areaChartData.reduce((sum, item) => sum + item.count, 0);
        setStats(prev => ({ ...prev, recipes: totalRecipes }));

        const categoryPromises = categories.map(async (cat: any) => {
            const total = await countRecipesByFilter({
            categoryIds: cat.id.toString(),
            page: 1,
            pageSize: 1,
            });

            return {
            name: cat.name,
            value: total,
            };
        });

        const categoryChartDataRaw = await Promise.all(categoryPromises);
        const categoryChartData = categoryChartDataRaw
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);

        setCategoryData(categoryChartData.length > 0 ? categoryChartData : [{ name: "Chưa có dữ liệu", value: 0 }]);

        } catch (error) {
        console.error("Error fetching admin stats with filter:", error);
        setAreaData([{ name: "Lỗi kết nối", count: 0 }]);
        setCategoryData([{ name: "Lỗi kết nối", value: 0 }]);
        } finally {
        setLoading(false);
        }
    };

    fetchStats();
    }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Trang Quản Trị - Tổng Quan
          </h1>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="h-12 bg-gray-300 rounded w-40"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard title="Khu Vực" value={stats.areas} icon="Globe" color="blue" />
              <StatCard title="Danh Mục" value={stats.categories} icon="Folder" color="green" />
              <StatCard title="Nguyên Liệu" value={stats.ingredients} icon="Leaf" color="yellow" />
              <StatCard title="Công Thức" value={stats.recipes} icon="Cooking" color="red" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Số Công thức theo Khu vực</h2>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={areaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Phân bố Công thức theo Danh mục</h2>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : null}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Xu hướng tạo Công thức (2025)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="recipes"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{ fill: "#10b981", r: 6 }}
                  name="Công thức mới"
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-4 text-center">
              * Dữ liệu theo tháng hiện đang giả lập. Sẽ cập nhật khi có thêm công thức.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}