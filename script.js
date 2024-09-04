const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');
let baseUrl = '';

const gitUrl = {
  gitea: 'http://192.168.31.14:3000/beizong/notes/src/branch/main/',
  github: 'https://github.com/x737762/notes/blob/main/',
};

const fileTree = [];

const exclud = ['.git', 'script.js', 'images', 'README.md', 'assets'];
const root = path.resolve(__dirname, './');

const readme = path.resolve(__dirname, './README.md');

async function createHtml(tree) {
  let template = '';
  for (const data of tree) {
    if (data.type === 'dir') {
      template += `<details open><summary><h2 style="display: inline-block;margin: 15px 0;">${
        data.name
      }</h2></summary><ul style="margin-top: 0;margin-bottom: 0;">${await createHtml(
        data.children,
      )}</ul></details>`;
    } else {
      const href = url.resolve(baseUrl, data.path);
      template += `<li><a href="${href}">${data.name}</a></li>`;
    }
  }
  return template;
}

async function createReadme(tree) {
  if (await fs.existsSync(readme)) {
    await fs.unlinkSync(readme);
  }

  const template = `<div align="center"><img style="width: 200px; height: 200px;" src="./images/logo.jpg"><h1>一个臭写代码的牛马</h1></div><hr><div>${await createHtml(
    tree,
  )}</div>`;

  await fs.writeFileSync(readme, template);
}

async function fetchFileTree(tree = [], root, basePath) {
  const dirList = await fs.readdirSync(path.resolve(root, basePath));
  for (const item of dirList) {
    if (!exclud.includes(item)) {
      const stat = await fs.statSync(path.resolve(root, basePath, item));
      if (stat.isDirectory()) {
        const data = {
          path: basePath === './' ? `${basePath}${item}` : `${basePath}/${item}`,
          name: item,
          type: 'dir',
          children: [],
        };
        tree.push(data);
        await fetchFileTree(data.children, root, data.path);
      } else {
        tree.push({
          path: basePath === './' ? `${basePath}${item}` : `${basePath}/${item}`,
          name: item,
          type: 'file',
        });
      }
    }
  }
}

async function pushGit(remote) {
  const { execSync } = require('node:child_process');
  const date = new Date().toLocaleString().replaceAll('/', '-');
  console.log(await execSync('git pull', { encoding: 'utf-8' }));
  console.log(await execSync('git add .', { encoding: 'utf-8' }));
  console.log(await execSync(`git commit -m "${date}"`, { encoding: 'utf-8' }));
  console.log(await execSync(`git push ${remote}`, { encoding: 'utf-8' }));
}

(async () => {
  for (const key in gitUrl) {
    baseUrl = gitUrl[key];

    await fetchFileTree(fileTree, root, './');
    await createReadme(fileTree);
    await pushGit(key);
  }
})();
