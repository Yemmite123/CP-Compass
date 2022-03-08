import React from "react";
import defaultImage from "#/assets/icons/profile-icon.svg";
import Compressor from 'compressorjs';
import "./style.scss";

const ImageUploadInput = ({
  currentImageURL,
  handleFile,
  label,
  instruction = "Upload PDF, JPG or PNG files - Max size of 5mb.",
  acceptsList = "",
  maxSizeInMb = 5,
  children,
}) => {
  const [file, setFile] = React.useState("");
  const [error, setError] = React.useState("");
  const [selectedImageURL, setSelectedImageURL] = React.useState("");

  const onSelectImage = (e) => {
    const selectedImage = e.target.files[0];

    setError("");

    if (selectedImage) {
      if (selectedImage.size > maxSizeInMb * 1024 * 1024) {
        setError(`Max size of ${maxSizeInMb * 1024}kb exceeded!`);
        return;
      }

      console.log(selectedImage)
      if (selectedImage.type !== "application/pdf") {
        new Compressor(selectedImage, {
          quality: 0.6,
          convertSize: 1000000,
          success: (compressedFile) => {
            setFile(compressedFile);
            setSelectedImageURL(
              URL.createObjectURL(compressedFile)
            );
            compressedFile = new File([compressedFile], compressedFile.name)
            console.log(compressedFile);
            handleFile(compressedFile);
            URL.revokeObjectURL(compressedFile);
          }
        })

        return;
      }

      setSelectedImageURL(
        defaultImage
      );

      handleFile(selectedImage);
    }
  };

  const randomId = Math.floor(Math.random() * 1000);
  return (
    <div className="custom-upload">
      <img
        src={selectedImageURL || currentImageURL || defaultImage}
        alt="preview"
        className="custom-upload__image"
      />
      {children}
      <div className="d-flex flex-column">
        <div className="custom-upload__button-area">
          <input
            type="file"
            accept={acceptsList || "image/png, image/jpeg"}
            className="custom-upload__input"
            id={randomId}
            onChange={onSelectImage}
          />
          <label htmlFor={randomId} className="custom-upload__button">
            {label}
          </label>
          <span className="custom-upload__info">
            {file ? file.name : instruction}
          </span>
        </div>
        {error ? <p className="text-danger">{error}</p> : <></>}
      </div>
    </div>
  );
};

export default ImageUploadInput;
