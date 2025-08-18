import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";
import axios from "axios";

const EditModal = ({
  show,
  title,
  fields,
  values,
  onChange,
  onClose,
  productId,
  onUpdated,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Gọi API update_product.php
      const payload = { ...values, id: productId };
      const res = await axios.post(
        "http://localhost:8888/api/update_product.php",
        payload
      );

      if (res.data.status) {
        if (onUpdated) onUpdated();
        onClose();
        alert("Update successful!");
      } else {
        alert("Update failed: " + res.data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Update error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <Modal
      open={show}
      title={title}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Update
        </Button>,
      ]}
    >
      <Form layout="vertical">
        {fields.map((field) => {
          const value = values[field.name] ?? "";
          if (field.type === "number") {
            return (
              <Form.Item
                key={field.name}
                label={field.label}
                required={field.required}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  name={field.name}
                  value={value}
                  onChange={(val) =>
                    onChange({ target: { name: field.name, value: val } })
                  }
                />
              </Form.Item>
            );
          } else {
            return (
              <Form.Item
                key={field.name}
                label={field.label}
                required={field.required}
              >
                <Input
                  name={field.name}
                  value={value}
                  onChange={onChange}
                  placeholder={field.label}
                />
              </Form.Item>
            );
          }
        })}
      </Form>
    </Modal>
  );
};

export default EditModal;
