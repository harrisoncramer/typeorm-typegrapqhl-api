import {
  Mutation,
  Resolver,
  Arg,
  Int,
  Query,
  InputType,
  Field,
} from "type-graphql";
import { getRepository } from "typeorm";
import { Movie } from "../entity/Movie";

@InputType()
class MovieInput {
  @Field()
  title: string;
  @Field()
  minutes: number;
}

@InputType()
class MovieUpdateInput {
  @Field({ nullable: true })
  title?: string;
  @Field({ nullable: true })
  minutes?: number;
}

@Resolver()
export class MovieResolver {
  @Mutation(() => Boolean)
  async createMovie(
    @Arg("title") title: string,
    @Arg("minutes", () => Int) minutes: number
  ) {
    await Movie.insert({ title, minutes });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteMovie(@Arg("id", () => Int) id: number) {
    await Movie.delete({ id });
    return true;
  }

  @Mutation(() => Boolean)
  async updateMovie(
    @Arg("id", () => Int) id: number,
    @Arg("input", () => MovieUpdateInput) input: MovieUpdateInput
  ) {
    await Movie.update({ id }, input);
    return true;
  }

  @Mutation(() => Boolean)
  async createMultipleMovies(
    @Arg("options", () => [MovieInput]) options: MovieInput[]
  ) {
    for (const movie of options) {
      await Movie.insert({ title: movie.title, minutes: movie.minutes });
    }
    return true;
  }

  @Query(() => [Movie])
  movies() {
    return Movie.find();
  }
}
