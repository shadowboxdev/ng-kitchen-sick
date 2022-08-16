import { RestServer } from '@sdw/api/common';

import { AppModule } from './app/app.module';

RestServer.make(AppModule, { addValidationContainer: true });
