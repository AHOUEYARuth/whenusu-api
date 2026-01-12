/* eslint-disable prettier/prettier */
import { CategoryService } from '#services/category_service'
import { CreateCategoryVAlidator, messagesProviderCategory, UpdateCategoryVAlidator } from '#validators/category'
import type { HttpContext } from '@adonisjs/core/http'
import { SimpleMessagesProvider } from '@vinejs/vine'

export default class CategoriesController {
  private categoryService: CategoryService

  constructor() {
    this.categoryService = new CategoryService()
  }

  /**
   *
   * @store
   * @summary création de catégories
   * @responseBody 200 - <Category>
   * @requestBody <CreateCategoryVAlidator>
   */
  public async store({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(CreateCategoryVAlidator, {
        messagesProvider: new SimpleMessagesProvider(messagesProviderCategory),
      })
      const user = auth.user!
      const category = await this.categoryService.createCategory(payload, user.id)
      return response.status(200).json({
        message: 'Catégorie crée avec succès',
        data: category,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.messages || "Erreur s'est produite",
      })
    }
  }

  /**
   *
   * @update
   * @summary Modification d'une catégorie
   * @paramPath id - Identifiant de la catégorie à modifier - @type(string) @required
   * @requestBody <UpdateCategoryVAlidator>
   * @responseBody 200 - <Category>
   */
  public async update({ request, response, params }: HttpContext) {
    try {
      const payload = await request.validateUsing(UpdateCategoryVAlidator)
      const category = await this.categoryService.updateCategory(params.id, payload)
      return response.status(200).json({
        message: 'Catégorie modifiée avec succès',
        data: category,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Erreur s'est produite",
      })
    }
  }

  /**
   * 
   * @index 
   * @summary Récupération de toutes les catégories
   * @responseBody 200 - <Category[]> 
   */
  public async index({ response }: HttpContext) {
    try {
      const categories = await this.categoryService.getCategories()
      return response.status(200).json({
        message: 'Listes de toutes les catégories',
        data: categories,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Erreur s'est produite",
      })
    }
  }

  /**
   * 
   * @delete 
   * @summary Suppression d'une catégorie
   * @paramPath id - Identifiant de la catégorie à supprimer - @type(string) @required 
   */
  public async delete({ response, params }: HttpContext) {
    try {
      await this.categoryService.deleteCategory(params.id)
      return response.status(200).json({
        message: 'Cateégorie supprimée avec succès',
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Erreur s'est produite",
      })
    }
  }
}