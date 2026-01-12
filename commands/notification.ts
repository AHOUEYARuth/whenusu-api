/* eslint-disable prettier/prettier */
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class Notification extends BaseCommand {
  static commandName = 'notification'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "Notification"')
  }
}