import fs from 'fs'
import yaml from 'js-yaml'

interface DiffRUle {
  paths: string[]
  options?: string[]
}

/**
 * Works out root directory.
 * @returns {string} The current root directory.
 */
export function getRootDir(): string {
  const rootDir = process.env['GITHUB_WORKSPACE'] || process.env.PWD

  if (!rootDir) {
    throw new Error('Either GITHUB_WORKSPACE or PWD must be set')
  }

  return rootDir
}

/**
 * Extracts git diff rules from the yaml manifest.
 *
 * @param {string} rulesPath The path to the files containing rules.
 * @returns {Array} List of rules to pass to git diff.
 */
export async function getYamlRules(rulesPath?: string): Promise<DiffRUle[]> {
  rulesPath = `${getRootDir()}/${rulesPath}`

  const file = fs.readFileSync(rulesPath, 'utf8')
  const parsedYaml = yaml.safeLoad(file)

  return parsedYaml?.['rules']
}
