import Icon from 'components/Icon';
import { Collapse } from 'element-react';
import { memo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FAQProps {}

const FAQ: React.FC<FAQProps> = () => {
  return (
    <>
      {/* @ts-expect-error Element Component */}
      <Collapse>
        {/* @ts-expect-error Element Component */}
        <Collapse.Item
          title={
            <div className="flex justify-between items-center">
              <div>How can I use SBT ID?</div>
              <div className="mr-4">
                <Icon
                  name="dropDown"
                  color="rgba(255,255,255,0.4)"
                  height="5px"
                  width="9px"
                />
              </div>
            </div>
          }
          name="1">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed eros
            et libero vestibulum tristique. Nulla tellus enim, scelerisque vitae
            metus in, iaculis gravida libero. Proin eget felis eget sapien
            efficitur porta. Phasellus eros nisi, commodo aliquam feugiat non,
            viverra a lorem. Morbi commodo sapien et mi luctus, sed viverra
            velit fringilla. Aenean sed ipsum quam. Pellentesque consectetur
            gravida justo, at tristique sem volutpat vel.
          </div>
        </Collapse.Item>
        {/* @ts-expect-error Element Component */}
        <Collapse.Item
          title={
            <div className="flex justify-between items-center">
              <div>How can I use SBT ID?</div>
              <div className="mr-4">
                <Icon
                  name="dropDown"
                  color="rgba(255,255,255,0.4)"
                  height="5px"
                  width="9px"
                />
              </div>
            </div>
          }
          name="2">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed eros
            et libero vestibulum tristique. Nulla tellus enim, scelerisque vitae
            metus in, iaculis gravida libero. Proin eget felis eget sapien
            efficitur porta. Phasellus eros nisi, commodo aliquam feugiat non,
            viverra a lorem. Morbi commodo sapien et mi luctus, sed viverra
            velit fringilla. Aenean sed ipsum quam. Pellentesque consectetur
            gravida justo, at tristique sem volutpat vel.
          </div>
        </Collapse.Item>
      </Collapse>
    </>
  );
};

export default memo(FAQ);
