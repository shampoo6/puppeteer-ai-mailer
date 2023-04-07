import {AIHelper} from "./helpers/AIHelper";
import {injectConfigToGlobal} from "./workflow/injectConfigToGlobal";
import {makeAttachmentFiles} from "./workflow/makeAttachmentFiles";
import {wait} from "./utils/utils";
import {sendMail} from "./workflow/sendMail";

(async () => {
  await injectConfigToGlobal()
  const ai = AIHelper.getInstance(async () => {
    console.log('ready')
    await makeAttachmentFiles()
    await sendMail()
  })
})()

