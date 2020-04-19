import * as core from '@actions/core'

import gitP, {SimpleGit} from 'simple-git/promise'
import {DiffResult} from 'simple-git/typings/response'

import {getRootDir} from './helpers'

export const ROOT_DIR = getRootDir()
export const git: SimpleGit = gitP(ROOT_DIR)

/** Runs the diffing rules against the working tree */
export async function ruleMatchesChange(rule): Promise<boolean> {
  const options = buildOptions(rule)
  const diff = await getDiff(options)
  core.debug(`Diffing with options ${options}`)

  if (diff.changed > 0) {
    const diffedFiles = diff.files.map(elem => elem.file)
    core.info(`Changed files: ${diffedFiles}`)
    return true
  }

  return false
}

/** Performs diffing based on the rules from the manifest */
export async function getDiff(extraOptions: string[]): Promise<DiffResult> {
  const baseOptions = ['--no-color', 'origin/master...']
  const diff = await git.diffSummary([...baseOptions, ...extraOptions])
  return diff
}

/** Builds options to pass to diff command */
export function buildOptions(rule: object): string[] {
  const fullPaths: string[] = rule['paths'].map(el => `${ROOT_DIR}/${el}`)
  return fullPaths.length ? ['--', ...fullPaths] : []
}
