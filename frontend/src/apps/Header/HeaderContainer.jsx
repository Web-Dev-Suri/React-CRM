import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Badge, Button } from 'antd';
import logoIcon from '@/style/images/logo-icon.png';
import logoText from '@/style/images/logo-text.png';

// import Notifications from '@/components/Notification';

import { LogoutOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

import { FILE_BASE_URL } from '@/config/serverApiConfig';

import useLanguage from '@/locale/useLanguage';

import UpgradeButton from './UpgradeButton';

export default function HeaderContent() {

  const [logoVisible, setLogoVisible] = useState(true);

  const currentAdmin = useSelector(selectCurrentAdmin);
  const { Header } = Layout;

  const translate = useLanguage();

  const ProfileDropdown = () => {
    const navigate = useNavigate();
    return (
      <div className="profileDropdown" onClick={() => navigate('/profile')}>
        <Avatar
          size="large"
          className="last"
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          style={{
            color: '#f56a00',
            backgroundColor: currentAdmin?.photo ? 'none' : '#fde3cf',
            boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 6px 1px',
          }}
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <div className="profileDropdownInfo">
          <p>
            {currentAdmin?.name} {currentAdmin?.surname}
          </p>
          <p>{currentAdmin?.email}</p>
        </div>
      </div>
    );
  };

  const DropdownMenu = ({ text }) => {
    return <span style={{}}>{text}</span>;
  };

  const items = [
    {
      label: <ProfileDropdown className="headerDropDownMenu" />,
      key: 'ProfileDropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: <UserOutlined />,
      key: 'settingProfile',
      label: (
        <Link to={'/profile'}>
          <DropdownMenu text={translate('profile_settings')} />
        </Link>
      ),
    },
    {
      icon: <ToolOutlined />,
      key: 'settingApp',
      label: <Link to={'/settings'}>{translate('app_settings')}</Link>,
    },

    {
      type: 'divider',
    },

    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: <Link to={'/logout'}>{translate('logout')}</Link>,
    },
  ];

   return (
    <Header
      style={{
        padding: '20px 20px 20px 8px',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid #0000003a',
      }}
    >
      {/* Logo on the left */}
      <div
        className="logo"
        onClick={() => navigate('/')}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img src={logoIcon} alt="Logo" style={{ height: '40px' }} />
        <img
          src={logoText}
          alt="Logo Text"
          style={{
            height: 40,
            marginLeft: 10,
            opacity: logoVisible ? 1 : 0,
            transition: 'opacity 0.5s',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setLogoVisible(prev => !prev);
          }}
        />
      </div>

      {/* User Dropdown on the right */}
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        placement="bottomRight"
        style={{ width: '280px', float: 'right' }}
      >
        <Avatar
          className="last"
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          style={{
            color: '#f56a00',
            backgroundColor: currentAdmin?.photo ? 'none' : '#fde3cf',
            boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 10px 2px',
            cursor: 'pointer',
          }}
          size="large"
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      </Dropdown>
    </Header>
  );
}
