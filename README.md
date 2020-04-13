# conditional-diffing

![build-test](https://github.com/lostick/conditional-diffing/workflows/build-test/badge.svg?branch=master)

This action can be used in a job step to filter paths based on rules that produce a git diff output. The action's output can be used to conditionally run subsequent steps.

## Usage

```yaml
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v2
- uses: lostick/donny-action@master
  id: diff-changes
- run: python my_script.py
  if: steps.diff-changes.outputs.deploy-needed
```
