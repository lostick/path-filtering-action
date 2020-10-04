import * as helpers from '../src/helpers'
import * as finder from '../src/finder'

import _simpleGit from 'simple-git/promise'
import {DiffResult} from 'simple-git/typings/response'

import fs from 'fs'
import {YAMLException} from 'js-yaml'

const BASE_REF = 'main'

jest.mock('simple-git/promise')
const simpleGit: any = _simpleGit

describe('test git diff rules', () => {
  test('match diff change on parent dir', async () => {
    simpleGit.mockImplementation(() => {
      return {
        diffSummary: jest.fn(() =>
          Promise.resolve({
            changed: 2,
            files: [{file: 'src/new-file.ts'}, {file: 'src/new-file2.ts'}],
            insertions: 2,
            deletions: 0
          })
        )
      }
    })

    let rule = {
      paths: ['src/']
    }

    const diff = await finder.getDiff(BASE_REF, finder.buildOptions(rule))
    const diffFiles = diff.files.map(elem => elem.file)

    expect(diffFiles).toContainEqual('src/new-file.ts')
    expect(diff.changed).toBe(2)
    expect(diff.insertions).toBe(2)
    expect(diff.deletions).toBe(0)

    const diffDetected = await finder.ruleProducesDiffChange(rule, BASE_REF)
    expect(diffDetected).toBeTruthy()
  })

  test('match diff on exact file', async () => {
    simpleGit.mockImplementation(() => {
      return {
        diffSummary: jest.fn(() =>
          Promise.resolve({
            changed: 1,
            files: [{file: 'src/new-file.ts'}],
            insertions: 1,
            deletions: 0
          })
        )
      }
    })

    let rule = {
      paths: ['src/new-file.ts']
    }

    const diff = await finder.getDiff(BASE_REF, finder.buildOptions(rule))
    const diffFiles = diff.files.map(elem => elem.file)

    expect(diffFiles).toContainEqual('src/new-file.ts')
    expect(diff.changed).toBe(1)
    expect(diff.insertions).toBe(1)
    expect(diff.deletions).toBe(0)

    const diffDetected = await finder.ruleProducesDiffChange(rule, BASE_REF)
    expect(diffDetected).toBeTruthy()
  })

  test('match diff includes file in subdir', async () => {
    simpleGit.mockImplementation(() => {
      return {
        diffSummary: jest.fn(() =>
          Promise.resolve({
            changed: 1,
            files: [{file: 'src/dir/subdir/subdir2/new-file.ts'}],
            insertions: 1,
            deletions: 0
          })
        )
      }
    })

    let rule = {
      paths: ['src/dir/subdir']
    }

    const diff = await finder.getDiff(BASE_REF, finder.buildOptions(rule))
    const diffFiles = diff.files.map(elem => elem.file)

    expect(diffFiles).toContainEqual('src/dir/subdir/subdir2/new-file.ts')
    expect(diff.changed).toBe(1)
    expect(diff.insertions).toBe(1)
    expect(diff.deletions).toBe(0)

    const diffDetected = await finder.ruleProducesDiffChange(rule, BASE_REF)
    expect(diffDetected).toBeTruthy()
  })

  test('no diff detected', async () => {
    simpleGit.mockImplementation(() => {
      return {
        diffSummary: jest.fn(() =>
          Promise.resolve({
            changed: 0,
            files: [],
            insertions: 0,
            deletions: 0
          })
        )
      }
    })

    let rule = {
      paths: ['dist/']
    }

    const diff = await finder.getDiff(BASE_REF, finder.buildOptions(rule))
    expect(diff.changed).toBe(0)
    expect(diff.insertions).toBe(0)
    expect(diff.deletions).toBe(0)

    const match = await finder.ruleProducesDiffChange(rule, BASE_REF)
    expect(match).not.toBeTruthy()
  })

  test('match diff deleted file in subdir', async () => {
    simpleGit.mockImplementation(() => {
      return {
        diffSummary: jest.fn(() =>
          Promise.resolve({
            changed: 1,
            files: [{file: 'src/dir/subdir/removed'}],
            insertions: 0,
            deletions: 1
          })
        )
      }
    })

    let rule = {
      paths: ['src/dir/subdir']
    }

    const diff = await finder.getDiff(BASE_REF, finder.buildOptions(rule))
    const diffFiles = diff.files.map(elem => elem.file)

    expect(diffFiles).toContainEqual('src/dir/subdir/removed')
    expect(diff.changed).toBe(1)
    expect(diff.insertions).toBe(0)
    expect(diff.deletions).toBe(1)

    const diffDetected = await finder.ruleProducesDiffChange(rule, BASE_REF)
    expect(diffDetected).toBeTruthy()
  })
})

describe('test git diff yaml manifests', () => {
  test('rules config file not found', async () => {
    const file = '__tests__/rules-not-found.yml'
    await expect(helpers.getYamlRules(file)).rejects.toThrowError()
  })

  test('rules invalid yaml file', async () => {
    const file = '__tests__/rules-invalid-yaml.yml'
    await expect(helpers.getYamlRules(file)).rejects.toThrow(YAMLException)
  })

  test('match diff detected', async () => {
    simpleGit.mockImplementation(() => {
      return {
        diffSummary: jest.fn(() =>
          Promise.resolve({
            changed: 1,
            files: [{file: '__tests__/fixtures/dummy1/new-file.ts'}],
            insertions: 1,
            deletions: 0
          })
        )
      }
    })

    const file = '__tests__/rules-match-parent-dir.yml'
    const rules = await helpers.getYamlRules(file)

    for (const rule of rules) {
      let match = await finder.ruleProducesDiffChange(rule, BASE_REF)
      expect(match).toBeTruthy()
    }
  })

  test('no diff detected', async () => {
    simpleGit.mockImplementation(() => {
      return {
        diffSummary: jest.fn(() =>
          Promise.resolve({
            changed: 0,
            files: [],
            insertions: 0,
            deletions: 0
          })
        )
      }
    })

    const file = '__tests__/rules-no-diff-detected.yml'
    const rules = await helpers.getYamlRules(file)

    let match = await finder.ruleProducesDiffChange(rules[0], BASE_REF)
    expect(match).not.toBeTruthy()
  })
})
