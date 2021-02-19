import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";

@EventSubscriber()
export class Logger implements EntitySubscriberInterface {
  afterInsert(event: InsertEvent<any>) {
    console.log("Inserted", event.entity.id);
  }

  afterUpdate(event: UpdateEvent<any>) {
    console.log("Updated", event.entity);
  }

  beforeRemove(event: RemoveEvent<any>) {
    console.log("Removed", event.entity.id);
  }
}
