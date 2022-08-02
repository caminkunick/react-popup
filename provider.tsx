import * as React from "react";
import {
  Popup,
  PopupAlert,
  PopupContext,
  PopupFunc,
  PopupPrompt,
  PopupState,
  PopupType,
} from "./context";
import { IconPack, library } from "@fortawesome/fontawesome-svg-core";
import { fad } from "@fortawesome/pro-duotone-svg-icons";
import { far } from "@fortawesome/pro-regular-svg-icons";
import {
  Box,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DialogStyled } from "./dialog.styles";
import { ButtonStyled } from "./button.styled";

library.add(fad as IconPack, far as IconPack);

const timeout: number = 250;

export type PopupTranslateKey = "confirm" | "remove" | "cancel" | "close";
export type PopupTranslate = Record<PopupTranslateKey, string>;

export const PopupProvider = ({
  trans,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { trans?: PopupTranslate }) => {
  const [state, setState] = React.useState<PopupState>({ open: false });
  const [value, setValue] = React.useState<string>("");

  const Popup: PopupFunc = {
    alert: (options: PopupAlert) =>
      setState({ ...options, type: "alert", open: true }),
    confirm: (options: Popup) =>
      setState({ ...options, type: "confirm", open: true }),
    prompt: ({ defaultValue, ...options }: PopupPrompt) => {
      setState({ ...options, type: "prompt", open: true });
      setValue(defaultValue || "");
    },
    remove: (options: Popup) =>
      setState({ ...options, type: "remove", open: true }),
  };

  const handleChangeValue = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setValue(value);
  const handleConfirm = () => {
    if (["confirm", "remove"].includes(state?.type || "")) {
      setTimeout(() => {
        state?.onConfirm?.();
      }, timeout);
      handleClose();
    } else if (state.type === "prompt") {
      setTimeout(() => {
        state?.onConfirm?.(value);
      }, timeout);
      handleClose();
    }
  };
  const handleAbort = () => {
    setTimeout(() => {
      state?.onAbort?.();
    }, timeout);
    handleClose();
  };
  const handleClose = () => setState((s) => ({ ...s, open: false }));

  return (
    <PopupContext.Provider value={{ Popup }}>
      <div id="popup-provider" {...props} />
      <DialogStyled open={state.open} onClose={handleAbort}>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            {state.icon && (
              <FontAwesomeIcon size="2x" icon={["far", state.icon]} />
            )}
            <Typography variant="h6" fontWeight={"bold"} sx={{ mt: 2 }}>
              {state.title}
            </Typography>
            {state.type === "prompt" ? (
              <TextField
                autoFocus
                label={state.text}
                fullWidth
                value={value}
                onChange={handleChangeValue}
                sx={{ mt: 2 }}
                onKeyDown={({ key }) =>
                  key === "Enter" && value && handleConfirm()
                }
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                {state.text}
              </Typography>
            )}
          </Box>
          <Stack spacing={0.5}>
            {((type?: PopupType) => {
              switch (type) {
                case "confirm":
                  return (
                    <React.Fragment>
                      <ButtonStyled variant="contained" onClick={handleConfirm}>
                        {trans?.confirm || "Confirm"}
                      </ButtonStyled>
                      <ButtonStyled onClick={handleAbort}>
                        {trans?.cancel || "Cancel"}
                      </ButtonStyled>
                    </React.Fragment>
                  );
                case "prompt":
                  return (
                    <React.Fragment>
                      <ButtonStyled variant="contained" onClick={handleConfirm}>
                        {trans?.confirm || "Confirm"}
                      </ButtonStyled>
                      <ButtonStyled onClick={handleAbort}>
                        {trans?.cancel || "Cancel"}
                      </ButtonStyled>
                    </React.Fragment>
                  );
                case "remove":
                  return (
                    <React.Fragment>
                      <ButtonStyled
                        variant="contained"
                        onClick={handleConfirm}
                        color="error"
                      >
                        {trans?.remove || "Remove"}
                      </ButtonStyled>
                      <ButtonStyled onClick={handleAbort}>
                        {trans?.cancel || "Cancel"}
                      </ButtonStyled>
                    </React.Fragment>
                  );
                default:
                  return (
                    <ButtonStyled onClick={handleAbort}>
                      {trans?.close || "Close"}
                    </ButtonStyled>
                  );
              }
            })(state.type)}
          </Stack>
        </DialogContent>
      </DialogStyled>
    </PopupContext.Provider>
  );
};
