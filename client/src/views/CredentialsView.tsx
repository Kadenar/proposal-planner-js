import {
  Button,
  InputAdornment,
  Stack,
  TextField,
  IconButton,
  Typography,
  Card,
} from "@mui/material";

import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  //   createUser,
  validateSession,
} from "../services/slices/authenticatedSlice";
import { useAppDispatch } from "../services/store";
import { useNavigate } from "react-router-dom";

const CredentialsView = () => {
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState("tim");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const checkAuthentication = async () => {
    const validated = await validateSession(dispatch, userName, password);

    // If successfully logged in, navigate to proposals view
    if (validated) {
      navigate("/home");
    }
  };

  return (
    <Stack justifyContent="center" alignContent="center" height="100vh">
      <Card sx={{ ml: 10, mr: 10, pt: 20, pb: 20, spacing: 2 }}>
        <Stack
          gap={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            sx={{ color: "#66B2FF", fontStyle: "italic" }}
            variant="h3"
          >
            Sign in
          </Typography>
          <TextField
            label="Username"
            value={userName}
            onChange={({ target: { value } }) => setUserName(value)}
            sx={{ minWidth: 300 }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            sx={{ minWidth: 300 }}
            onChange={({ target: { value } }) => setPassword(value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkAuthentication();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* <Button
            variant="contained"
            onClick={async () => {
              createUser(dispatch, userName, password);
            }}
          >
            Create salted password
          </Button> */}
          <Button variant="contained" onClick={checkAuthentication}>
            Login
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
};

export default CredentialsView;
