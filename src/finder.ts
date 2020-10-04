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

  const fetchOptions = ['--no-tags', '--prune', '--depth=1', 'origin']
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
  const allOptions = [...baseOptions, ...extraOptions]
  core.info(`Git diff all options: ${allOptions}`)

  try {
    const diff = await git.diffSummary(allOptions)
    console.log(`Git diffed files: ${diff.files}`)
    core.info(`Git diffed files: ${diff.files}`)
    return diff
  } catch (err) {
    // err.message - the string summary of the error
    // err.stack - some stack trace detail
    // err.git - where a parser was able to run, this is the parsed content

    console.error(`Git diffed files resulted in ${err.message}`)
    core.error(`Git diffed files resulted in ${err.message}`)
  }

  const diff = await git.diffSummary(allOptions)
  core.info(`Git diffed files: ${diff.files}`)
  return diff
}

/**
 * Builds options to pass to diff command.
 * @param {object} rule A rule contains paths and other options.
 * @returns {Array.string} A list of arguments to pass to git diff.
 */
export function buildOptions(rule: object): string[] {
  const fullPaths: string[] = rule['paths'].map(el => `${ROOT_DIR}/${el}`)
  const res = fullPaths.length ? ['--', ...fullPaths] : []
  core.info(`buildOptions: ${res}`)
  return res
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
  core.info(`Diff changed: ${diff.changed}`)
  core.info(`Diff options: ${options.join(' ')}`)

  if (diff.changed > 0) {
    const diffedFiles = diff.files.map(elem => elem.file)
    core.info(`Diff results: ${diffedFiles.join(' ')}`)
    return true
  }

  return false
}
