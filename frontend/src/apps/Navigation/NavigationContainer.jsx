import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Menu, Tooltip, Divider } from 'antd';

import { useAppContext } from '@/context/appContext';

import useLanguage from '@/locale/useLanguage';

import useResponsive from '@/hooks/useResponsive';

import Integrations from '@/pages/Integrations';

import './NavigationContainer.css';

import {
  DatabaseOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TagOutlined,
  TagsOutlined,
  UserOutlined,
  CreditCardOutlined,
  MenuOutlined,
  FileOutlined,
  ShopOutlined,
  FilterOutlined,
  WalletOutlined,
  ReconciliationOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ isMobile = false }) {
  const location = useLocation();
  const { state: stateApp } = useAppContext();
  const [collapsed, setCollapsed] = useState(true); // Sidebar stays collapsed
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));
  const translate = useLanguage();
  const navigate = useNavigate();

  const items = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined style={{ color: '#fff', fontSize: 22 }} />,
      title: translate('dashboard'),
      onClick: () => navigate('/'),
    },
     {
      key: 'leads',
      icon: <DatabaseOutlined style={{ color: '#fff', fontSize: 22 }} />,
      title: translate('leads'),
      onClick: () => navigate('/customer'),
    },
    // {
    //   key: 'payment',
    //   icon: <CreditCardOutlined style={{ color: '#fff', fontSize: 22 }} />,
    //   title: translate('payments'),
    //   onClick: () => navigate('/payment'),
    // },
    {
      key: 'integrations',
      icon: <ContainerOutlined style={{ color: '#fff', fontSize: 22 }} />,
      title: translate('integrations'),
      onClick: () => navigate('/integrations'),
    },
    {
      key: 'generalSettings',
      icon: <SettingOutlined style={{ color: '#fff', fontSize: 22 }} />,
      title: translate('settings'),
      onClick: () => navigate('/settings'),
    },
    {
      key: 'about',
      icon: <ReconciliationOutlined style={{ color: '#fff', fontSize: 22 }} />,
      title: translate('about'),
      onClick: () => navigate('/about'),
    },
  ];

  useEffect(() => {
    if (location)
      if (currentPath !== location.pathname) {
        if (location.pathname === '/') {
          setCurrentPath('dashboard');
        } else setCurrentPath(location.pathname.slice(1));
      }
  }, [location, currentPath]);

  // Sidebar always collapsed, no hover expand
  return (
    <Sider
      collapsed={true}
      collapsible
      trigger={null}
      className="navigation"
      width={256}
      collapsedWidth={'3%'}
      style={{
        background: '#1778f2',
        height: '100vh',
        position: isMobile ? 'relative' : 'fixed',
        bottom: '20px',
        transition: 'all 0.2s',
        overflow: 'hidden',
        zIndex: 10,
      }}
      theme={'light'}
    >
      <Menu
        items={items}
        mode="inline"
        theme={'dark'}
        selectedKeys={[currentPath]}
        inlineCollapsed={true}
        style={{
          background: '#1778f2',
          borderRight: 0,
          paddingTop: 60,
        }}
        // Custom render for dividers and spacing
        itemRender={(item, dom) => <div style={{ marginBottom: 16 }}>{dom}</div>}
      />
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
        style={{ ['marginLeft']: 25 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={250}
        // style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
        placement={'left'}
        closable={false}
        onClose={onClose}
        open={visible}
      >
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}