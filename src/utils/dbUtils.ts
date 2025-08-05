import initSqlJs from 'sql.js';
import dbUrl from '../data/aesop_fables.db?url';

let SQL: any = null;
let db: any = null;

async function initializeDatabase() {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });
  }
  
  if (!db) {
    try {
      const response = await fetch(dbUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch database: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      db = new SQL.Database(uint8Array);
    } catch (error) {
      console.error('Error loading database:', error);
      throw new Error('Could not load the stories database');
    }
  }
  
  return db;
}

export async function getRandomStoryFromDb(): Promise<string> {
  try {
    const database = await initializeDatabase();
    
    // Try common table and column names for fables/stories
    // Filter stories to 200 words or fewer (approximately 1000 characters)
    const possibleQueries = [
      "SELECT text FROM stories WHERE LENGTH(TRIM(text)) > 50 AND LENGTH(text) <= 1000 AND (LENGTH(text) - LENGTH(REPLACE(text, ' ', '')) + 1) <= 200 ORDER BY RANDOM() LIMIT 1",
      "SELECT content FROM stories WHERE LENGTH(TRIM(content)) > 50 AND LENGTH(content) <= 1000 AND (LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1) <= 200 ORDER BY RANDOM() LIMIT 1", 
      "SELECT story FROM stories WHERE LENGTH(TRIM(story)) > 50 AND LENGTH(story) <= 1000 AND (LENGTH(story) - LENGTH(REPLACE(story, ' ', '')) + 1) <= 200 ORDER BY RANDOM() LIMIT 1",
      "SELECT text FROM fables WHERE LENGTH(TRIM(text)) > 50 AND LENGTH(text) <= 1000 AND (LENGTH(text) - LENGTH(REPLACE(text, ' ', '')) + 1) <= 200 ORDER BY RANDOM() LIMIT 1",
      "SELECT content FROM fables WHERE LENGTH(TRIM(content)) > 50 AND LENGTH(content) <= 1000 AND (LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1) <= 200 ORDER BY RANDOM() LIMIT 1",
      "SELECT story FROM fables WHERE LENGTH(TRIM(story)) > 50 AND LENGTH(story) <= 1000 AND (LENGTH(story) - LENGTH(REPLACE(story, ' ', '')) + 1) <= 200 ORDER BY RANDOM() LIMIT 1",
      "SELECT text FROM aesop_fables WHERE LENGTH(TRIM(text)) > 50 AND LENGTH(text) <= 1000 AND (LENGTH(text) - LENGTH(REPLACE(text, ' ', '')) + 1) <= 200 ORDER BY RANDOM() LIMIT 1",
      "SELECT content FROM aesop_fables WHERE LENGTH(TRIM(content)) > 50 AND LENGTH(content) <= 1000 AND (LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1) <= 200 ORDER BY RANDOM() LIMIT 1"
    ];
    
    let result = null;
    let lastError = null;
    
    // Try each query until one works
    for (const query of possibleQueries) {
      try {
        const stmt = database.prepare(query);
        const rows = stmt.getAsObject({});
        stmt.free();
        
        if (rows && Object.keys(rows).length > 0) {
          const textColumn = Object.keys(rows)[0];
          result = rows[textColumn];
          break;
        }
      } catch (error) {
        lastError = error;
        continue;
      }
    }
    
    if (!result) {
      // If no queries worked, try to get table info to help debug
      try {
        const tablesStmt = database.prepare("SELECT name FROM sqlite_master WHERE type='table'");
        const tables = [];
        while (tablesStmt.step()) {
          const row = tablesStmt.getAsObject();
          tables.push(row.name);
        }
        tablesStmt.free();
        
        console.error('Available tables:', tables);
        throw new Error(`Could not find story data. Available tables: ${tables.join(', ')}`);
      } catch (error) {
        throw new Error('Could not read from the stories database');
      }
    }
    
    return result as string;
    
  } catch (error) {
    console.error('Error fetching random story:', error);
    throw error;
  }
}

export async function getTableInfo(): Promise<{ tables: string[], columns: { [table: string]: string[] } }> {
  try {
    const database = await initializeDatabase();
    
    // Get table names
    const tablesStmt = database.prepare("SELECT name FROM sqlite_master WHERE type='table'");
    const tables: string[] = [];
    while (tablesStmt.step()) {
      const row = tablesStmt.getAsObject();
      tables.push(row.name as string);
    }
    tablesStmt.free();
    
    // Get column info for each table
    const columns: { [table: string]: string[] } = {};
    for (const table of tables) {
      try {
        const columnsStmt = database.prepare(`PRAGMA table_info(${table})`);
        const tableColumns: string[] = [];
        while (columnsStmt.step()) {
          const row = columnsStmt.getAsObject();
          tableColumns.push(row.name as string);
        }
        columnsStmt.free();
        columns[table] = tableColumns;
      } catch (error) {
        console.error(`Error getting columns for table ${table}:`, error);
        columns[table] = [];
      }
    }
    
    return { tables, columns };
  } catch (error) {
    console.error('Error getting table info:', error);
    throw error;
  }
}