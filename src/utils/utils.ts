import ejsParams from "./ejsParams";
import ejs from "ejs";

// 创建附件
export async function buildAttachmentQuestion(): Promise<string> {
  return render(global.chatConfig.attachmentTemplate, true, global.mailTemplate.attachmentsRequires, global.mailTemplate.params)
}

// 等待
export async function wait(time: number): Promise<void> {
  return new Promise(r => {
    setTimeout(r, time)
  })
}

// 混合问题
// 通过配置的 requires 和 attachmentsRequires 得到一个给 AI 的要求列表字符串
export function mixRequires(requires: string[]): string {
  return requires.map((r, i) => `${i + 1}. ${r};`).join('\n')
}

// 使用ejs渲染参数到模板中
export function renderString(template: string, params?: { [key: string]: string }): string {
  // 内置参数
  const inBuildParams = {date: ejsParams.date}
  return ejs.render(template, params ? {...params, ...inBuildParams} : inBuildParams)
}

// 将要求插入到 chatConfig.prompts 模板中
export function renderPrompts(requires: string): string {
  let question = ejs.render(chatConfig.prompts, {requires})
  // 处理尖括号
  question = question.replace(/&lt;/g, '<')
  question = question.replace(/&gt;/g, '>')
  return question
}

// 获取html模板中的body内容
export function getBodyContent(html: string) {
  // 处理换行符
  html = html.replace(/(?<=<[\s\S]+?>)\n/g, '')
  // 截取body的内容
  html = html.match(/(?<=<body>)[\s\S]*(?=<\/body>)/)[0]
  return html
}

/**
 * 渲染询问ai的问题
 * @param template ejs模板
 * @param isAttachment 是否是附件内容
 * @param requires 其他自定义要求
 * @param params ejs模板参数
 */
export function render(template: string, isAttachment: boolean, requires: string[], params?: Record<string, string>): string {
  // 构造需求
  let _requires = !isAttachment ? [...chatConfig.requires, ...requires] : [...chatConfig.requires, ...chatConfig.attachmentsRequires, ...requires]
  let reqStr = mixRequires(_requires)

  // 填充问题参数
  reqStr = renderString(reqStr, params)

  // 构造问题前缀
  reqStr = renderPrompts(reqStr)

  // 渲染模板前，先将<%=ai%>替换成<%%=ai%%>
  template = template.replace(/<%=ai%>/g, '<%%=ai%%>')

  // 填充模板参数
  template = `<div class="container">${renderString(template, params)}</div>`

  return reqStr + '\n' + template
}