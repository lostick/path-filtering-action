import fs from 'fs'
import yaml from 'js-yaml'

/** Works out working dir root directory */
export const getRootDir = (): string => {
  const rootDir = process.env['GITHUB_WORKSPACE'] || process.env.PWD

  if (!rootDir) {
    throw new Error('Either GITHUB_WORKSPACE or PWD must be set')
  }

  return rootDir
}

/** Extracts git diffing rules from the yaml manifest */
export async function getYamlRules(rulesPath?: string): Promise<string[]> {
  rulesPath =  `${getRootDir()}/${rulesPath}`

  const file = fs.readFileSync(rulesPath, 'utf8')
  const parsedYaml = yaml.safeLoad(file)

  return parsedYaml['rules']
}
