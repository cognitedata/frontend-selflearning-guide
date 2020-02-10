import React, {useState} from 'react';

export const EventForm = ({onSubmit}) => {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (!type || !description) {
      return;
    }

    onSubmit({type, description});

    setType('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="type">Event type</label>
      <input
        type="text"
        name="type"
        placeholder="Event type"
        onChange={e => setType(e.target.value)}
      />
      <label htmlFor="description">Description</label>
      <input
        type="text"
        name="description"
        placeholder="Description"
        onChange={e => setDescription(e.target.value)}
      />
      <button type="submit">Add event</button>
    </form>
  );
};
