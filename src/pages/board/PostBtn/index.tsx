import { Post } from "./index.styles";
import { ReactComponent as PostBtnSvg } from "@/assets/img/post_button.svg";

interface PostBtnProps {
  openModal: (value: "" | "post") => void;
}
export default function PostBtn({ openModal }: PostBtnProps) {
  return (
    <Post
      onClick={() => {
        openModal("post");
      }}
    >
      <PostBtnSvg />
    </Post>
  );
}
