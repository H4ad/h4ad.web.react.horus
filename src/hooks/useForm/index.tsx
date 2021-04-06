import { ChangeEvent, useState } from 'react';

function handleEventChange<T>(preventDefault: boolean, state: T, event: ChangeEvent<HTMLInputElement>): T {
  if (preventDefault)
    event.preventDefault();

  return {
    ...state,
    [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
  };
}

export function useForm<T>(preventDefault: boolean = true, defaultState: T = {} as T): [T, (event: ChangeEvent<HTMLInputElement>) => void] {
  const [form, setForm] = useState(defaultState);

  return [form, (event) => setForm((state) => handleEventChange(preventDefault, state, event))];
}
