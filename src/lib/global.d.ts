import {ChatConfig} from "./ChatConfig";
import {MailTemplate} from "../types/MailTemplate";

declare global {
  var chatConfig: ChatConfig;
  var mailTemplate: MailTemplate;
}

// export declare global {
//   declare module globalThis {
//     var chatConfig: ChatConfig;
//     var mailTemplate: MailTemplate;
//   }
// }