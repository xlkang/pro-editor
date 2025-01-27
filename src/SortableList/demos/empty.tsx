/**
 * title: 空状态
 * description: 当没有数据时，列表显示空状态
 * compact: true
 */
import { SortableList } from '@ant-design/pro-editor';
import { useTheme } from 'antd-style';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const token = useTheme();

  return (
    <Flexbox padding={24} style={{ background: token.colorBgLayout }}>
      <SortableList />
    </Flexbox>
  );
};
