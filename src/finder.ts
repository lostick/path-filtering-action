import * as core from '@actions/core'

import gitP, {SimpleGit} from 'simple-git/promise'
import {DiffResult} from 'simple-git/typings/response'

import {getRootDir} from './helpers'

export const ROOT_DIR = getRootDir()
export const git: SimpleGit = gitP(ROOT_DIR)

/** Fetch all branches */
export async function fetchBranches(baseRef: string): Promise<void> {
  const fetchOptions = ['--no-tags', '--prune', '--depth=1', 'origin']
  const fetchRemotes = [`+refs/heads/${baseRef}:refs/remotes/origin/${baseRef}`]

  const options = [...fetchOptions, ...fetchRemotes]
  core.info(`Running git fetch with options: ${options.join(' ')}`)
  await git.fetch(options)
}

/** Runs the diffing rules against the working tree */
export async function ruleMatchesChange(rule, baseRef): Promise<boolean> {
  const options = buildOptions(rule)
  const diff = await getDiff(baseRef, options)
  core.info(`Diff options: ${options.join(' ')}`)

  if (diff.changed > 0) {
    const diffedFiles = diff.files.map(elem => elem.file)
    core.info(`Diff results: ${diffedFiles.join(' ')}`)
    return true
  }

  return false
}

/** Performs diffing based on the rules from the manifest */
export async function getDiff(
  baseRef: string,
  extraOptions: string[]
): Promise<DiffResult> {
  const baseOptions = ['--no-color', `origin/${baseRef}...`]
  const diff = await git.diffSummary([...baseOptions, ...extraOptions])
  return diff
}

/** Builds options to pass to diff command */
export function buildOptions(rule: object): string[] {
  const fullPaths: string[] = rule['paths'].map(el => `${ROOT_DIR}/${el}`)
  return fullPaths.length ? ['--', ...fullPaths] : []
}
