# Employee Management System

## Описание

Полнофункциональная система управления сотрудниками компании. Позволяет добавлять, редактировать, удалять сотрудников, управлять их расписанием и просматривать статистику.

## Технологический стек

- **Frontend:** Next.js 15+ (App Router), TypeScript, TailwindCSS, shadcn/ui, Radix UI, Lucide React, Sonner
- **Backend:** Apollo Server (GraphQL), TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Storage:** S3/Swift (загрузка файлов)

## Основные фичи

- Вкладки: Сотрудники, Расписание, Статистика
- Фильтры, поиск, пагинация
- Inline-формы добавления/редактирования
- Маски ввода, валидация, загрузка файлов
- Уведомления, анимации, адаптивность
- Календарь расписания, графики статистики

## Запуск проекта

### 1. Backend

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Сгенерируйте Prisma Client и примените схему:
   ```bash
   npx prisma generate
   npx prisma db push --accept-data-loss
   ```
3. Запустите Apollo Server:
   ```bash
   node server.cjs
   ```
   Сервер будет доступен на http://localhost:4000/

### 2. Frontend

1. Перейдите в папку frontend:
   ```bash
   cd frontend
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
   Приложение будет доступно на http://localhost:3000/

## Архитектура

- **src/app/employees/** — страница сотрудников, вкладки, фильтры, формы
- **src/components/employees/** — UI-компоненты (карточки, формы, календарь, статистика)
- **src/graphql/** — запросы и мутации Apollo Client
- **src/lib/** — утилиты, загрузка файлов, маски
- **prisma/schema.prisma** — описание моделей
- **graphql/** — typedefs и resolvers для Apollo Server

## Переменные окружения

- Строка подключения к PostgreSQL указывается в `.env` (DATABASE_URL)
- Ключи для S3/Swift прописаны в `src/lib/s3upload.ts` (для продакшена вынести на сервер!)

## Демо

- После запуска backend и frontend откройте http://localhost:3000/employees

---

**Автор:** chis0l

---

Для вопросов и поддержки — пишите!

# test
