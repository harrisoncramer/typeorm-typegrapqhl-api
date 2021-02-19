import { EntitySubscriberInterface, EventSubscriber } from "typeorm";

@EventSubscriber()
export class Logger implements EntitySubscriberInterface {
  afterInsert(event: any) {
    console.log("Inserted", event.entity.id);
  }
}
