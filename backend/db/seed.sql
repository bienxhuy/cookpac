-- 1. AREA 
INSERT INTO area (name, "isActive", "createdAt", "updatedAt") VALUES
('Miền Bắc', true, NOW(), NOW()),
('Miền Trung', true, NOW(), NOW()),
('Miền Nam', true, NOW(), NOW()),
('Thái Lan', true, NOW(), NOW()),
('Trung Quốc', true, NOW(), NOW()),
('Nhật Bản', true, NOW(), NOW()),
('Ý', true, NOW(), NOW()),
('Ấn Độ', true, NOW(), NOW()),
('Hàn Quốc', true, NOW(), NOW()),
('Mexico', true, NOW(), NOW());

-- 2. USER
INSERT INTO "user" (name, email, password, role, "createdAt", "updatedAt") VALUES
('Admin User', 'admin@example.com', '$2a$12$63RJiGqq2oim022yPOpHCO853pPCnRygVFXI6zr2Ii8uHwbFScNIa', 'ADMIN', NOW(), NOW()),
('John Doe', 'john@example.com', '$2a$12$63RJiGqq2oim022yPOpHCO853pPCnRygVFXI6zr2Ii8uHwbFScNIa', 'REGULAR_USER', NOW(), NOW());

-- 3. RECIPE
INSERT INTO recipe (name, description, "userId", "areaId", "createdAt", "updatedAt") VALUES
('Phở bò', 'Món phở bò truyền thống thơm ngon của miền Bắc', 1, 1, NOW(), NOW()),          
('Phở gà', 'Phở gà thanh nhẹ, đặc trưng Hà Nội', 1, 1, NOW(), NOW()),                     
('Bún chả', 'Bún chả Obama nổi tiếng Hà Nội', 1, 1, NOW(), NOW()),                        
('Bánh mì thịt', 'Bánh mì Sài Gòn giòn tan, nhân đầy đặn', 1, 3, NOW(), NOW()),            
('Carbonade Flamande', 'Món bò hầm bia kiểu Bỉ (gần với phong cách Âu)', 1, 7, NOW(), NOW());

-- 4. INGREDIENT
INSERT INTO ingredient (name) VALUES
('Rice noodles'), ('Beef'), ('Chicken'), ('Pork'), ('Fish sauce'),
('Sugar'), ('Garlic'), ('Shallot'), ('Bread'), ('Beef chuck'),
('Onion'), ('Butter'), ('Beer');

-- 5. RECIPE_INGREDIENT
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

INSERT INTO category (name, "isActive", "createdAt", "updatedAt") VALUES
('Món chính', true, NOW(), NOW()),
('Món khai vị', true, NOW(), NOW()),
('Tráng miệng', true, NOW(), NOW()),
('Đồ uống', true, NOW(), NOW()),
('Lẩu / Nướng', true, NOW(), NOW()),
('Món chay', true, NOW(), NOW()),
('Món súp', true, NOW(), NOW()),
('Salad', true, NOW(), NOW()),
('Bánh mì / Sandwich', true, NOW(), NOW()),
('Mì / Phở / Bún', true, NOW(), NOW()),
('Cơm', true, NOW(), NOW()),
('Món Âu', true, NOW(), NOW()),
('Món Á', true, NOW(), NOW());

INSERT INTO recipe_categories_category ("recipeId", "categoryId") VALUES
(1, 10), -- Phở bò → Mì / Phở / Bún
(1, 1),  -- Phở bò → Món chính
(2, 10), -- Phở gà → Mì / Phở / Bún
(2, 1),  -- Phở gà → Món chính
(3, 10), -- Bún chả → Mì / Phở / Bún
(3, 1),  -- Bún chả → Món chính
(4, 9),  -- Bánh mì thịt → Bánh mì / Sandwich
(4, 1),  -- Bánh mì thịt → Món chính
(5, 12), -- Flemish Carbonade → Món Âu
(5, 1);  -- Flemish Carbonade → Món chính