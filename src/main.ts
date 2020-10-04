import * as core from '@actions/core'

import {getYamlRules} from './helpers'
import {fetchBranches, ruleProducesDiffChange} from './finder'

async function run(): Promise<void> {
  try {
    const baseRef = core.getInput('base_ref', {required: true})
    await fetchBranches(baseRef)

    const configFile = core.getInput('config_file', {required: true})
    core.info(`Parsing rules in ${configFile} yaml manifest.`)
    const rules = await getYamlRules(configFile)

    for (const rule of rules) {
      const match = await ruleProducesDiffChange(rule, baseRef)
      core.info(`Match for ${rule.paths} = ${match}`)
      if (match) {
        core.info('Git diff rule detected changes.')
        core.exportVariable('DIFF_DETECTED', 'true')
        return
      }
    }

    core.info('No changes detected.')
    core.exportVariable('DIFF_DETECTED', 'false')
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`)
  }
}

run()
