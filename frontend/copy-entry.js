const fs = require('fs')
const path = require('path')

const src = path.resolve(__dirname, '../education/public/frontend/index.html')
const dest = path.resolve(__dirname, '../education/www/student-portal.html')

if (fs.existsSync(src)) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
  console.log('✓ Successfully copied index.html to education/www/student-portal.html')
} else {
  console.error('✗ Build output index.html not found at:', src)
  process.exit(1)
}

