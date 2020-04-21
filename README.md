# conditional-diffing-action

![build-test](https://github.com/lostick/conditional-diffing-action/workflows/build-test/badge.svg?branch=master)

This action can be used in a job step to filter paths based on git diff rules. The step sets `DIFF_DETECTED` environment variable as true or false, which can then be reused to conditionally run subsequent steps.

## Usage

1. Add rules in a new `.github/rules.yml` file

```
rules:
- paths:
  - ./src
```

2. Update your workflow

The `setup go` step uses `DIFF_DETECTED` to determine whether to run or not

```yaml
steps:
- uses: actions/checkout@v2
- uses: lostick/conditional-diffing-action@v0.2.0
- name: setup go
  if: env.DIFF_DETECTED == 'true'
  uses: actions/setup-go@v2
```
