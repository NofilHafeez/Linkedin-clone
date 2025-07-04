import Button from "../ui/Button";

export default function PostActions() {
  return (
    <div className="flex gap-2">
      <Button>Like</Button>
      <Button>Comment</Button>
      <Button>Share</Button>
    </div>
  );
}