# conditional-diffing

![build-test](https://github.com/lostick/conditional-diffing-action/workflows/build-test/badge.svg?branch=master)

This action can be used in a job step to filter paths based on rules that produce a git diff output. The action's output can be used to conditionally run subsequent steps.

## Usage

```yaml
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v2
- run: git fetch --no-tags --prune --depth=1 origin +refs/heads/master:refs/remotes/origin/master
- uses: lostick/conditional-diffing-action@master
- name: Setup go
  if: env.DIFF_DETECTED
  uses: actions/setup-go@v1
  with:
    go-version: '1.14.0-rc1'
```
