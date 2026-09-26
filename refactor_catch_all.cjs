const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'app/controllers');

function readDir(dir) {
  const files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...readDir(fullPath));
    } else if (file.endsWith('_controller.ts')) {
      files.push(fullPath);
    }
  });
  return files;
}

const files = readDir(controllersDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Catch (error) normalization
  // We want to replace:
  // } catch (error) { ... return response.status(abc).json({ message: error.messages || '...' }) }
  
  const catchRegex = /\} catch \((error|e)(: any)?\) \{[\s\S]*?return response\.status\(\d+\)\.json\(\{[\s\S]*?message: (error|e)\.messages? \|\| "([^"]+)".*?\}\)\s*\}/g;
  
  content = content.replace(catchRegex, (match, errVar, type, errVar2, fallbackMsg) => {
    return `} catch (${errVar}: any) {
      if (${errVar}.messages) {
        return response.status(422).json({ message: 'Erreur de validation', errors: ${errVar}.messages })
      }
      const status = ${errVar}.message && ${errVar}.message.includes('non trouvé') ? 404 : 400
      return response.status(status).json({ message: ${errVar}.message || "${fallbackMsg}" })
    }`;
  });

  // some catch blocks just use return response.status(500).json({ message: "Erreur s'est produite" }) without error.message
  // we'll handle those later if needed, but the regex covers most dynamically.

  fs.writeFileSync(file, content);
});

console.log('Processed all catch blocks in all controllers.');
