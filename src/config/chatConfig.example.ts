import {ChatConfig} from "../types/ChatConfig";

export const chatConfig: ChatConfig = {
    requires: [
        '请使用中文来填充ejs模板的参数',
        '除了填充ejs模板的参数<%%=ai%%>以外，不要修改模板的任何内容',
        '你最后返回我的内容，应该依然保持我提供的ejs模板的格式'
    ],
    // 提供给AI的模板名称
    // 模板名是templates文件夹下的文件名
    template: 'example',
    prompts: `我会提供你一个ejs模板，请帮我填充ejs模板中<%%=ai%%>部分的内容，具体要求如下:
<%=requires%>
模板如下:
`,
    attachmentTemplate: `<!DOCTYPE html>
<html>
<head></head>
<body>
<h1>标题: <%=ai%></h1>
<ul>
<li><%=ai%></li>
<li><%=ai%></li>
<li><%=ai%></li>
<li><%=ai%></li>
</ul>
</body>
</html>`,
    attachmentsRequires: [
        'ejs模板描述的内容是一份记录技术知识点的笔记',
        '标题请更具体一点',
        '填充完后的ejs模板的字数在400字以内'
    ],
}
