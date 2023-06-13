import { useMemo } from "react";
import { Stack, Button, Container } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export default function FileUpload(imageUrl, setImageUrl = () => {}) {
  const reader = useMemo(() => {
    return new FileReader();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setImageUrl(null);
      return;
    }

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button variant="contained" component="label" sx={{ spacing: "25px" }}>
          <PhotoCamera />
          Upload
          <input
            id="upload-image"
            hidden
            accept="image/*"
            type="file"
            onChange={handleFileUpload}
          />
        </Button>
        {imageUrl && <img src={imageUrl} alt="Uploaded img" height="300" />}
      </Stack>
    </Container>
  );
}
