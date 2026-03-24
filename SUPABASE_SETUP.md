# Подключение Supabase к проекту - Инструкция

## ✅ Что было сделано:

Все три контекста (`products-context.tsx`, `order-context.tsx`, `cart-context.tsx`) обновлены для работы с Supabase:

### 1. **products-context.tsx**
- ✅ Загрузка продуктов из таблицы `products` в `useEffect`
- ✅ Обновление доступности товара в базе при вызове `updateAvailability()`
- ✅ Добавлены состояния `loading` и `error` для отслеживания состояния

### 2. **order-context.tsx**
- ✅ Загрузка настроек заказов из таблицы `order_settings`
- ✅ Загрузка временных слотов из таблицы `slots`
- ✅ Обновление настроек в `setOrderOpen()`
- ✅ Обновление слотов в `updateSlot()`

### 3. **cart-context.tsx**
- ✅ Добавлен метод `saveOrder()` для сохранения заказа в таблицу `orders`
- ✅ Автоматическая очистка корзины после успешного заказа
- ✅ Интерфейс `OrderData` для типизации данных заказа

### 4. **lib/supabase.ts**
- ✅ Клиент Supabase готов к использованию

---

## 📝 Следующие шаги:

### Шаг 1: Установка пакета (если не установлен)
```bash
npm install @supabase/supabase-js
# или
pnpm add @supabase/supabase-js
```

### Шаг 2: Получение API ключей в Supabase
1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект или откройте существующий
3. В меню слева: **Settings → API**
4. Скопируйте:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Шаг 3: Добавление переменных в `.env.local`
Файл `.env.local` уже создан в корне проекта. Замените значения:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Шаг 4: Создание таблиц в Supabase
1. Откройте **SQL Editor** в Supabase панели
2. Скопируйте весь код из файла `database-setup.sql` в проекте
3. Нажмите **Run** (или ⌘+Enter)

Этот скрипт создает 4 таблицы:
- **products** — список товаров
- **slots** — временные слоты доставки
- **order_settings** — глобальные настройки (открыт ли прием заказов)
- **orders** — сохраненные заказы

### Шаг 5: Вставка данных товаров (опционально)
Если хотите заполнить таблицу `products` начальными данными из вашего файла `data/products.ts`, используйте Supabase UI или SQL:

```sql
INSERT INTO products (id, name, description, price, image, isAvailable) VALUES
  ('1', 'Пельмени', '...', 150, '...', TRUE),
  -- ... остальные товары
```

---

## 🔄 Как это работает:

### При загрузке приложения:
1. **ProductsProvider** загружает продукты из `products` таблицы
2. **OrderProvider** загружает настройки и слоты из `order_settings` и `slots` таблиц
3. Эти данные доступны во всем приложении через контексты

### При добавлении товара в корзину:
- Корзина обновляется локально (для быстроты)

### При оформлении заказа:
- Вызывается `saveOrder()` из `CartProvider`
- Заказ сохраняется в таблице `orders`
- Корзина очищается

### При изменении доступности товара (админка):
- Вызывается `updateAvailability()` из `ProductsProvider`
- Обновляется статус в таблице `products`

---

## ⚙️ Дополнительная настройка (опционально)

### Row Level Security (RLS)
Рекомендуется включить RLS для безопасности:
1. В Supabase → Tables → выберите таблицу
2. Нажмите на кнопку **RLS**
3. Включите RLS и установите политики доступа

### Аутентификация админа
Для защиты админ-панели добавьте Supabase Auth в `app/admin/page.tsx`

---

## 🐛 Если есть ошибки:

1. **"Missing Supabase credentials"** — Заполните `.env.local` ключи
2. **"Connection error"** — Проверьте переменные окружения в `.env.local`
3. **"Table does not exist"** — Выполните SQL скрипт из `database-setup.sql`

---

## ✨ Готово!
Ваше приложение теперь подключено к Supabase! 🎉
