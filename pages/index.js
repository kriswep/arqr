import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

let barcodeDetector;
const getBarcodeDetector = async () => {
  if (barcodeDetector) return barcodeDetector;
  if (typeof window !== 'undefined') {
    // browser code
    if (!('BarcodeDetector' in window)) {
      const BarcodeDetector = await import('barcode-detector');
      window.BarcodeDetector = BarcodeDetector.default;
    }
    barcodeDetector = new window.BarcodeDetector({
      formats: ['qr_code'],
    });
    return barcodeDetector;
  }
  return barcodeDetector;
};

export default function Home() {
  const videoRef = useRef(null);

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  const [text, setText] = useState('');

  useEffect(() => {
    let interval;
    // const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
    const scanCodes = async () => {
      const barcodeDetector = await getBarcodeDetector();
      if (!barcodeDetector || !videoRef.current) {
        return;
      }

      interval = setInterval(async () => {
        const barcodes = await barcodeDetector.detect(videoRef.current);
        if (!barcodes || barcodes.length <= 0) {
          setText('no barcode detected');
          return;
        }
        console.log(barcodes);
        setText(barcodes.map((barcode) => barcode.rawValue));
      }, 300);

      return () => {
        if (interval) return clearInterval(interval);
      };
    };

    scanCodes().catch(console.error);
  }, [videoRef, setText]);

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
      <video ref={videoRef} className="w-screen h-screen" />
      <p className="text-6xl font-bold text-gray-200 absolute left-5 top-5">
        {text}
      </p>
    </div>
  );
}
