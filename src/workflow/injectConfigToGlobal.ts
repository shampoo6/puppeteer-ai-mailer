import {chatConfig} from "../config/chatConfig";
import path from "path";

// 将配置对象注入到全局
export async function injectConfigToGlobal() {
  global.chatConfig = chatConfig
  // 读取配置文件
  const templatePath = path.join(__dirname, '../templates', chatConfig.template)
  const mod = await import(templatePath)
  global.mailTemplate = mod.default
}