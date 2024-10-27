"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [faceData, setFaceData] = useState<any[]>([
    {
      coordinates: {
        x: 178,
        y: 212,
        width: 230,
        height: 230,
      },
      attributes: {
        age: 30,
        gender: {
          Woman: 0.04632303898688406,
          Man: 99.95367527008057,
        },
        emotion: {
          angry: 0.07,
          disgust: 0,
          fear: 0.11,
          happy: 0.19,
          sad: 0.09,
          surprise: 0.06,
          neutral: 0.49,
        },
      },
    },
  ]);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing the camera", error);
      }
    };

    startVideo();

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current && !isLoading) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        context.drawImage(videoRef.current, 0, 0);

        canvasRef.current.toBlob(async (blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append("file", blob, "captured-image.png");

            setIsLoading(true);

            try {
              //   const response = await axios.post(
              //     "http://127.0.0.1:8000/analyze-face/",
              //     formData
              //   );
              //   console.log(response?.data);
              //   setFaceData(response?.data?.faces);
            } catch (error) {
              console.error("Error uploading image", error);
            } finally {
              setIsLoading(false);
            }
          }
        }, "image/png");
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(captureImage, 3000);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="relative w-[640px] h-[480px] mx-auto">
      <video
        ref={videoRef}
        width="640"
        height="480"
        className="absolute"
        autoPlay
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {faceData.map((face, index) => {
        const { x, y, width, height } = face.coordinates;
        const malePercent = Math.round(face.attributes?.gender?.Man ?? 0);
        const femalePercent = Math.round(face.attributes?.gender?.Woman ?? 0);

        return (
          <div
            key={index}
            className="absolute border-2 border-green-500"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: `${width}px`,
              height: `${height}px`,
            }}
          >
            <div className="absolute ml-[110%] flex flex-col bg-black/80 text-cyan-300 p-2 rounded shadow-lg drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
              <p className="text-lg font-semibold">
                Age: {face.attributes?.age ?? "N/A"}
              </p>

              <p className="text-lg font-semibold mt-2">Gender:</p>
              <div className="flex items-center">
                <p className="mr-2 text-pink-300 drop-shadow-[0_0_5px_rgba(255,20,147,0.8)]">
                  Male:
                </p>
                <p className="ml-2">{malePercent}%</p>
              </div>

              <div className="flex items-center mt-1">
                <p className="mr-2 text-pink-300 drop-shadow-[0_0_5px_rgba(255,20,147,0.8)]">
                  Female:
                </p>
                <p className="ml-2">{femalePercent}%</p>
              </div>

              <p className="text-lg font-semibold mt-2">Mood:</p>
              <div className="mt-1 space-y-1">
                {face.attributes?.emotion ? (
                  Object.entries(face.attributes.emotion).map(
                    ([emotion, value]) => (
                      <div key={emotion} className="flex items-center">
                        <p className="capitalize mr-2 text-yellow-300 drop-shadow-[0_0_5px_rgba(255,255,0,0.8)]">
                          {emotion}:
                        </p>
                        <p className="ml-2">
                          {((value as number) * 100).toFixed(1)}%
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p>N/A</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Camera;
