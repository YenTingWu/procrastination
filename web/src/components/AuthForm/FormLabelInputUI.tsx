import React, { useState, useRef, useCallback } from 'react';
import { Flex, FormLabel, Input } from '@chakra-ui/react';

interface FormLabelInputUIProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  htmlFor: string;
}

/**
 * ## FormLabelInputUI
 * An UI component for the combination of label and input
 * @param props name, label
 * @returns JSX.Element
 */

export const FormLabelInputUI: React.FC<FormLabelInputUIProps> = ({
  name,
  label,
  htmlFor,
  ...attr
}) => {
  const { value, onChange, type, autoComplete, id } = attr;
  const [isFocus, setFocus] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = useCallback(() => setFocus(true), []);
  const handleBlur = useCallback(() => setFocus(false), []);

  let isFocusOrHasValue = isFocus || value || inputRef.current?.value;

  return (
    <Flex
      alignItems="center"
      position="relative"
      _notFirst={{
        marginTop: '20px',
      }}
    >
      <FormLabel
        htmlFor={htmlFor}
        m={0}
        px="1"
        position="absolute"
        left="18px"
        fontSize={isFocusOrHasValue ? '14px' : '16px'}
        fontWeight="extrabold"
        bg={isFocusOrHasValue ? `white` : 'none'}
        color={isFocusOrHasValue ? `black` : `gray.400`}
        zIndex={isFocusOrHasValue ? 1000 : 0}
        transform={isFocusOrHasValue ? `translate(-5%, -25px)` : ''}
      >
        {label}
      </FormLabel>
      <Input
        /**
         * Input Config
         *
         * If the input is password type, use "aria-describedby" to outline password
         * rules by giving it the ID of the element that describes the constraints
         */
        id={id}
        aria-describedby={attr['aria-describedby']}
        type={type}
        autoComplete={autoComplete}
        /**
         *
         */
        ref={inputRef}
        name={name}
        h="43px"
        maxW="276px"
        w="100%"
        borderColor="black"
        borderWidth="3px"
        fontSize="16px"
        fontWeight="extrabold"
        value={value}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={onChange}
      />
    </Flex>
  );
};
