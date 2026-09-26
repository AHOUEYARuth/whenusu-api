const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/controllers/auth_controller.ts');
let content = fs.readFileSync(filePath, 'utf8');

const catchRegex = /\} catch \(error[\s\S]*?\} ?$/gm;

// Wait, doing this via regex might affect nested functions or multiple block scopes, but auth_controller is pretty flat.
// Let's use a simpler string replace since all the error blocks are very similar.

const replacements = [
  {
    regex: /\} catch \(error\) \{\s*console\.log\("Erreur lors de l'inscription :"\)\s*console\.log\(error\)\s*return response\.status\(500\)\.json\(\{\s*message: error\.messages \|\| "Une erreur s'est produite lors de l'inscription",\s*\}\)\s*\}/g,
    replace: `} catch (error: any) {
      if (error.messages) {
        return response.status(422).json({ message: 'Erreur de validation', errors: error.messages })
      }
      return response.status(500).json({ message: error.message || 'Une erreur s\\'est produite lors de l\\'inscription' })
    }`
  },
  {
    regex: /\} catch \(error\) \{\s*console\.log\("Erreur lors de l'inscription admin :"\)\s*console\.log\(error\)\s*return response\.status\(500\)\.json\(\{\s*message: error\.messages \|\| "Une erreur s'est produite lors de l'inscription",\s*\}\)\s*\}/g,
    replace: `} catch (error: any) {
      if (error.messages) {
        return response.status(422).json({ message: 'Erreur de validation', errors: error.messages })
      }
      return response.status(500).json({ message: error.message || 'Une erreur s\\'est produite lors de l\\'inscription' })
    }`
  },
  {
    regex: /\} catch \(error\) \{\s*console\.log\("Erreur lors de l'inscription :"\)\s*console\.log\(error\)\s*return response\.status\(500\)\.json\(\{\s*message: error\.messages \|\| "Une erreur s'est produite lors de la connexion",\s*\}\)\s*\}/g,
    replace: `} catch (error: any) {
      if (error.messages) {
        return response.status(422).json({ message: 'Erreur de validation', errors: error.messages })
      }
      return response.status(500).json({ message: error.message || 'Une erreur s\\'est produite lors de la connexion' })
    }`
  },
  {
    regex: /\} catch \(error\) \{\s*return response\.status\(500\)\.json\(\{\s*message: error\.message \|\| "Une erreur s'est produite",\s*\}\)\s*\}/g,
    replace: `} catch (error: any) {
      const status = error.message && error.message.includes('non trouvé') ? 404 : 400
      return response.status(status).json({ message: error.message || 'Une erreur s\\'est produite' })
    }`
  },
  {
    regex: /\} catch \(error\) \{\s*return response\.status\(500\)\.json\(\{\s*message: error\.message \|\| "Une erreur s'est produite lors de la mise à jour de la langue",\s*\}\)\s*\}/g,
    replace: `} catch (error: any) {
      const status = error.message && error.message.includes('non trouvé') ? 404 : 400
      return response.status(status).json({ message: error.message || 'Une erreur s\\'est produite lors de la mise à jour de la langue' })
    }`
  },
  {
    regex: /\} catch \(error\) \{\s*return response\.status\(200\)\.json\(\{\s*message: error\.message \|\| "Une erreur s'est produite",\s*\}\)\s*\}/g,
    replace: `} catch (error: any) {
      const status = error.message && error.message.includes('non trouvé') ? 404 : 400
      return response.status(status).json({ message: error.message || 'Une erreur s\\'est produite' })
    }`
  }
];

let updatedCount = 0;
replacements.forEach(r => {
  const matches = content.match(r.regex);
  if(matches) updatedCount += matches.length;
  content = content.replace(r.regex, r.replace);
});

fs.writeFileSync(filePath, content);
console.log('Replaced blocks: ' + updatedCount);
