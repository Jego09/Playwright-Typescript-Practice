import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

export function getTestDataFromCSV(filePath: string): Record<string, string>[] {
  const fileContent = fs.readFileSync(filePath);
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as Record<string, string>[];
  return records; // always return all rows
}

export function getTestdataFromJsonfile(filename: string): any {
  const filePath = path.resolve(__dirname, '..', filename);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}

