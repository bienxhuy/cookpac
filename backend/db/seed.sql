-- 1. AREA (không phụ thuộc)
INSERT INTO area (name, "isActive") VALUES
('Vietnam', true),
('France', true);

-- 2. USER (không insert id → để SERIAL tự sinh)
INSERT INTO "user" (name, email, password, role, "createdAt", "updatedAt") VALUES
('Admin User', 'admin@example.com', '$2a$12$63RJiGqq2oim022yPOpHCO853pPCnRygVFXI6zr2Ii8uHwbFScNIa', 'ADMIN', NOW(), NOW()),
('John Doe', 'john@example.com', '$2a$12$63RJiGqq2oim022yPOpHCO853pPCnRygVFXI6zr2Ii8uHwbFScNIa', 'REGULAR_USER', NOW(), NOW());

-- 3. RECIPE (userId = 1 → Admin, areaId = 1 hoặc 2)
INSERT INTO recipe (name, description, "userId", "areaId", "createdAt", "updatedAt") VALUES
('Phở bò', 'Vietnamese beef noodle soup', 1, 1, NOW(), NOW()),
('Phở gà', 'Vietnamese chicken noodle soup', 1, 1, NOW(), NOW()),
('Bún chả', 'Grilled pork with rice vermicelli', 1, 1, NOW(), NOW()),
('Bánh mì thịt', 'Vietnamese baguette sandwich', 1, 1, NOW(), NOW()),
('Flemish Carbonade', 'Belgian beef stew cooked with beer', 1, 2, NOW(), NOW());

-- 4. INGREDIENT
INSERT INTO ingredient (name) VALUES
('Rice noodles'), ('Beef'), ('Chicken'), ('Pork'), ('Fish sauce'),
('Sugar'), ('Garlic'), ('Shallot'), ('Bread'), ('Beef chuck'),
('Onion'), ('Butter'), ('Beer');

-- 5. RECIPE_INGREDIENT (dùng recipeId 1-5 → giờ đã đúng vì recipe id tự sinh từ 1)
INSERT INTO recipe_ingredient ("order", quantity, unit, "recipeId", "ingredientId") VALUES
(1, 200, 'g', 1, 1), (2, 150, 'g', 1, 2), (3, 20, 'ml', 1, 5),
(1, 200, 'g', 2, 1), (2, 150, 'g', 2, 3), (3, 20, 'ml', 2, 5),
(1, 200, 'g', 3, 4), (2, 30, 'ml', 3, 5), (3, 10, 'g', 3, 6),
(1, 1, 'piece', 4, 9), (2, 100, 'g', 4, 4), (3, 10, 'g', 4, 7),
(1, 300, 'g', 5, 10), (2, 1, 'piece', 5, 11), (3, 50, 'g', 5, 12), (4, 200, 'ml', 5, 13);

-- 6. VOTE
INSERT INTO vote ("userId", "recipeId", "createdAt", "updatedAt") VALUES
(1, 1, NOW(), NOW()), (1, 2, NOW(), NOW()), (1, 3, NOW(), NOW()), (1, 4, NOW(), NOW()),
(2, 1, NOW(), NOW()), (2, 3, NOW(), NOW()), (2, 5, NOW(), NOW());

-- 7. NOTIFICATION
INSERT INTO notification (content, link, "isRead", "userId", "createdAt", "updatedAt") VALUES
('Chào mừng bạn đến với ứng dụng công thức nấu ăn!', '/home', false, 1, NOW(), NOW()),
('Công thức Phở bò của bạn vừa nhận được lượt thích mới', '/recipe/1', false, 1, NOW(), NOW()),
('John Doe đã thích công thức Bún chả của bạn', '/recipe/3', false, 1, NOW(), NOW()),
('Có công thức mới từ khu vực Vietnam được đăng!', '/explore/vietnam', true, 2, NOW(), NOW()),
('Bạn có 3 lượt thích mới trong tuần này', '/profile', false, 2, NOW(), NOW());