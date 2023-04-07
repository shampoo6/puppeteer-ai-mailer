import {MailTemplate} from "../types/MailTemplate";

const template: MailTemplate = {
    mail: {
        to: "xxx@xxx.com",
        copy: "xxx@xxx.com, xxx@xxx.com",
        subject: "AI测试邮件 <%=date%>",
    },
    params: {
        myParam: '这是一个ejs参数',
        relative: '吃饭、喝水、打豆豆'
    },
    requires: [
        '每段 <%%=ai%%> 的内容在 50 字以内',
        '模板内容是一封备课报告',
        '编辑的内容是 <%=relative%> 相关内容',
        '邮件内容是一封情书',
        '是写给小红的'
    ],
    template: `<p>小红你好: </p>
<p>这里我想要插入一个参数: <%=myParam%></p>
<p>我每天想你想三遍:</p>
<p><%=ai%></p>
<p><%=ai%></p>
<p><%=ai%></p>`,
    attachments: true,
    attachmentsRequires: [
        '邮件的内容，请从以下技术中选择一项进行记述: <%=relative%>',
    ]
}

export default template
