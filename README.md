[![Netlify Status](https://api.netlify.com/api/v1/badges/50c58ae5-1347-4e06-85e1-13c2fdec0205/deploy-status)](https://app.netlify.com/projects/hugo-mod-alpinejs/deploys)

This project provides Hugo Module wrappers for the following npm packages:

- [alpinejs](./alpinejs/README.md)
- [@alpinejs/anchor](./alpinejs/anchor/README.md)
- [@alpinejs/collapse](./alpinejs/collapse/README.md)
- [@alpinejs/focus](./alpinejs/focus/README.md)
- [@alpinejs/intersect](./alpinejs/intersect/README.md)
- [@alpinejs/mask](./alpinejs/mask/README.md)
- [@alpinejs/morph](./alpinejs/morph/README.md)
- [@alpinejs/persist](./alpinejs/persist/README.md)
- [@alpinejs/resize](./alpinejs/resize/README.md)
- [@alpinejs/sort](./alpinejs/sort/README.md)
- [@imacrayon/alpine-ajax](./imacrayon/alpine-ajax/README.md)

See the [exampleSite](./exampleSite) for a [running](https://hugo-mod-alpinejs.netlify.app/) demo of all components and how to set them up.

## Updates

This project uses [npmtohugomod](https://github.com/gohugoio/npmtohugomod) for maintenance with versions from [package.json](./package.json) maintained by dependabot. We version each module using a `vX.Y.(Z*1000+W)` [versioning scheme](https://github.com/gohugoio/npmtohugomod#module-wrapper-versioning), meaning that `alpinejs` `3.15.12` will get tagged as `v3.15.12000`.

