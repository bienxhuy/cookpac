import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle } from 'lucide-react';
import FoodCard1 from '../components/FoodCard1';
import FoodCard2 from '../components/FoodCard2';
import { getTopVotedToday, getNewRecipes, getRandomRecipes } from '../services/recipe.service';
import { Recipe } from '../types/recipe.type';

export default function HomePage() {
  const navigate = useNavigate();
  const [topVoted, setTopVoted] = useState<Recipe[]>([]);
  const [newRecipes, setNewRecipes] = useState<Recipe[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const [topVotedRes, newRecipesRes, randomRecipesRes] = await Promise.all([
          getTopVotedToday(5),
          getNewRecipes(5),
          getRandomRecipes(5),
        ]);

        setTopVoted(topVotedRes.data || []);
        setNewRecipes(newRecipesRes.data || []);
        setRandomRecipes(randomRecipesRes.data || []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header with Search */}
      <div className="px-6 mb-2 max-w-2xl mx-auto pt-6">        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for recipes..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-dark-blue-dark"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-3 space-y-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading recipes...</p>
          </div>
        ) : (
          <>
            {/* Top Voted Today Section */}
            <section className='mb-5'>
              <h2 className="text-xl text-dark-blue font-bold mb-3 flex items-center gap-2 border-l-4 border-dark-blue pl-3">
                Top Voted Today
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topVoted.length > 0 ? (
                  topVoted.map((recipe) => (
                    <FoodCard2
                      key={recipe.id}
                      title={recipe.name}
                      author={recipe.user?.name || 'Unknown'}
                      likes={recipe.votes?.length || 0}
                      description={recipe.description}
                      imageUrl={recipe.thumbnails?.[0]?.url}
                      recipeId={recipe.id}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full">No top voted recipes today</p>
                )}
              </div>
            </section>

            {/* New Recipes Section */}
            <section className='mb-5'>
              <h2 className="text-xl text-dark-blue font-bold mb-3 flex items-center gap-2 border-l-4 border-dark-blue pl-3">
                New Recipes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {newRecipes.length > 0 ? (
                  newRecipes.map((recipe) => (
                    <FoodCard1
                      key={recipe.id}
                      title={recipe.name}
                      author={recipe.user?.name || 'Unknown'}
                      likes={recipe.votes?.length || 0}
                      imageUrl={recipe.thumbnails?.[0]?.url}
                      recipeId={recipe.id}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full">No new recipes available</p>
                )}
              </div>
            </section>

            {/* Try It Out (Random) Section */}
            <section>
              <h2 className="text-xl text-dark-blue font-bold mb-3 flex items-center gap-2 border-l-4 border-dark-blue pl-3">
                Try It Out
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {randomRecipes.length > 0 ? (
                  randomRecipes.map((recipe) => (
                    <FoodCard1
                      key={recipe.id}
                      title={recipe.name}
                      author={recipe.user?.name || 'Unknown'}
                      likes={recipe.votes?.length || 0}
                      imageUrl={recipe.thumbnails?.[0]?.url}
                      recipeId={recipe.id}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full">No recipes available</p>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Floating Button to Bot */}
      <button
        onClick={() => navigate('/bot')}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 z-50"
        aria-label="Chat with bot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
