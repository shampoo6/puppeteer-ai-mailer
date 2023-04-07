import {
  AIChatMessage,
  AIChatStatus,
  EventHandler,
  EventName,
  WorkerMessage,
  WorkerMessageType,
  WorkerProxy
} from "chatgpt-worker";

export class AIHelper {
  private static ins: AIHelper
  private wp: WorkerProxy
  private readonly readyHandler: EventHandler

  private constructor(readyHandler: EventHandler) {
    this.readyHandler = readyHandler
    this.wp = new WorkerProxy()
    this.wp.on(EventName.Ready, this.readyHandler)
    AIHelper.ins = this
  }

  public static getInstance(readyHandler?: EventHandler): AIHelper {
    return AIHelper.ins || new AIHelper(readyHandler)
  }

  public async question(text: string): Promise<AIChatMessage> {
    await this.wp.question(text)
    return await this.bindEvent()
  }

  private bindEvent(): Promise<AIChatMessage> {
    return new Promise(r => {
      this.wp.on(EventName.Message, (e: WorkerMessage) => {
        if (e.type === WorkerMessageType.Answer) {
          const data: AIChatMessage = e.data
          if (data.status === AIChatStatus.End) {
            this.wp.off(EventName.Message)
            r(data)
          }
        }
      });
    })
  }
}