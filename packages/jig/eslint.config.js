import { configPkg } from '@adonisjs/eslint-config'
export default configPkg({
  ignores: ['coverage', 'docs', 'agent', '.remember', '.claude'],
})
