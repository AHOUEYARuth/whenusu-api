/* eslint-disable prettier/prettier */

import Language from "#models/language";

export class LanguageService {
  async createLanguage(data: any) {
    const language = new Language()

    language.name = data.name

    await language.save()
    return language
  }

  async getAllLanguage() {
    const languages = await Language.all()
    return languages
  }

  async updateLanguage(languageId: string, data: any) {
    const language = await Language.query().where('id', languageId).firstOrFail()

    if (!language) {
      throw new Error('Langue non trouvé')
    }
    language.name = data.name || language.name
    await language.save()
    return language
  }

  async deleteLanguage(languageId: string) {
    const language = await Language.query().where('id', languageId).firstOrFail()
     if (!language) {
       throw new Error('Langue non trouvé')
     }
    await language.delete()
  }
}