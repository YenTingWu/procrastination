import React, { useState, useRef, useCallback } from 'react';
import { Textarea } from '@chakra-ui/textarea';
import { Flex, Text } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';
import { FormLabel } from '@chakra-ui/form-control';

export interface FormLabelInputUIProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  htmlFor?: string;
}

/**
 * ## FormLabelInputUI
 * An UI component for the combination of label and input
 * @param props name, label, value, onChange
 * @returns JSX.Element
 */

export const FormLabelInputUI: React.FC<FormLabelInputUIProps> = ({
  name,
  label,
  htmlFor,
  value,
  onChange,
  ...attr
}) => {
  const { type, autoComplete } = attr;
  const [isFocus, setFocus] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = useCallback(() => setFocus(true), []);
  const handleBlur = useCallback(() => setFocus(false), []);

  let isFocusOrHasValue = isFocus || value || inputRef.current?.value;

  const labelAttr = htmlFor ? { htmlFor } : {};

  return (
    <Flex
      alignItems="center"
      position="relative"
      _notFirst={{
        marginTop: '20px',
      }}
    >
      <FormLabel
        {...labelAttr}
        m={0}
        px="1"
        position="absolute"
        left="18px"
        fontSize={isFocusOrHasValue ? 'sm' : 'md'}
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

        id={htmlFor || ''}
        aria-describedby={attr['aria-describedby'] || ''}
        type={type || ''}
        autoComplete={autoComplete || ''}
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

export const FormLabelTextareaUI: React.FC<FormLabelInputUIProps> = ({
  name,
  label,
  htmlFor,
  value,
  onChange,
  ...attr
}) => {
  const { type, autoComplete } = attr;
  const [isFocus, setFocus] = useState<boolean>(false);
  const [numberOfChars, setNumberOfChars] = useState<number>(value.length || 0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFocus = useCallback(() => setFocus(true), []);
  const handleBlur = useCallback(() => setFocus(false), []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const length = e.target.value.length;
      if (length > 200) return;

      onChange(e);
      setNumberOfChars(length);
    },
    [onChange]
  );

  let isFocusOrHasValue = isFocus || value || textareaRef.current?.value;
  const labelAttr = htmlFor ? { htmlFor } : {};

  return (
    <Flex
      w="100%"
      alignItems="center"
      position="relative"
      _notFirst={{
        marginTop: '20px',
      }}
    >
      <FormLabel
        {...labelAttr}
        m={0}
        px="1"
        position="absolute"
        left="18px"
        top="3"
        fontSize={isFocusOrHasValue ? 'sm' : 'md'}
        fontWeight="extrabold"
        bg={isFocusOrHasValue ? `white` : 'none'}
        color={isFocusOrHasValue ? `black` : `gray.400`}
        zIndex={isFocusOrHasValue ? 1000 : 0}
        transform={isFocusOrHasValue ? `translate(-5%, -25px)` : ''}
      >
        {label}
      </FormLabel>
      <Textarea
        /**
         * Input Config
         *
         * If the input is password type, use "aria-describedby" to outline password
         * rules by giving it the ID of the element that describes the constraints
         */

        id={htmlFor || ''}
        aria-describedby={attr['aria-describedby'] || ''}
        type={type || ''}
        autoComplete={autoComplete || ''}
        /**
         *
         */
        ref={textareaRef}
        name={name}
        w="100%"
        h="10rem"
        borderColor="black"
        borderWidth="3px"
        fontSize="sm"
        numberoflines={3}
        value={value}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
      />
      <Text
        color="gray.500"
        fontSize="xs"
        position="absolute"
        right="1"
        bottom="-5"
        _hover={{ cursor: 'default' }}
        _selection={{ bg: 'none' }}
      >
        {numberOfChars} / 200
      </Text>
    </Flex>
  );
};
