# Настройка Supabase для аутентификации и управления пользователями

## 1. Переменные окружения

Добавьте в `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Настройка базы данных

1. Откройте Supabase Dashboard → SQL Editor
2. Выполните скрипт `database-setup.sql`
3. Это создаст все необходимые таблицы и политики RLS

## 3. Настройка Storage Bucket

1. Перейдите в Supabase Dashboard → Storage
2. Создайте новый bucket с именем `product-images`
3. Установите политику доступа:
   - **Allow public access** - включено
   - Добавьте следующие политики в SQL Editor:

```sql
-- Разрешить публичную загрузку изображений
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Разрешить публичный доступ к изображениям
CREATE POLICY "Allow public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
```

## 4. Настройка аутентификации

1. Перейдите в Supabase Dashboard → Authentication → Settings
2. Настройте параметры:
   - **Site URL**: `http://localhost:3000` (для разработки)
   - **Redirect URLs**: добавьте `http://localhost:3000/auth/login`

## 5. Создание первого администратора

После настройки выполните в браузере:

1. Перейдите на `/auth/register`
2. Зарегистрируйтесь с email и паролем
3. В Supabase Dashboard → Table Editor → profiles
4. Измените роль пользователя на 'admin'

## 6. Структура таблиц

### profiles
- `id` (UUID) - ссылка на auth.users
- `email` (TEXT) - email пользователя
- `role` (TEXT) - 'admin' или 'cashier'
- `created_at/updated_at` (TIMESTAMP)

### products
- `id` (SERIAL) - первичный ключ
- `name` (TEXT) - название блюда
- `description` (TEXT) - описание
- `price` (INTEGER) - цена в рублях
- `image` (TEXT) - URL изображения
- `available` (BOOLEAN) - доступность
- `created_at/updated_at` (TIMESTAMP)

### time_slots
- `id` (SERIAL) - первичный ключ
- `time` (TEXT) - время слота (например, "10:00 - 12:00")
- `max_orders` (INTEGER) - максимальное количество заказов
- `is_active` (BOOLEAN) - активен ли слот
- `created_at/updated_at` (TIMESTAMP)

### orders
- `id` (SERIAL) - первичный ключ
- `customer_name` (TEXT) - имя заказчика
- `customer_phone` (TEXT) - телефон
- `customer_email` (TEXT) - email
- `delivery_address` (TEXT) - адрес доставки
- `delivery_slot_id` (INTEGER) - ссылка на time_slots
- `items` (JSONB) - массив товаров
- `total_amount` (INTEGER) - общая сумма
- `status` (TEXT) - статус заказа
- `created_at/updated_at` (TIMESTAMP)

### order_settings
- `id` (SERIAL) - первичный ключ
- `is_open` (BOOLEAN) - открыт ли прием заказов
- `created_at/updated_at` (TIMESTAMP)

## 7. Row Level Security (RLS)

Все таблицы защищены RLS политиками:

- **profiles**: пользователи видят только свой профиль, админы видят все
- **products**: чтение для всех авторизованных, изменения только для админов
- **time_slots**: чтение для всех, изменения только для админов
- **orders**: пользователи видят свои заказы, админы/кассиры видят все
- **order_settings**: чтение для всех, изменения только для админов

## 8. Тестирование

1. Зарегистрируйтесь как администратор
2. Создайте несколько продуктов
3. Зарегистрируйтесь как кассир
4. Проверьте доступ к разным разделам