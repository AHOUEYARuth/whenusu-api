import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'app/controllers/auth_controller.ts');
let content = fs.readFileSync(filePath, 'utf8');

const catchRegex = /\} catch \(error\) \{[\s\S]*?return response\.status\(500\)\.json\(\{[\s\S]*?message: error\.messages? \|\| "([^"]+)".*?\}\)\s*\}/g;

content = content.replace(catchRegex, (match, fallbackMsg) => {
  return `} catch (error: any) {
      if (error.messages) {
        return response.status(422).json({
          message: 'Erreur de validation',
          errors: error.messages,
        })
      }
      
      const status = error.message?.includes('non trouvé') ? 404 : (error.message ? 400 : 500)
      return response.status(status).json({
        message: error.message || "${fallbackMsg}",
      })
    }`;
});

fs.writeFileSync(filePath, content);
console.log('Successfully refactored catch blocks for status codes.');
