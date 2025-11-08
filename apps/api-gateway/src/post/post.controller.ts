import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { FindPostsQueryDto } from "./dto/find-posts-query.dto";
import { AuthGuard } from "apps/common/guards/auth.guard";
import { PostDto } from "./dto/post-dto";
import { CurrentUser } from "apps/common/decorators/current-user.decorator";

interface UserPayload {
  sub: number;
  email: string;
  role: string;
}

@Controller("post")
export class PostController {
  constructor(@Inject("POST_CLIENT") private postClient: ClientProxy) {}

  @Get()
  getAllPost(@Query() query: FindPostsQueryDto) {
    return this.postClient.send("post.findAll", query);
  }

  @Get(":id")
  getOnePost(@Param("id") id: number) {
    return this.postClient.send("post.findOne", id);
  }

  @UseGuards(AuthGuard)
  @Post("create")
  createOnePost(@Body() postData: PostDto, @CurrentUser() user: UserPayload) {
    if (!postData.title || !postData.content) {
      throw new RpcException({
        status: 404,
        message: "Title and Content should not be empty",
      });
    }
    return this.postClient.send("post.create", { postData, user });
  }

  @UseGuards(AuthGuard)
  @Put("update/:id")
  updatePost(@Param("id") id: number, @Body() postData: PostDto) {
    if (!id) {
      throw new RpcException({ status: 400, message: "Id should be valid" });
    }
    if (!postData.title || !postData.content) {
      throw new RpcException({ status: 400, message: "Id should be valid" });
    }
    console.log("id==========>", id);
    console.log("postdata==========>", id);
    return this.postClient.send("post.update", { id, postData });
  }

  @UseGuards(AuthGuard)
  @Delete("delete")
  deletePost(@Query("id") id: number) {
    if (!id) {
      throw new RpcException({ status: 400, message: "Id should be valid" });
    }
    return this.postClient.send("post.delete", id);
  }
}
