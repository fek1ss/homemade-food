# Полный гайд по настройке приложения с Supabase

## ✅ Что было обновлено

### 1. Админ-панель (`/app/admin/page.tsx`)
- ✅ Функция добавления новых блюд с формой
- ✅ Загрузка изображений в Supabase Storage
- ✅ Удаление продуктов
- ✅ Управление временными слотами доставки
- ✅ Глобальный статус приема заказов
- ✅ Статистика продуктов

### 2. Главная страница (`/app/page.tsx`)
- ✅ Загрузка всех продуктов из Supabase
- ✅ Обработка состояния загрузки
- ✅ Отображение меню на основе данных БД

### 3. Контексты
- ✅ **products-context.tsx** — загружает продукты из БД (без mock data)
- ✅ **order-context.tsx** — работает с временными слотами из `time_slots` таблицы
- ✅ **cart-context.tsx** — сохраняет заказы в `orders` таблицу

### 4. Компоненты
- ✅ **admin-product-card.tsx** — добавлена возможность удаления продуктов
- ✅ **product-card.tsx** — использует данные из Supabase
- ✅ **cart-context.tsx** — загрузка изображений не требуется (всё загружается в админке)

---

## 🚀 Пошаговая настройка

### Шаг 1: Убедитесь, что переменные окружения установлены

Проверьте файл `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Если значения пусты, скопируйте их из Supabase:
1. Откройте Supabase Dashboard
2. Settings → API
3. Скопируйте Project URL и anon public key

### Шаг 2: Создайте таблицы в Supabase

В Supabase SQL Editor выполните:

```sql
-- Таблица продуктов
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица слотов доставки
CREATE TABLE IF NOT EXISTS time_slots (
  id SERIAL PRIMARY KEY,
  time TEXT NOT NULL UNIQUE,
  capacity INTEGER DEFAULT 10,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица заказов
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  time_slot TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Вставьте начальные слоты
INSERT INTO time_slots (time, capacity, available) VALUES
  ('12:00', 10, TRUE),
  ('16:00', 10, TRUE),
  ('20:00', 10, TRUE)
ON CONFLICT DO NOTHING;
```

### Шаг 3: Настройте Storage для изображений

1. Откройте Supabase Dashboard
2. **Storage** → **Create a new bucket**
3. Имя: `product-images`
4. **Отключите** "Make it private"
5. Нажмите **Create bucket**

Затем создайте политику доступа:
1. **Storage** → **product-images** → **Policies**
2. **Create policy** → **FOR SELECT** → **PUBLIC**
   - Name: `Public Read`
   - Expression: `true`
   - **Create policy**

### Шаг 4: Установите пакет Supabase (если не установлен)

```bash
npm install @supabase/supabase-js
# или
pnpm add @supabase/supabase-js
```

### Шаг 5: Запустите приложение

```bash
npm run dev
# или
pnpm dev
```

Откройте http://localhost:3000

---

## 📖 Как пользоваться

### Добавление нового блюда

1. Откройте http://localhost:3000/admin
2. Нажмите кнопку **"Добавить"** в разделе "Добавить новое блюдо"
3. Заполните форму:
   - **Название** — название блюда
   - **Описание** — описание и состав
   - **Цена** — цена в рублях
   - **Изображение** — выберите файл (JPG, PNG, WebP)
4. Нажмите **"Добавить продукт"**
5. После загрузки продукт появится на главной странице

### Управление продуктами

- **Изменить доступность** — нажмите кнопку "В наличии"/"Не в наличии" на карточке
- **Удалить продукт** — нажмите красную кнопку с иконкой корзины

### Управление слотами доставки

В разделе "Управление слотами доставки":
- Измените вместимость каждого слота
- Включите/отключите слот с помощью переключателя

### Глобальный статус заказов

В разделе "Статус приёма заказов":
- Включите/отключите прием заказов для всех клиентов

---

## 🔄 Как работает синхронизация

```
Админ добавляет продукт
        ↓
Файл загружается в Supabase Storage
        ↓
Получается публичный URL изображения
        ↓
Запись создается в таблице products
        ↓
ProductsProvider загружает обновленный список
        ↓
Главная страница показывает новый продукт
```

---

## 🐛 Частые проблемы

### "Продукт не появляется после добавления"
- Проверьте консоль браузера (F12) на ошибки
- Убедитесь, что таблица `products` существует
- Проверьте, что Storage bucket `product-images` создан

### "Изображение не загружается"
- Убедитесь, что файл выбран и это изображение
- Проверьте размер файла (не более 50 MB)
- Проверьте права доступа Storage bucket (должен быть публичным)

### "Слоты не обновляются"
- Проверьте таблицу `time_slots` в Supabase
- Убедитесь, что поля называются `capacity` и `available`

---

## 📚 Файлы для изучения

| Файл | Описание |
|------|----------|
| [app/admin/page.tsx](app/admin/page.tsx) | Админ-панель с формой добавления |
| [app/page.tsx](app/page.tsx) | Главная страница с меню |
| [context/products-context.tsx](context/products-context.tsx) | Управление продуктами (Supabase) |
| [context/order-context.tsx](context/order-context.tsx) | Управление слотами (Supabase) |
| [context/cart-context.tsx](context/cart-context.tsx) | Корзина и заказы (Supabase) |
| [lib/supabase.ts](lib/supabase.ts) | Клиент Supabase |

---

## ✨ Готово!

Ваше приложение полностью настроено на работу с Supabase! 🎉

Если у вас есть вопросы или проблемы, проверьте:
1. Суть ошибки в консоли браузера
2. Логи Supabase (Logs в Dashboard)
3. Таблицы и данные в SQL Editor
