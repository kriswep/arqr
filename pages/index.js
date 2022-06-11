import Head from 'next/head';
import { useEffect, useRef } from 'react';

export default function Home() {
  const videoRef = useRef(null);

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { facingMode: 'environment' } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error('error:', err);
      });
  };

  return (
    <div className="flex h-screen w-screen justify-around flex-col">
      <h1 className="text-3xl font-bold text-gray-200 self-center">
        Hello ArQr
      </h1>
      <video ref={videoRef} className="w-screen min-h-min" />
    </div>
  );
}
