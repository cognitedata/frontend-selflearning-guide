import React from 'react';
import { Form, Input, Button } from 'antd';

const HorizontalEventForm = ({onSubmit, form}) => {
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form.getFieldsValue());

    form.resetFields();
  };
  
  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <Form.Item>
        {form.getFieldDecorator('type')(
          <Input placeholder="Event Type" />
        )}
      </Form.Item>
      <Form.Item >
        {form.getFieldDecorator('description')(
          <Input placeholder="Description" name={'description'}/>
        )}
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">
          Add Event
        </Button>
      </Form.Item>
    </Form>
  );
};

export const EventForm = Form.create({ name: 'horizontal_login' })(HorizontalEventForm);
