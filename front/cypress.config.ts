import { defineConfig } from 'cypress'
import codeCoverageTask from '@cypress/code-coverage/task'

export default defineConfig({
  video: false,

  e2e: {
    baseUrl: 'http://localhost:4200',

    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    setupNodeEvents(on, config) {
      codeCoverageTask(on, config)

      return config
    },
  },
})