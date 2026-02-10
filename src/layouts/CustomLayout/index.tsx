import {
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  GiftOutlined,
  LineChartOutlined,
  TeamOutlined,
  ControlOutlined,
  ApartmentOutlined,
  EnvironmentOutlined,
  CustomerServiceOutlined,
  UserSwitchOutlined,
  TransactionOutlined,
  StarOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Menu, Modal, message, theme } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, history } from 'umi';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useModel } from '@umijs/max';

const { Header, Sider, Content } = Layout;

const CustomLayout = () => {
  const [activeMainMenu, setActiveMainMenu] = useState('dashboard');
  const [activeSubMenu, setActiveSubMenu] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { initialState, setInitialState } = useModel('@@initialState');

  // 登出处理
  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // 清除本地存储
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('accessToken');
        // 清除初始状态
        setInitialState({});

        message.success('已退出登录');

        // 跳转到登录页
        history.push('/login');
      },
    });
  };

  // 菜单数据 - 电商后台
  const menuData = {
    dashboard: [
      { key: '/dashboard', label: '数据统计', icon: <LineChartOutlined /> },
    ],
    enjoy: [
      { key: '/enjoy/activities', label: '活动管理', icon: <GiftOutlined /> },
      { key: '/enjoy/activityregistration', label: '报名管理', icon: <FileTextOutlined /> },
    ],
    user: [
      { key: '/user/adminUser', label: '管理端用户', icon: <TeamOutlined /> },
      { key: '/user/wqUser', label: '小程序用户', icon: <TeamOutlined /> },
      { key: '/user/community', label: '社区管理', icon: <ApartmentOutlined /> },
      { key: '/user/userAddress', label: '收货地址', icon: <EnvironmentOutlined /> },
    ],
    mall: [
      { key: '/mall/product', label: '商品管理', icon: <ShoppingOutlined /> },
      { key: '/mall/order', label: '订单管理', icon: <FileTextOutlined /> },
      { key: '/mall/orderItem', label: '订单明细', icon: <FileTextOutlined /> },
    ],
    service: [
      { key: '/service', label: '服务管理', icon: <CustomerServiceOutlined /> },
      { key: '/service/provider', label: '服务人员', icon: <UserSwitchOutlined /> },
      { key: '/service/order', label: '服务订单', icon: <TransactionOutlined /> },
      { key: '/service/review', label: '服务评价', icon: <StarOutlined /> },
      { key: '/service/coupon', label: '服务优惠券', icon: <TagOutlined /> },
    ],
  };

  // 顶部主菜单配置
  const mainMenus = [
    { key: 'dashboard', label: '数据统计', icon: <LineChartOutlined /> },
    { key: 'enjoy', label: '娱乐中心', icon: <GiftOutlined /> },
    { key: 'user', label: '用户中心', icon: <TeamOutlined /> },
    { key: 'mall', label: '商城管理', icon: <ShoppingOutlined /> },
    { key: 'service', label: '服务管理', icon: <CustomerServiceOutlined /> },
  ];

  // 根据当前路径确定激活的菜单
  useEffect(() => {
    const path = location.pathname;

    // 确定顶部主菜单
    let foundMainMenu = 'dashboard';
    for (const [key, subMenus] of Object.entries(menuData)) {
      if (subMenus.some((item) => item.key === path)) {
        foundMainMenu = key;
        break;
      }
    }
    setActiveMainMenu(foundMainMenu);

    // 确定左侧子菜单
    const subMenus = menuData[foundMainMenu] || [];
    const foundSubMenu = subMenus.find((item) => item.key === path);
    if (foundSubMenu) {
      setActiveSubMenu(foundSubMenu.key);
    } else if (subMenus.length > 0) {
      setActiveSubMenu(subMenus[0].key);
    }
  }, [location.pathname]);

  const subMenus = menuData[activeMainMenu] || [];

  // 面包屑导航
  const getBreadcrumbItems = () => {
    const mainMenu = mainMenus.find((m) => m.key === activeMainMenu);
    const subMenu = subMenus.find((item) => item.key === activeSubMenu);

    return [
      {
        title: (
          <span style={{ color: '#666', fontSize: '14px' }}>
            <HomeOutlined style={{ marginRight: '4px' }} />
            首页
          </span>
        ),
        href: '/',
      },
      {
        title: (
          <span
            style={{ color: '#1890ff', fontSize: '14px', fontWeight: '500' }}
          >
            {mainMenu?.label}
          </span>
        ),
      },
      {
        title: (
          <span style={{ color: '#333', fontSize: '14px', fontWeight: '600' }}>
            {subMenu?.label}
          </span>
        ),
      },
    ];
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 自定义样式配置
  const customStyles = {
    layout: {
      height: '100vh',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'linear-gradient(90deg,rgb(37, 247, 124),rgb(45, 234, 234))',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      height: '80px',
      padding: '0 20px',
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    menuSection: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '28px',
    },
    sider: {
      width: 250,
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '4px 0 12px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
    },
    breadcrumbSection: {
      background: 'rgba(255,255,255,0.95)',
      padding: '12px 20px',
      margin: '0px 0px 0px 10px',
      borderRadius: '20px 0 0 0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
    },
    content: {
      margin: '0px 0px 0px 10px',
      height: 'calc(100vh - 80px)',
      width: 'calc(100% - 10px)',
      maxWidth: 'calc(100% - 10px)',
      background: 'rgba(255,255,255,0.9)',
      borderRadius: '0 0 20px 0',
      boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      overflow: 'auto',
    },
    mainMenu: {
      background: 'transparent',
      border: 'none',
      flex: 1,
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#ffffff',
    },
    subMenu: {
      background: 'transparent',
      border: 'none',
      fontSize: '14px',
      height: '100%',
    },
  };

  // 处理顶部菜单点击
  const handleMainMenuClick = ({ key }: { key: string }) => {
    setActiveMainMenu(key);
    const subMenu = menuData[key]?.[0];
    if (subMenu) {
      navigate(subMenu.key);
    }
  };

  // 处理左侧菜单点击
  const handleSubMenuClick = ({ key }: { key: string }) => {
    setActiveSubMenu(key);
    navigate(key);
  };

  return (
    <Layout style={customStyles.layout}>
      {/* 顶部导航栏 */}
      <Header style={customStyles.header}>
        {/* Logo区域 */}
        <div style={customStyles.logoSection}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            🚀
          </div>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            电商后台管理系统
          </span>
        </div>

        {/* 主菜单区域 */}
        <div style={customStyles.menuSection}>
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[activeMainMenu]}
            items={mainMenus}
            onClick={handleMainMenuClick}
            style={customStyles.mainMenu}
            triggerSubMenuAction="click"
          />
        </div>

        {/* 用户区域 */}
        <div style={customStyles.userSection}>
          <Button
            type="text"
            icon={<SettingOutlined />}
            style={{ color: '#ffffff', fontSize: '26px' }}
            title="设置"
          />
          <Button
            size="small"
            icon={<UserOutlined />}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              fontSize: '26px',
            }}
          />
          <Button
            type="text"
            icon={<LogoutOutlined />}
            style={{ color: '#ffffff', fontSize: '26px' }}
            title="退出"
            onClick={handleLogout}
          />
        </div>
      </Header>

      <Layout>
        {/* 左侧子菜单 */}
        <Sider width={customStyles.sider.width} style={customStyles.sider}>
          <Menu
            mode="inline"
            selectedKeys={[activeSubMenu]}
            items={subMenus}
            onClick={handleSubMenuClick}
            style={customStyles.subMenu}
          />
        </Sider>

        {/* 内容区域 */}
        <Layout style={{ padding: '0' }}>
          {/* 面包屑导航栏 */}
          <div style={customStyles.breadcrumbSection}>
            <Breadcrumb
              items={getBreadcrumbItems()}
              separator=">"
              style={{
                fontSize: '14px',
                fontWeight: '500',
              }}
            />
          </div>

          <Content style={customStyles.content}>
            <div
              style={{
                padding: '24px',
                minHeight: '100%',
              }}
            >
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
