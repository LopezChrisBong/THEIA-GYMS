/**
 * One-off import of "Davao Inventory.xlsx" into jewelry_items.
 * Usage: node scripts/import-davao-inventory.js [--dry-run]
 */
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const mysql = require('mysql2/promise');

const EXCEL_PATH = path.join(__dirname, '..', '..', '..', 'Davao Inventory.xlsx');
const BRANCH_NAME = 'Davao';
const DRY_RUN = process.argv.includes('--dry-run');

const GOLD_TYPE_MAP = {
  YG: 'YG',
  WG: 'WG',
  RG: 'RG',
  '2T': 'TWO_TONED',
  'WG/YG': 'TWO_TONED',
  'YG/WG': 'TWO_TONED',
};

const STONE_TYPE_CANONICAL = {
  'LAB GROWN': 'Lab Grown',
  NATURAL: 'Natural',
  MOISSANITE: 'Moissanite',
};

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  const env = {};
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  });
  return env;
}

function norm(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
}

async function findOrCreate(conn, table, column, value, cache) {
  if (cache.has(value)) return cache.get(value);
  const [rows] = await conn.execute(`SELECT id FROM ${table} WHERE ${column} = ?`, [value]);
  let id;
  if (rows.length) {
    id = rows[0].id;
  } else {
    const [result] = await conn.execute(
      `INSERT INTO ${table} (${column}, created_at) VALUES (?, NOW(6))`,
      [value],
    );
    id = result.insertId;
  }
  cache.set(value, id);
  return id;
}

async function main() {
  const env = loadEnv();
  const wb = xlsx.readFile(EXCEL_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: null });
  const dataRows = rows.slice(1).filter((r) => r.some((c) => c !== null && c !== ''));

  const conn = await mysql.createConnection({
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT || 3306),
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  });

  try {
    const [branchRows] = await conn.execute('SELECT id FROM branches WHERE branchName = ?', [BRANCH_NAME]);
    if (!branchRows.length) throw new Error(`Branch "${BRANCH_NAME}" not found`);
    const branchId = branchRows[0].id;

    const categoryCache = new Map();
    const jewelryTypeCache = new Map();
    const stoneTypeCache = new Map();

    // Resolve duplicate item codes: first occurrence keeps its code, later ones get -2, -3, ...
    const codeSeen = new Map();
    const codeSuffixLog = [];

    const toInsert = [];
    for (const r of dataRows) {
      const [catRaw, typeRaw, codeRaw, nameRaw, descRaw, karatRaw, colorRaw, diamondRaw, caratRaw, sizeRaw, bandRaw, priceRaw] = r;

      const catName = norm(catRaw) || 'JEWELRY';
      const categoryId = await findOrCreate(conn, 'categories', 'category_name', catName, categoryCache);

      const typeName = norm(typeRaw);
      const jewelryTypeId = typeName
        ? await findOrCreate(conn, 'jewelry_types', 'name', typeName, jewelryTypeCache)
        : null;

      const diamondRawNorm = norm(diamondRaw);
      let stoneTypeId = null;
      if (diamondRawNorm) {
        const canonical = STONE_TYPE_CANONICAL[diamondRawNorm.toUpperCase()] || diamondRawNorm;
        stoneTypeId = await findOrCreate(conn, 'stone_types', 'name', canonical, stoneTypeCache);
      }

      let code = norm(codeRaw);
      const seenCount = (codeSeen.get(code) || 0) + 1;
      codeSeen.set(code, seenCount);
      if (seenCount > 1) {
        const newCode = `${code}-${seenCount}`;
        codeSuffixLog.push({ original: code, resolved: newCode, name: norm(nameRaw) });
        code = newCode;
      }

      const colorNorm = norm(colorRaw);
      let goldType = null;
      if (colorNorm) {
        const key = colorNorm.toUpperCase().replace(/\s+/g, '');
        goldType = GOLD_TYPE_MAP[key] || null;
      }

      const priceNum = typeof priceRaw === 'number' ? priceRaw : parseFloat(String(priceRaw).replace(/[^0-9.]/g, ''));

      toInsert.push({
        itemCode: code,
        categoryId,
        name: norm(nameRaw),
        color: colorNorm,
        goldType,
        stoneTypeId,
        jewelryTypeId,
        karat: norm(karatRaw),
        carat: norm(caratRaw),
        size: sizeRaw === null ? null : String(sizeRaw).trim(),
        bandWidth: norm(bandRaw),
        price: Number.isFinite(priceNum) ? priceNum : null,
        description: norm(descRaw),
        branchId,
      });
    }

    console.log(`Parsed ${toInsert.length} rows from "${path.basename(EXCEL_PATH)}".`);
    console.log(`Lookups -> categories: ${categoryCache.size}, jewelry types: ${jewelryTypeCache.size}, stone types: ${stoneTypeCache.size}`);
    if (codeSuffixLog.length) {
      console.log(`Resolved ${codeSuffixLog.length} duplicate item code(s):`);
      codeSuffixLog.forEach((d) => console.log(`  ${d.original} -> ${d.resolved}  (${d.name})`));
    }

    if (DRY_RUN) {
      console.log('\n--dry-run set: no rows written. Sample of first 3 mapped rows:');
      console.log(JSON.stringify(toInsert.slice(0, 3), null, 2));
      return;
    }

    await conn.beginTransaction();
    let inserted = 0;
    for (const item of toInsert) {
      await conn.execute(
        `INSERT INTO jewelry_items
         (item_code, category_id, name, color, gold_type, stone_type_id, jewelry_type_id, karat, carat, size, band_width, price, description, branch_id, status, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'IN_STOCK', 1, NOW(6), NOW(6))`,
        [
          item.itemCode, item.categoryId, item.name, item.color, item.goldType,
          item.stoneTypeId, item.jewelryTypeId, item.karat, item.carat, item.size,
          item.bandWidth, item.price, item.description, item.branchId,
        ],
      );
      inserted++;
    }
    await conn.commit();
    console.log(`\nInserted ${inserted} jewelry items into branch "${BRANCH_NAME}" (id ${branchId}).`);
  } catch (err) {
    await conn.rollback().catch(() => {});
    throw err;
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
