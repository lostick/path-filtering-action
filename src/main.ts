import * as core from '@actions/core'

import {getYamlRules} from './helpers'
import {ruleMatchesChange} from './finder'

async function run(): Promise<void> {
  try {
    core.debug('Parsing rules in the yaml manifest.')
    const rules = await getYamlRules()

    for (const rule of rules) {
      const match = await ruleMatchesChange(rule)
      if (match) {
        core.info('Diffing rule detected changes.')
        core.exportVariable('DIFF_DETECTED', 'true')
        return
      }
    }

    core.info('No changes detected.')
    core.exportVariable('DIFF_DETECTED', 'false')
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
