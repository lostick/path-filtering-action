import * as core from '@actions/core'

import gitP, {SimpleGit} from 'simple-git/promise'
import {DiffResult} from 'simple-git/typings/response'

import {getRootDir} from './helpers'

const ROOT_DIR = getRootDir()

/**
 * Fetches all git branches.
 * @param {string} baseRef The base (target) git branch.
 * @returns {void}
 */
export async function fetchBranches(baseRef: string): Promise<void> {
  const git: SimpleGit = gitP(ROOT_DIR)

  const fetchOptions = ['--no-tags', '--prune', '--depth=100', 'origin']
  const fetchRemotes = [`+refs/heads/${baseRef}:refs/remotes/origin/${baseRef}`]

  const options = [...fetchOptions, ...fetchRemotes]
  core.info(`Running git fetch with options: ${options.join(' ')}`)
  await git.fetch(options)
}

/**
 * Performs git diff based on the rules from the manifest.
 * @param {string} baseRef The base (target) git branch.
 * @param {Array.string} extraOptions Extra git diff options.
 * @returns {Promise.DiffResult} A DiffResult object that contains diff changes.
 */
export async function getDiff(
  baseRef: string,
  extraOptions: string[]
): Promise<DiffResult> {
  const git: SimpleGit = gitP(ROOT_DIR)

  const baseOptions = ['--no-color', `origin/${baseRef}...`]
  const diff = await git.diffSummary([...baseOptions, ...extraOptions])

  return diff
}

/**
 * Builds options to pass to diff command.
 * @param {object} rule A rule contains paths and other options.
 * @returns {Array.string} A list of arguments to pass to git diff.
 */
export function buildOptions(rule: object): string[] {
  const fullPaths: string[] = rule['paths'].map(el => `${ROOT_DIR}/${el}`)
  return fullPaths.length > 0 ? ['--', ...fullPaths] : []
}

/**
 * Runs the git diff rules against the working tree.
 * @param {object} rule A rule contains paths and other options.
 * @param {string} baseRef The base (target) git branch.
 * @returns {Promise.boolean} Does the rule produce any git diff change?
 */
export async function ruleProducesDiffChange(
  rule: object,
  baseRef: string
): Promise<boolean> {
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
