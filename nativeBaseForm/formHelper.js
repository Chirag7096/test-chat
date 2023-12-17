import React from "react";
import { useForm, Controller } from "react-hook-form";
import { FormControl, Input, Text, Checkbox, Select, VStack, Radio, Button, View } from "native-base";

const TextField = ({ value, onBlur, onChange, field }) => (
  <Input id={field.id} value={value} onBlur={onBlur} onChangeText={(v) => onChange(v)} placeholder={field.placeholder} />
);

const TextAreaField = ({ value, onBlur, onChange, field }) => (
  <Input multiline numberOfLines={3} id={field.id} value={value} onBlur={onBlur} onChangeText={(v) => onChange(v)} placeholder={field.placeholder} />
);

const CheckboxField = ({ field, onChange }) => <Checkbox.Group onChange={onChange}>
  {field?.options?.map((e) => (<Checkbox key={e} value={e}><Text mx={2}>{e}</Text></Checkbox>))}
</Checkbox.Group>

const RadioButtonField = ({ onChange, field }) => <Radio.Group name={field.id} onChange={onChange}>
  {field?.options?.map((e) => (<Radio key={e} value={e}><Text mx={2}>{e}</Text></Radio>))}
</Radio.Group>


const SelectField = ({ field, value, onChange }) => (
  <Select
    selectedValue={value}
    onValueChange={onChange}
    placeholder={field.placeholder}
  >
    {field?.options?.map((e) => (<Select.Item key={e} label={e} value={e} />))}
  </Select>
);

// const FileUpload = ({ field, register }) => (
//   <input {...register} type="file" placeholder={field.placeholder} />
// );

const FieldComponent = {
  text: TextField,
  // upload: FileUpload,
  select: SelectField,
  textarea: TextAreaField,
  radio: RadioButtonField,
  checkbox: CheckboxField,
};

const CreateField = ({ fields, control }) => {
  return fields?.map((field) => {
    const Component = FieldComponent[field.type];
    return (
      <View style={{ width: "100%" }} key={field.id}>
        <Controller
          name={field.id}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, onBlur, value }, formState: { errors } }) => (
            <FormControl isReadOnly={field.type === "select"} isInvalid={field.id in errors}>
              <FormControl.Label>{field.label}</FormControl.Label>
              <Component
                field={field}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
              <FormControl.ErrorMessage>
                {errors?.[field.id]?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
        />
        <CreateField
          control={control}
          fields={field?.child
            ?.filter((_e) => _e?.match === watch(field.id))
            .map((e) => e.field)}
        />
      </View>
    );
  });
};

const DynamicForm = ({ fields, onSubmit }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: fields.reduce((d, e) => ({ ...d, [e.id]: e.value }), {})
  });

  return (
    <VStack width="80%" space={4}  >
      <CreateField fields={fields} control={control} />
      <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
    </VStack>
  );
};

export default DynamicForm;
