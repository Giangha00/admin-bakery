import { Modal, Form, Input, InputNumber, Button } from "antd";
import { useEffect } from "react";

const InsertModal = ({
  show,
  title,
  fields,
  values,
  onChange,
  onSubmit,
  onClose,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(values);
  }, [values, form]);

  return (
    <Modal
      open={show}
      title={title}
      onCancel={onClose}
      onOk={() => {
        form
          .validateFields()
          .then(() => {
            onSubmit();
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okText="Save"
      cancelText="Cancel"
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(changed, all) =>
          onChange({
            target: {
              name: Object.keys(changed)[0],
              value: Object.values(changed)[0],
            },
          })
        }
        onFinish={onSubmit}
      >
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={[
              {
                required: field.required,
                message: `${field.label} is required!`,
              },
            ]}
          >
            {field.type === "number" ? (
              <InputNumber style={{ width: "100%" }} />
            ) : field.type === "array" ? (
              <Form.List name={field.name}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        style={{ display: "flex", gap: 8, marginBottom: 8 }}
                      >
                        <Form.Item
                          {...restField}
                          name={name}
                          style={{ flex: 1 }}
                          rules={[
                            { required: true, message: "Please input value!" },
                          ]}
                        >
                          <Input placeholder="Enter value" />
                        </Form.Item>
                        <Button danger onClick={() => remove(name)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button type="dashed" onClick={() => add()} block>
                      + Add Item
                    </Button>
                  </>
                )}
              </Form.List>
            ) : (
              <Input />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default InsertModal;
