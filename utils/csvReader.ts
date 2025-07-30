import fs from 'fs';
import { parse } from 'csv-parse/sync';

export function getTestDataFromCSV(filePath: string): Record<string, string>[] {
  const fileContent = fs.readFileSync(filePath);
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as Record<string, string>[];
  return records; // always return all rows
}

