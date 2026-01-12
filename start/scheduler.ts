/* eslint-disable prettier/prettier */

import scheduler from 'adonisjs-scheduler/services/main'
import Notification from '../commands/notification.js';

scheduler.command(Notification).dailyAt('17:01')