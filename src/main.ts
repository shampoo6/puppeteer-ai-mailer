import {AIHelper} from "./helpers/AIHelper";
import {injectConfigToGlobal} from "./workflow/injectConfigToGlobal";
import {makeAttachmentFiles} from "./workflow/makeAttachmentFiles";
import {sendMail} from "./workflow/sendMail";

(async () => {
  await injectConfigToGlobal()
  await AIHelper.getInstance().waitForWorkerReady()
  await makeAttachmentFiles()
  await sendMail()
})()

