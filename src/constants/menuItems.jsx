import {
 FolderOpenOutlined,
 BarChartOutlined,
 WindowsOutlined,
 ProductOutlined,
} from '@ant-design/icons';

export const menuItems = [
 {
   key: '1',
   icon: <BarChartOutlined />,
   label: 'Asosiy',
   path: '/',
 },
 {
   key: '2',
   icon: <WindowsOutlined />,
   label: 'Katigoriya',
   path: '/catigoties',
 },
 {
   key: '3',
   icon: <FolderOpenOutlined />,
   label: 'Banner',
   path: '/banners',
 },
 {
   key: '4',
   icon: <ProductOutlined />,
   label: 'Mahsulotlar',
   path: '/products',
 },
]