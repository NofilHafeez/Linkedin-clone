export default function Avatar({ src }: { src: string }) {
  return (
    <img src={src} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
  );
}