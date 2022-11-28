import { PostDto } from '@interfaces/post.dto';
import { ProfileDto } from '@interfaces/profile.dto';

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      SignIn: undefined;
      SignUp: undefined;
      ForgotPassword: undefined;
      GameScreen: { id: number; slug: string; name: string };
      Stats: undefined;
      FindFriendsScreen: undefined;
      UserStats: { uuid: string };
      GuildScreen: undefined;
      CreateGuild: undefined;
      PostDetails: {
        postData: PostDto;
        userData: ProfileDto;
        imageData: string | undefined;
      };
    }
  }
}
