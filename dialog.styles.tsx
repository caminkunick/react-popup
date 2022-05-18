import { Dialog, DialogProps, Grow } from "@mui/material";

export const DialogStyled = (props: DialogProps) => (
  <Dialog
    sx={{
      "& .MuiDialog-paper": { maxWidth: 360, borderRadius: "1.5rem" },
      "& .MuiDialogContent-root": {
        padding: "1.5rem 1rem 1rem",
      },
    }}
    fullWidth
    maxWidth="xs"
    TransitionComponent={Grow}
    {...props}
  />
);
