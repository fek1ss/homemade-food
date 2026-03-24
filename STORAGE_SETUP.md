# Supabase Storage Setup для загрузки изображений

## Описание
Админ-панель теперь поддерживает загрузку изображений блюд в Supabase Storage.

## Требуемая конфигурация Supabase

### 1. Создание Storage Bucket

1. Откройте Supabase Dashboard
2. Перейдите в **Storage** (в левом меню)
3. Нажмите **Create a new bucket**
4. Введите имя: `product-images`
5. **Отключите** "Make it private" (галочка должна быть убрана)
6. Нажмите **Create bucket**

### 2. Настройка Row Level Security (RLS) для Storage

1. В **Storage** → **product-images** нажмите меню (три точки)
2. Выберите **Policies**
3. Нажмите **Create policy**
4. Выберите **For SELECT** → **PUBLIC**
   - Name: `Public Read`
   - Expression: `true`
   - Нажмите **Review** → **Create policy**

### 3. Проверка доступа к Storage

После создания хотя бы одного изображения, вы можете получить его публичный URL, который будет выглядеть так:
```
https://your-project.supabase.co/storage/v1/object/public/product-images/public/1234567890-image.jpg
```

## Как работает загрузка в админ-панели

1. Администратор заполняет форму "Добавить новое блюдо":
   - Название
   - Описание
   - Цена
   - Изображение (файл)

2. При нажатии кнопки "Добавить продукт":
   - Изображение загружается в Supabase Storage (`product-images/public/`)
   - Получается публичный URL
   - Создается запись в таблице `products` с URL изображения
   - Таблица обновляется на странице

## Текущая структура данных

```sql
-- products таблица
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
description TEXT,
price INTEGER NOT NULL,
image TEXT,  -- URL изображения в Supabase Storage
available BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT NOW()
```

## Возможные ошибки и решения

### "Bucket not found"
**Решение:** Убедитесь, что bucket `product-images` создан в Supabase Storage

### "Failed to upload image"
**Решение:** Проверьте:
- Размер файла (не более 50 MB)
- Тип файла (JPEG, PNG, WebP, GIF)
- Права доступа на bucket (должны быть публичные)

### "Object not found" при получении URL
**Решение:** Проверьте, что файл успешно загрузился (посмотрите в Supabase Storage → product-images)

## Будущие улучшения

- [ ] Оптимизация изображений перед загрузкой
- [ ] Автоматическое удаление изображения при удалении продукта
- [ ] Поддержка редактирования продуктов
- [ ] Загрузка нескольких изображений для одного блюда
