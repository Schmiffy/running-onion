const fs = require('fs');
const path = require('path');

const comicsDirectory = path.join(__dirname, '..', 'public', 'comics');
const targetFile = path.join(__dirname, '..', 'src', 'comics.json');

try {
  const files = fs.readdirSync(comicsDirectory);

  const comicDates = files
    .filter(file => file.endsWith('.png'))
    .map(file => file.replace('.png', ''));

  fs.writeFileSync(targetFile, JSON.stringify(comicDates, null, 2));

  console.log(`Successfully generated comic list at ${targetFile}`);
} catch (error) {
  console.error('Error generating comic list:', error);
  process.exit(1); // Exit with an error code
}
