import { Avatar, Popover, Button, Badge, Col, List } from 'antd';

// import Notifications from '@/components/Notification';

import { RocketOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function UpgradeButton() {
  const translate = useLanguage();

  return (
    <Badge count={1} size="small">
      <Button
        type="primary"
        style={{
          float: 'right',
          marginTop: '5px',
          cursor: 'pointer',
          background: '#16923e',
          boxShadow: '0 2px 0 rgb(82 196 26 / 20%)',
        }}
        icon={<RocketOutlined />}
        onClick={() => {
          window.open(`https://maximisemedia.co.in/`);
        }}
      >
        {translate('Try Entreprise Version')}
      </Button>
    </Badge>
  );
}

 
