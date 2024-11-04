import { styled, Typography, IconButton, Box, Button } from "@mui/material";
import { FC, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import EditPhotoModal from "./EditPhotoModal";
import Canvas from "./Canvas";
import { Report, type EditsType } from "../Classes/Report";
import { Crop } from "react-image-crop";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface AddPhotosFormProps {
  uploadPhotoText: string;
  reportEntry: Report;
  updateEntry: (edits: EditsType) => void;
}

const AddPhotosButton: FC<AddPhotosFormProps> = (props) => {
  const [image, setImage] = useState<HTMLImageElement>();

  const { uploadPhotoText, reportEntry, updateEntry } = props;

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 0,
    y: 0,
    width: 80,
    height: 60,
  });

  const [changeButton, setChangeButton] = useState(false); // To set if we need to change the button to the image

  return (
    <>
      <Box sx={{ width: "100%", aspectRatio: 4 / 3 }}>
        {changeButton && image ? (
          <Canvas crop={crop} image={image} />
        ) : (
          <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            sx={{
              width: "100%",
              height: "100%",
              color: "primary",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon sx={{ width: 50, height: 50 }} />
              <Typography fontSize={18}>
                {uploadPhotoText.toUpperCase()}
              </Typography>
            </Box>
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => {
                if (event.target.files) {
                  const image = new Image();
                  image.src = URL.createObjectURL(event.target.files[0]);
                  setImage(image);
                }
              }}
            />
          </Button>
        )}
      </Box>
      <EditPhotoModal
        image={image}
        setImage={setImage}
        titleText={"Edit " + props.uploadPhotoText}
        crop={crop}
        setCrop={setCrop}
        setChangeButton={setChangeButton}
      />
    </>
  );
};

export default AddPhotosButton;
