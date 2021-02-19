import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from "typeorm";

@EventSubscriber()
export class Logger implements EntitySubscriberInterface {
  afterInsert(event: InsertEvent<any>) {
    console.log("Inserted", event.entity.id);
  }

  beforeRemove(event: RemoveEvent<any>) {
    console.log("Removed", event.entity.id);
  }
}
