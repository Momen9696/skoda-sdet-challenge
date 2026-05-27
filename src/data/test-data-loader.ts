import fs from 'fs';
import path from 'path';

export function loadJsonData<T>(relativePath: string): T {
  const fullPath = path.resolve(__dirname, '../../resources', relativePath);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(raw) as T;
}
