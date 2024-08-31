"use client";

import { storage } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import { CropperRef, Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { toast } from "react-toastify";

interface ImageEditorProps {
  image: string;
  onClose: () => void; // Callback to close the editor
  onImageUpload: (url: string) => void;
}

export default function ImageEditor({
  image,
  onClose,
  onImageUpload,
}: ImageEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // Reference for canvas
  const [editedImage, setEditedImage] = useState<string>(image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  const onUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const blob = URL.createObjectURL(file);
      setEditedImage(blob);
      setImageFile(file);
    }
    event.target.value = "";
  };

  useEffect(() => {
    return () => {
      if (editedImage) {
        URL.revokeObjectURL(editedImage);
      }
    };
  }, [editedImage]);

  const onChange = (cropper: CropperRef) => {
    console.log(cropper);
  };
  const handleUploadToFirebase = () => {
    setImageUploading(true);
    if (!imageFile) return;

    const storageRef = ref(storage, `images/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      () => {
        // Handle successful uploads
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadedImageUrl(downloadURL);
          console.log("File available at", downloadURL);
          toast.success("image upload successfully");
          onImageUpload(downloadURL);
          onClose();
          setImageUploading(false);
        });
      }
    );
  };

  const applyRotation = () => {
    return `rotate(${rotation}deg)`;
  };

  const applyFilters = () => {
    return `brightness(${brightness}%) contrast(${contrast}%)`;
  };

  const drawImageOnCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && editedImage) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.src = editedImage;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Apply rotation and draw the image onto the canvas
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
          ctx.drawImage(
            img,
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height
          );
          ctx.restore();

          const editedDataURL = canvas.toDataURL();
          setEditedImage(editedDataURL);
        };
      }
    }
  };

  const handleSave = async () => {
    await drawImageOnCanvas();
    await handleUploadToFirebase();
  };

  const handlePreview = () => {
    drawImageOnCanvas();
    setShowPreview(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1">
      {imageUploading ? (
        <div className="w-full mx-2 h-[400px] md:w-[400px]  bg-white rounded shadow-md flex flex-col justify-center items-center gap-4">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-orange-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
          {uploadProgress > 0 && <p>Upload progress: {uploadProgress}%</p>}
          {uploadedImageUrl && (
            <div className="mt-4">
              <p>Uploaded Image URL:</p>
              <a
                href={uploadedImageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {uploadedImageUrl}
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="relative bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-lg">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
          >
            Close
          </button>
          <h2 className="text-xl font-semibold mb-4">Edit Image</h2>
          <div className="flex flex-col items-center">
            {imageFile && (
              <div className="w-[200px] h-[200px] md:w-[300px] md:h-[300px]">
                <Cropper
                  stencilProps={{
                    grid: true,
                  }}
                  src={editedImage}
                  onChange={onChange}
                  className="cropper w-full h-80 border border-gray-300 rounded-md"
                  style={{ transform: applyRotation(), filter: applyFilters() }}
                />
              </div>
            )}
            <div className="mt-2 flex flex-col items-center">
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-md mb-2"
                onClick={onUpload}
              >
                Upload Image
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={onLoadImage}
                className="hidden"
              />
            </div>
            {imageFile && (
              <>
                <div className="w-[90%] flex flex-col items-center mt-2">
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <label className="block text-gray-700 mb-1">Rotate:</label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setRotation((prev) => prev - 90)}
                        className="bg-gray-300 px-2 py-1 rounded"
                      >
                        Rotate Left
                      </button>
                      <button
                        onClick={() => setRotation((prev) => prev + 90)}
                        className="bg-gray-300 px-2 py-1 rounded"
                      >
                        Rotate Right
                      </button>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center gap-5">
                    <div className="mb-2">
                      <label className="block text-gray-700 mb-1">
                        Brightness:
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700 mb-1">
                        Contrast:
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {imageFile && (
            <div className="mt-4 flex justify-end">
              <button
                disabled={imageFile ? false : true}
                onClick={handlePreview}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md mr-2 ${
                  !imageFile && "opacity-60"
                } `}
              >
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={imageFile ? false : true}
                className={`bg-green-500 text-white px-4 py-2 rounded-md ${
                  !imageFile && "opacity-60"
                } `}
              >
                Save Changes
              </button>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />

          {showPreview && (
            <div className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-1">
              <div className="w-[300px] h-[300px] relative bg-white p-4 rounded-lg shadow-lg ">
                <button
                  onClick={() => setShowPreview(false)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
                >
                  Close
                </button>
                <h2 className="text-xl font-semibold mb-4">Preview Image</h2>
                <img
                  src={editedImage}
                  alt="Preview Image"
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
