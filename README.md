# architect-npmrc-action

This action creates an npmrc file and copies it into each of the paths in `src`, including `src/macros` and `src/shared`. This action exists because Architect doesn't observe the project-level `.npmrc` file and its tree shaking process requires that any npm config be placed in the path where the package is used.

## Inputs

### `registry`

**Required** The URL of the registry in use, without the trailing slash. Ex. `npm.pkg.github.com`

### `token`

The auth token needed for accessing the registry.

### `scope`

The scope of packages that use the registry, with the leading `@`. If not provided, no scope will be used in the config.

### `workspace`

The workspace for the project, without the trailing slash. If not provided, the `.npmrc` file will be written to the project root.

## Outputs

### `filepath`

The path to the top-level `.npmrc`.

## Example usage

```yaml
uses: w33ble/architect-npmrc-action@main
with:
  registry: 'registry.npmjs.org'
  token: 'ghp_83TZvdlKOBSy7McFsg'
  scope: '@myscope'
```
