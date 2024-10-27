import Image from "next/image";
import Camera from "./_components/camera-window";
import mainbg from "@/../public/mainbg.png";
import gradient from "@/../public/gradient.jpg";

export default function Home() {
  return (
    <div className="flex flex-col space-y-4 content-center justify-center items-center  h-[100dvh] w-full">
      <h1
        className="bg-cover text-transparent text-6xl text-center"
        style={{
          backgroundImage: `url(${gradient.src})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        Who-Said Mood Muse
      </h1>
      <div className="flex space-x-10">
        <Camera />
        <Image src={mainbg} alt="Image" height={20} width={500} />
      </div>
    </div>
  );
}
