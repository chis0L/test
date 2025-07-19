// Утилита для загрузки файлов на S3/Swift через fetch
// Используйте только для публичных бакетов или временных ключей!

const S3_URL = 'https://s3.twcstorage.ru';
const BUCKET = '617774af-newworker';
const ACCESS_KEY = 'I6XD2OR7YO2ZN6L6Z629';
const SECRET_KEY = '9xCOoafisG0aB9lJNvdLO1UuK73fBvMcpHMdijrJ';

// В реальном проекте ключи должны храниться на сервере!

export async function uploadToS3(file: File, folder = 'avatars') {
  const fileName = `${folder}/${Date.now()}_${file.name}`;
  const url = `${S3_URL}/${BUCKET}/${fileName}`;

  // Прямая загрузка (если бакет публичный, иначе нужен presigned url)
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'x-amz-acl': 'public-read',
      // Для приватных бакетов нужен presigned url!
    },
    body: file,
  });

  if (!res.ok) throw new Error('Ошибка загрузки файла на S3');
  return `${S3_URL}/${BUCKET}/${fileName}`;
} 