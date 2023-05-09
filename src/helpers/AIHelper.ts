import {
  AIChatMessage,
  AIChatStatus,
  EventName,
  WorkerMessage,
  WorkerMessageType,
  WorkerProxy
} from "chatgpt-worker";

export class AIHelper {
  private static ins: AIHelper
  private wp: WorkerProxy

  private constructor() {
    this.wp = new WorkerProxy()
    AIHelper.ins = this
  }

  public static getInstance(): AIHelper {
    return AIHelper.ins || new AIHelper()
  }

  public async question(text: string): Promise<AIChatMessage> {
    await this.wp.chat(text)
    return await this.bindEvent()
  }

  public async waitForWorkerReady() {
    await this.wp.waitForWorkerReady()
  }

  private bindEvent(): Promise<AIChatMessage> {
    return new Promise(r => {
      this.wp.on(EventName.Message, (e: WorkerMessage) => {
        if (e.type === WorkerMessageType.Reply) {
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