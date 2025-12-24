import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Heart, BookOpen } from 'lucide-react';
import ListItemRenderer from '../components/ListItemRecipePage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRecipes, getUserVotedRecipes } from '@/services/recipe.service';
import { Recipe } from '@/types/recipe.type';

const TAB_CONFIG = {
  favorite: { title: 'Công thức yêu thích', icon: Heart, itemType: 'recipe' as const },
  your_recipe: { title: 'Công thức của bạn', icon: BookOpen, itemType: 'recipe' as const },
};

type TabKey = keyof typeof TAB_CONFIG;

interface RecipePageProps {
  initialTab?: TabKey;
}

interface RecipeItem {
  id: number;
  title: string;
  description: string;
  author: string;
  likes: number;
  imageUrl: string;
}

const RecipePage: React.FC<RecipePageProps> = ({ initialTab = 'favorite' }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [currentTab, setCurrentTab] = useState<TabKey>(initialTab);
  const [items, setItems] = useState<RecipeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const config = TAB_CONFIG[currentTab];
  const Icon = config.icon;

  useEffect(() => {
    const fetchData = async () => {
      // Kiểm tra authentication
      if (!isAuthenticated) {
        setItems([]);
        setLoading(false);
        return;
      }
      console.log('Fetching data for tab:', currentTab);
      console.log('User data:', user);
      if (!user?.id) {
        console.log('Waiting for user data...');
        return;
      }

      console.log('Current Tab:', currentTab);
      console.log('User ID:', user.id);

      setLoading(true);
      
      try {
        let recipes: Recipe[] = [];
        
        if (currentTab === 'your_recipe') {
          console.log('Fetching user recipes...');
          const response = await getUserRecipes(user.id, { page: 1, pageSize: 50 });
          console.log('User recipes response:', response);
          if (response.status === "success" && response.data?.recipes) {
            recipes = response.data.recipes;
          }
        } else if (currentTab === 'favorite') {
          console.log('Fetching voted recipes...');
          const response = await getUserVotedRecipes(user.id, { page: 1, pageSize: 50 });
          console.log('Voted recipes response:', response);
          if (response.status === "success" && response.data?.recipes) {
            recipes = response.data.recipes;
          }
        }

        console.log('Fetched recipes:', recipes);

        const mappedItems: RecipeItem[] = recipes.map((recipe) => ({
          id: recipe.id,
          title: recipe.name,
          description: recipe.description || 'Công thức ngon từ cộng đồng',
          author: recipe.user?.name || 'Ẩn danh',
          likes: (recipe.votes?.length || 0) + (recipe.votedUserIds?.length || 0),
          imageUrl: recipe.thumbnails?.[0]?.url || '/pwa-512x512.png',
        }));

        console.log('Mapped items:', mappedItems);
        setItems(mappedItems);
        
      } catch (err) {
        console.error('Error fetching recipes:', err);
        // Log chi tiết error
        if (err instanceof Error) {
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
        }
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentTab, user?.id, isAuthenticated]); 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header với nút quay lại và tiêu đề */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Quay lại"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2 text-gray-700">
              <Icon size={20} />
              <h2 className="font-semibold text-lg">{config.title}</h2>
            </div>
          </div>
        </div>

      </div>

      {/* Content */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500 py-10">Đang tải...</p>
          ) : items.length > 0 ? (
            items.map((item) => (
              <ListItemRenderer
                key={item.id}
                item={item}
                type={config.itemType}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">
              Chưa có công thức nào
            </p>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-10">
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
          <ArrowLeft size={20} />
        </button>

        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-blue-500 text-white font-semibold shadow-md">
            1
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            2
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            3
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            4
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            5
          </button>
        </div>

        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default RecipePage;