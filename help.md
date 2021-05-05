# Help Docs

## Developing

Pull the project down and install the dependencies with `yarn`. Note that you should use node 12 as this is the version that the Github Action runs in.

Tests can be created with a `.spec.js` extension.

## Creating a Release

To cut a release, use npm's version command. This will cause a build to happen, which will automatically be commited, and then a version commit will follow.

```sh
npm version <major|minor|patch>
```

Once you have the new version created and committed, push it to the remote. Also be sure to push the new tag.

```sh
git push origin
git push origin --tags
```
