![EnterNEU-Frontend](https://socialify.git.ci/rroy233/EnterNEU-Frontend/image?description=1&language=1&logo=https%3A%2F%2Fs2.loli.net%2F2022%2F05%2F05%2FDx8lpyk7mcuZ3Tr.png&pattern=Formal%20Invitation&theme=Light)

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

## 部署

复制 `.env.production` 为新文件 `.env.production.local` 。修改 `VUE_APP_API_URL` 配置项，改为自己后端API的地址。

将`dist/`文件夹更名并移动到`后端目录/assets/enterneu/`
