import * as core from '@actions/core'

import {getYamlRules} from './helpers'
import {fetchBranches, ruleProducesDiffChange} from './finder'

async function run(): Promise<void> {
  try {
    const baseRef = core.getInput('base_ref', {required: true})
    await fetchBranches(baseRef)

    const configFile = core.getInput('config_file', {required: true})

    if (configFile) {
      core.info(`Parsing rules in ${configFile} yaml manifest.`)
      const rules = await getYamlRules(configFile)

      if (rules.length > 0) {
        for (const rule of rules) {
          const match = await ruleProducesDiffChange(rule, baseRef)
          if (match) {
            core.info('Git diff rule detected changes.')
            core.exportVariable('DIFF_DETECTED', 'true')
            return
          }
        }
      } else {
        core.warning('Attribute "rules" not found in the yaml manifest.')
      }
    } else {
      core.warning('Config file not set.')
    }

    core.info('No changes detected.')
    core.exportVariable('DIFF_DETECTED', 'false')
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`)
  }
}

run()
