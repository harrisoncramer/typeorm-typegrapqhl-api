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
    if (process.env.ENV !== "test") {
      console.log("Inserted", event.entity.id);
    }
  }

  beforeUpdate(event: UpdateEvent<any>) {
    if (process.env.ENV !== "test") {
      console.log("Updating", event.entity);
    }
  }

  beforeRemove(event: RemoveEvent<any>) {
    if (process.env.ENV !== "test") {
      console.log("Removed", event.entity.id);
    }
  }
}
