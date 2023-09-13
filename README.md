# Turborepo + library publish

터보레포로 라이브러리 배포

## Install

```sh
pnpm install
```

## Build

```sh
pnpm build
```

### Develop

```sh
pnpm dev
```

## Release

Github Action을 통한 자동 배포

1. 로컬에서 버저닝 후 커밋, 푸쉬

```sh
pnpm changeset
```

2. 액션에서 PR Create
3. PR 머지되면 액션에서 Publish
