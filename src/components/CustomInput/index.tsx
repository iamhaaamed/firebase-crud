import React, { useEffect } from "react";
import { useField } from "@formiz/core";
import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";

export const CustomInput = (props: any) => {
  const {
    errorMessage,
    id,
    isValid,
    isSubmitted,
    resetKey,
    setValue,
    value,
    ...otherProps
  } = useField(props);
  const { label, type, required } = props;
  const [isTouched, setIsTouched] = React.useState(false);
  const showError = !isValid && (isTouched || isSubmitted);

  useEffect(() => {
    setIsTouched(false);
  }, [resetKey]);

  return (
    <FormControl isInvalid={showError} isRequired={required}>
      <FormLabel htmlFor={label}>{label}</FormLabel>
      <Input
        id={id}
        type={type || "text"}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setIsTouched(true)}
        {...otherProps}
      />
      {!showError ? (
        <FormHelperText></FormHelperText>
      ) : (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  );
};
