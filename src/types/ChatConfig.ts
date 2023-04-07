// ChatGPT 相关配置
export type ChatConfig = {
    // AI书写内容的基本要求
    requires: string[],
    // 需要附件文件时的 AI书写内容的基本要求
    attachmentsRequires: string[],
    // 提供给AI的模板名称
    // 模板名是templates文件夹下的文件名
    template: string,
    // 提供给 AI 的提示信息
    // prompts 内必须填写一个 <%=requires%> 符号用来填充内容要求
    prompts: string,
    // 生成附件时，询问 AI 的提示模板
    attachmentTemplate: string
}
