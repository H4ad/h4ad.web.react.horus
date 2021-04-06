import { Story } from '@storybook/react';
import React, { ReactElement } from 'react';

export function withDocs(component: ReactElement, description: string): Story {
  return () => <>
    <p>{description}</p>
    {component}
  </>;
}
