import { Controller } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostDto } from "./dto/post-dto";
import { FindPostsQueryDto } from "./dto/find-posts-query.dto";
import { Posts } from "./post.interfaces";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PaginatedResponse } from "./entity/paginated-response.interface";

/* interface UserPayload {
  sub: number;
  email: string;
  role: string;
} */

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @MessagePattern("post.findAll")
  getAllPost(
    @Payload() query: FindPostsQueryDto
  ): Promise<PaginatedResponse<Posts>> {
    return this.postService.findAll(query);
  }

  @MessagePattern("post.findOne")
  getOnePost(@Payload() id: number) {
    return this.postService.findOnePost(id);
  }

  @MessagePattern("post.create")
  createOnePost(@Payload() data: any) {
    const postData: PostDto = data.postData;
    const user = data.user;
    return this.postService.createPost(postData, user);
  }

  @MessagePattern("post.update")
  async updatePost(
    @Payload()
    data: {
      id: number;
      postData: { title: string; content: string };
    }
  ) {
    console.log(data);
    return await this.postService.updatePost(data.id, data.postData);
  }

  @MessagePattern("post.delete")
  async deletePost(@Payload() id: number) {
    return await this.postService.deletePost(id);
  }
}
