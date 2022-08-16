import app from './app';
import db from './database';
import services from './services';
import settings from './settings';

export const config = [app, db, settings, services];
