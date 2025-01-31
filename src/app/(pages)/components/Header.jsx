import { Typography, Box } from "@mui/material";

const Header = props => {
  return (
    <Box mb="10px">
      <Typography
        variant="h4"
        color={props.textColor || "black"}
        fontWeight="bold"
        // sx={{ m: "0 0 5px 0" }}
        sx={{ textAlign: "center" }}
      >
        {props.title}
      </Typography>
      <Typography
        variant="h5"
        color={props.textColor || "black"}
        sx={{ textAlign: "center" }}
      >
        {props.subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
