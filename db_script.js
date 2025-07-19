const { Client } = require("pg");

const client = new Client({
  connectionString:
    "postgresql://biveki:0DlsKfd__Q@85.234.110.60:5432/bivekigroup",
});

async function main() {
  await client.connect();
  // Ищем дубли по (employeeId, date)
  const dupRes = await client.query(`
    SELECT "employeeId", date, COUNT(*) as count
    FROM "EmployeeSchedule"
    GROUP BY "employeeId", date
    HAVING COUNT(*) > 1;
  `);
  if (dupRes.rows.length === 0) {
    console.log(
      "Дублей по (employeeId, date) не найдено. Можно добавлять уникальный индекс."
    );
  } else {
    console.log("Найдены дубли по (employeeId, date):");
    console.table(dupRes.rows);
  }
  await client.end();
}

main().catch((e) => console.error(e));
