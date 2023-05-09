import fs from "fs";
import path from "path";
import {render, renderString} from "../utils/utils";
import {AIHelper} from "../helpers/AIHelper";
import {JSDOM} from "jsdom";
import {Mail} from "../types/Mail";
import {mailCommonConfig} from "../config/mailCommonConfig";
import {sendMail as sm} from "../utils/mailer";

export async function sendMail() {
  const template = global.mailTemplate
  let question = render(template.template, false, template.requires, template.params)

  // 提问
  let result = await AIHelper.getInstance().question(question)
  // 获取标题
  let document = new JSDOM(result.html).window.document
  // container 必须存在否则就重试
  let container = document.querySelector('.container')

  if (!container) {
    document = new JSDOM(result.content).window.document
    container = document.querySelector('.container')
  }

  if (!container) {
    await sendMail()
    return
  }

  // 构造mail对象
  const mail: Mail = {
    ...mailCommonConfig,
    ...template.mail,
    content: container.innerHTML,
  }

  // 判断是否需要附件
  if (template.attachments) {
    // 添加附件
    mail.attachments = [{
      filename: '资料.zip',
      content: fs.createReadStream(path.resolve(__dirname, '../../', '资料.zip'))
    }]
  }

  // 编译签名
  mail.sign = renderString(mail.sign, {...template.params, sender: mail.sender})
  // 编译主题
  mail.subject = renderString(mail.subject, template.params)
  // 编译内容
  mail.content = renderString(mail.content, template.params)
  const res = await sm(mail)
  console.log(res)
  if (res.accepted && res.accepted.length > 0) {
    // await wait(3000)
    // app.quit()
  }
}