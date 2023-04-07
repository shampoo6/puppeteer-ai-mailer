import {buildAttachmentQuestion} from "../utils/utils";
import path from "path";
import fsp from "fs/promises";
import {AIHelper} from "../helpers/AIHelper";
import {AIChatMessage} from "chatgpt-worker";
import {JSDOM} from "jsdom";
import cp from 'child_process'

const rootPath = process.cwd()
const dirPath = path.resolve(rootPath, '资料')

export async function makeAttachmentFiles() {
  if (!global.mailTemplate.attachments) return
  await clearFile()
  const question = await buildAttachmentQuestion()
  await makeFile(question)
  await makeFile(question)
  await makeFile(question)
  await zipFiles()
}

async function clearFile(): Promise<void> {
  try {
    await fsp.rm(path.resolve(rootPath, '资料.zip'))
  } catch (e) {
  }
  try {
    await fsp.rm(dirPath, {recursive: true, force: true})
  } catch (e) {
  }
  try {
    await fsp.mkdir(dirPath)
  } catch (e) {
  }
}

async function makeFile(question: string): Promise<void> {
  // 提问
  const result: AIChatMessage = await AIHelper.getInstance().question(question)
  // 获取标题
  const document = new JSDOM(result.html).window.document
  // container 必须存在否则就重试
  const container = document.querySelector('.container')
  if (!container) {
    await makeFile(question)
    return
  }
  let titleEl
  titleEl = container.querySelector('h1')
  if (!titleEl) titleEl = container.querySelector('p')
  if (!titleEl) titleEl = container.querySelector('div')
  if (!titleEl) {
    await makeFile(question)
    return
  }
  const r = titleEl.textContent.match(/(?<=标题:)[\s\S]*$/)
  const title = r ? r[0].trim() : titleEl.textContent
  const filename = title + '.txt'
  let contentArr: string[] = []
  const lis = document.querySelectorAll('li')
  if (!lis || lis.length === 0) {
    await makeFile(question)
    return
  }
  lis.forEach(li => {
    contentArr.push(li.textContent)
  })
  let content = contentArr.join('\n\n')
  content = title + '\n\n' + content
  await fsp.writeFile(path.resolve(dirPath, filename), content)
}

function zipFiles() {
  return new Promise(r => {
    const p = cp.spawn('7z',
      ['a', '资料.zip', '资料'],
      {cwd: rootPath}
    )
    p.on('close', (code) => {
      console.log(`7z child process ${p.pid} exited with code ${code}`)
      console.log(text)
      r(undefined)
    })
    p.on('error', (err) => {
      console.error(err)
    })
    let text = ''
    p.stdout.on('data', (data) => {
      text += data.toString()
    })
  })
}
