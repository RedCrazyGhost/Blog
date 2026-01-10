import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

const cnamePath = join(process.cwd(), 'CNAME');
const distCnamePath = join(process.cwd(), 'dist', 'CNAME');

if (existsSync(cnamePath)) {
  copyFileSync(cnamePath, distCnamePath);
  console.log('CNAME file copied to dist directory');
} else {
  console.warn('CNAME file not found, skipping copy');
}
