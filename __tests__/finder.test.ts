import * as helpers from '../src/helpers'
import * as finder from '../src/finder'

import fs from 'fs'
import {YAMLException} from 'js-yaml'

const FIXTURES_DIR = `${finder.ROOT_DIR}/__tests__/fixtures`
const BASE_REF = 'master'

beforeAll(() => {
  return initGitData()
})

afterAll(() => {
  return clearGitData()
})

describe('test git diff rules', () => {
  test('match diff change on parent dir', async () => {
    let rule = {
      paths: ['__tests__/fixtures/dummy1']
    }

    const diff = await finder.getDiff(BASE_REF, finder.buildOptions(rule))
    const fillFiles = diff.files.map(elem => elem.file)
    expect(fillFiles).toContainEqual('__tests__/fixtures/dummy1/test')
    expect(diff.changed).toBe(2)
    expect(diff.insertions).toBe(1)

    const diffDetected = await finder.ruleProducesDiffChange(rule, BASE_REF)
    expect(diffDetected).toBeTruthy()
  })

  test('match diff change on exact file', async () => {
    let rule = {
      paths: ['__tests__/fixtures/dummy1/.test']
    }

    const diff = await finder.getDiff(BASE_REF, finder.buildOptions(rule))
    const fillFiles = diff.files.map(elem => elem.file)
    expect(fillFiles).toContainEqual('__tests__/fixtures/dummy1/.test')
    expect(diff.changed).toBe(1)
    expect(diff.insertions).toBe(1)

    const diffDetected = await finder.ruleProducesDiffChange(rule, BASE_REF)
    expect(diffDetected).toBeTruthy()
  })

  test('match diff change on parent dir with file in subdir', async () => {
    let rule = {
      paths: ['__tests__/fixtures/dummy2']
    }

    const diff = await finder.getDiff(BASE_REF, finder.buildOptions(rule))
    const fillFiles = diff.files.map(elem => elem.file)
    expect(fillFiles).toContainEqual(
      '__tests__/fixtures/dummy2/scripts/test.sh'
    )
    expect(diff.changed).toBe(2)
    expect(diff.insertions).toBe(2)

    const diffDetected = await finder.ruleProducesDiffChange(rule, BASE_REF)
    expect(diffDetected).toBeTruthy()
  })

  test('no diff change on unknown parent dir', async () => {
    let rule = {
      paths: ['__tests__/fixtures/dummy-does-not-exist']
    }

    const diff = await finder.getDiff(BASE_REF, finder.buildOptions(rule))
    expect(diff.changed).toBe(0)
    expect(diff.insertions).toBe(0)

    const match = await finder.ruleProducesDiffChange(rule, BASE_REF)
    expect(match).not.toBeTruthy()
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
    const file = '__tests__/rules-match-parent-dir.yml'
    const rules = await helpers.getYamlRules(file)

    for (const rule of rules) {
      let match = await finder.ruleProducesDiffChange(rule, BASE_REF)
      expect(match).toBeTruthy()
    }
  })

  test('no diff detected', async () => {
    const file = '__tests__/rules-no-diff-detected.yml'
    const rules = await helpers.getYamlRules(file)

    let match = await finder.ruleProducesDiffChange(rules[0], BASE_REF)
    expect(match).not.toBeTruthy()
  })
})

const initGitData = async () => {
  console.log('create fixture dir')
  if (!fs.existsSync(FIXTURES_DIR)) {
    fs.mkdirSync(FIXTURES_DIR)
  }

  fs.mkdirSync(`${FIXTURES_DIR}/dummy1`)
  fs.closeSync(fs.openSync(`${FIXTURES_DIR}/dummy1/test`, 'w'))
  fs.appendFileSync(`${FIXTURES_DIR}/dummy1/.test`, '# test')
  fs.mkdirSync(`${FIXTURES_DIR}/dummy2`)
  fs.mkdirSync(`${FIXTURES_DIR}/dummy2/scripts`)
  fs.appendFileSync(`${FIXTURES_DIR}/dummy2/scripts/test.sh`, '#test')
  fs.appendFileSync(`${FIXTURES_DIR}/dummy2/scripts/test2.sh`, '# test')

  fs.mkdirSync(`${FIXTURES_DIR}/dummy3`)
  fs.mkdirSync(`${FIXTURES_DIR}/dummy3/envs`)
  fs.appendFileSync(`${FIXTURES_DIR}/dummy3/test`, '# test')
  fs.closeSync(fs.openSync(`${FIXTURES_DIR}/dummy3/envs/preprod`, 'w'))

  fs.mkdirSync(`${FIXTURES_DIR}/dummy4`)
  fs.mkdirSync(`${FIXTURES_DIR}/dummy4/envs`)
  fs.appendFileSync(`${FIXTURES_DIR}/dummy4/test`, '# test')

  console.log('commit fixtures dir to create a diff change')
  await finder.git.add(FIXTURES_DIR)
  await finder.git.commit('dummy commit')
}

const clearGitData = async () => {
  console.log('revert commit changes used for tests')
  var lastCommitID: string = await finder.git.revparse(['--short', 'HEAD'])
  await finder.git.revert(lastCommitID, ['--soft'])

  console.log('clean up fixtures dir')
  fs.rmdirSync(FIXTURES_DIR, {recursive: true})
}
