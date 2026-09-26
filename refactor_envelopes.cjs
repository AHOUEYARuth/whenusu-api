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
  
  // Replace unstandardized keys in response payloads
  // specifically: 
  // region,
  // regions,
  // category,
  // categories,
  // language,
  // languages,
  // tradition,
  // traditions,
  // role,
  // roles,
  // informant,
  // informants,
  // permission,
  // permissions,
  // user, (wait, in auth_controller login we have user, userPersmisions, token. In forgotPassword we have user)
  // favorites, favorite,
  // notifications, notification
  
  const entities = [
    'region', 'regions',
    'category', 'categories',
    'language', 'languages',
    'tradition', 'traditions',
    'role', 'roles',
    'informant', 'informants',
    'permission', 'permissions',
    'favorite', 'favorites',
    `notification`, `notifications`
  ];
  
  // Create a regex to find JSON returns: return response.status(XXX).json({ ... })
  // and replace the standalone variables with data: variable
  
  entities.forEach(entity => {
    // We look for:
    // \bENTITY, (standalone property in object)
    // inside a json({ ... }) context. 
    // To be safe, we just string replace `\n        ENTITY,` with `\n        data: ENTITY,`
    
    // Pattern: space/newline + entity + comma + newline/space
    const regex1 = new RegExp(`^(\\s+)${entity},$`, 'gm');
    content = content.replace(regex1, `$1data: ${entity},`);

    const regexObsolete = new RegExp(`^(\\s+)${entity}\\s*$`, 'gm');
    content = content.replace(regexObsolete, `$1data: ${entity}`);
  });

  // Handle meta / statistics in auth_controller etc
  content = content.replace(/^(\s+)statistics,$/gm, `$1meta: { statistics },`);

  fs.writeFileSync(file, content);
});

console.log('Envelopes refactored.');
