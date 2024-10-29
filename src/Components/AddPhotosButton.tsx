import {
  styled,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { FC, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import EditPhotoModal from "./EditPhotoModal";

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
  uploadPhotoType: string;
}

const AddPhotosButton: FC<AddPhotosFormProps> = (props) => {
  const [image, setImage] = useState<HTMLImageElement>();

  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="outlined"
        tabIndex={-1}
        sx={{
          width: "100%",
          aspectRatio: 4 / 3,
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
            {props.uploadPhotoType.toUpperCase()}
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
      <EditPhotoModal
        image={image}
        setImage={setImage}
        titleText={"Edit " + props.uploadPhotoType}
      />
    </>
  );
};

export default AddPhotosButton;
