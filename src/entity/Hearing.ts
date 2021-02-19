import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { ObjectType, Field } from "type-graphql";

enum Chambers {
  SENATE = "senate",
  HOUSE = "house",
}

@ObjectType()
@Entity()
class BaseHearing extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  date: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  private _time?: Date;

  set time(time: Date | null) {
    this.time = time ? time : null;
  }

  get time() {
    return this._time || null;
  }

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field()
  @Column({ unique: true })
  link: string;

  @Field()
  @Column()
  text: string;
}

enum SenateCommittees {
  SENATE_FOREIGN_RELATIONS_COMMITTEE = "sfrc",
  SENATE_ARMED_SERVICES_COMMITTEE = "sasc",
  SENATE_AGRICULTURE_COMMITTEE = "sagc",
  SENATE_APPROPRIATIONS_COMMITTEE = "sapc",
  SENATE_BANKING_COMMITTEE = "sbnk",
  SENATE_BUDGET_COMMITTEE = "sbdg",
  SENATE_TRASPORTATION_COMMITTEE = "sstr",
  SENATE_NATURAL_RESOURCES_COMMITTEE = "snat",
  SENATE_ENVIRONMENT_AND_PUBLIC_WORKS_COMMITTEE = "senv",
  SENATE_FINANCE_COMMITTEE = "sfin",
  SENATE_HEALTH_EDUCATION_AND_LABOR_COMMITTEE = "shlp",
  SENATE_HOMELAND_SECURITY_COMMITTEE = "shsc",
  SENATE_INDIAN_AFFAIRS_COMMITTEE = "sind",
  SENATE_JUDICIARY_COMMITTEE = "sjud",
  SENATE_RULES_COMMITTEE = "srle",
  SENATE_ETHICS_COMMITTEE = "seth",
  SENATE_INTELLIGENCE_COMMITTEE = "ssci",
  SENATE_SMALL_BUSINESS_COMMITEE = "ssbs",
  SENATE_VETERANS_AFFAIRS_COMMITTEE = "svac",
}

enum HouseCommittees {
  HOUSE_ARMED_SERVICES_COMMITTEE = "hasc",
  HOUSE_FOREIGN_RELATIONS_COMMITTEE = "hfac",
  HOUSE_JUDICIARY_COMMITTEE = "hjud",
  HOUSE_RULES_COMMITTEE = "hrle",
  HOUSE_VETERANS_AFFAIRS_COMMITTEE = "hvac",
  HOUSE_HOMELAND_SECURITY_COMMITTEE = "hhsc",
  HOUSE_AGRICULTURE_COMMITTEE = "hagc",
  HOUSE_APPROPRIATIONS_COMMITTEE = "hapc",
  HOUSE_BUDGET_COMMITTEE = "hbuc",
  HOUSE_EDUCATION_AND_LABOR_COMMITTEE = "help",
  HOUSE_ENERGY_AND_COMMERCE_COMMITTEE = "nrgy",
  HOUSE_FINANCIAL_SERVICES_COMMITTEE = "fisv",
  HOUSE_ADMINISTRATION_COMMITTEE = "admn",
  HOUSE_NATURAL_RESOURCES_COMMITTEE = "ntty",
  HOUSE_OVERSIGHT_AND_REFORM_COMMITTEE = "ovst",
  HOUSE_SCIENCE_SPACE_AND_TECHNOLOGY_COMMITTEE = "scnc",
  HOUSE_SMALL_BUSINESS_COMMMITTEE = "smbs",
  HOUSE_TRANSPORTATION_AND_INFRASTRUCTURE_COMMITTEE = "trns",
  HOUSE_WAYS_AND_MEANS_COMMITTEE = "wymn",
  HOUSE_CLIMATE_COMMITTEE = "clmt",
}

@ObjectType()
@Entity()
export class HouseHearing extends BaseHearing {
  @Field()
  @Column({ enum: Chambers })
  chamber: string;

  @Field()
  @Column({ enum: HouseCommittees })
  committee: string;
}

@ObjectType()
@Entity()
export class SenateHearing extends BaseHearing {
  @Field()
  @Column({ enum: Chambers })
  chamber: string;

  @Field()
  @Column({ enum: SenateCommittees })
  committee: string;
}
