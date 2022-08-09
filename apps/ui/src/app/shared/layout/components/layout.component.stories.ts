import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { LayoutComponent } from './layout.component';

export default {
  title: 'LayoutComponent',
  component: LayoutComponent,
  decorators: [
    moduleMetadata({
      imports: []
    })
  ]
} as Meta<LayoutComponent>;

const Template: Story<LayoutComponent> = (args: LayoutComponent) => ({
  props: args
});

export const Primary = Template.bind({});
Primary.args = {};
