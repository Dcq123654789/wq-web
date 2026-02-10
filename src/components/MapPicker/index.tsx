import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Input, message, Space, Typography, Tag, Spin, Card } from 'antd';
import { EnvironmentOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * 地图选择器配置
 */
export interface MapPickerConfig {
  /** 高德地图 API Key */
  amapKey?: string;
  /** 高德地图安全密钥 */
  amapSecret?: string;
  /** 百度地图 API Key */
  bmapKey?: string;
  /** 地图类型：amap(高德) 或 bmap(百度) */
  mapType?: 'amap' | 'bmap';
  /** 默认中心点 [经度, 纬度] */
  defaultCenter?: [number, number];
  /** 默认缩放级别 */
  defaultZoom?: number;
}

/**
 * 位置信息
 */
export interface LocationInfo {
  /** 经度 */
  lng?: number;
  /** 纬度 */
  lat?: number;
  /** 详细地址 */
  address?: string;
  /** 省份 */
  province?: string;
  /** 城市 */
  city?: string;
  /** 区/县 */
  district?: string;
}

interface MapPickerProps {
  value?: LocationInfo;
  onChange?: (location: LocationInfo) => void;
  config?: MapPickerConfig;
  placeholder?: string;
  disabled?: boolean;
  modalTitle?: string;
  modalWidth?: number;
}

/**
 * 地图位置选择器组件
 *
 * 功能特性：
 * - 点击弹出地图，支持点击选点
 * - 自动获取经纬度
 * - 逆地理编码获取详细地址
 * - 支持高德地图和百度地图
 * - 支持手动输入经纬度
 */
const MapPicker: React.FC<MapPickerProps> = ({
  value = {},
  onChange,
  config = {},
  placeholder = '请选择位置',
  disabled = false,
  modalTitle = '选择位置',
  modalWidth = 800,
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [location, setLocation] = useState<LocationInfo>(value);
  const [sdkReady, setSdkReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const scriptLoadRef = useRef<boolean>(false);

  const {
    amapKey = '66a9b5f73d564c9793c2b7f5af66b01f', // 高德地图 API Key
    amapSecret = 'b1fba6caa34acc77af75197972920754', // 高德地图安全密钥
    bmapKey,
    mapType = 'amap',
    defaultCenter = [116.397428, 39.90923], // 北京天安门
    defaultZoom = 15,
  } = config;

  // 全局回调函数（用于百度地图）
  useEffect(() => {
    // @ts-ignore
    window.initBMap = () => {
      console.log('百度地图 SDK 加载完成');
      setSdkReady(true);
      setMapLoading(false);
    };
  }, []);

  // ⭐ 同步 value prop 到 location 状态（编辑时加载数据）
  useEffect(() => {
    if (value && Object.keys(value).length > 0) {
      console.log('📍 MapPicker value prop 已改变，更新 location 状态:', value);
      setLocation(value);
    }
  }, [value]);

  // 预加载地图脚本（可选，提高体验）
  useEffect(() => {
    const preloadMapScript = () => {
      if (!scriptLoadRef.current && !checkSdkReady()) {
        console.log('预加载地图脚本...');
        loadMapScript().catch((err) => {
          console.warn('预加载地图脚本失败，将在打开弹窗时重试:', err);
        });
      }
    };

    // 延迟预加载，避免阻塞页面加载
    setTimeout(preloadMapScript, 2000);
  }, []);

  // 检查 SDK 是否已加载
  const checkSdkReady = (): boolean => {
    if (mapType === 'amap') {
      // @ts-ignore
      const ready = typeof window.AMap !== 'undefined';
      console.log('高德地图 SDK 状态:', ready ? '已加载' : '未加载');
      return ready;
    } else {
      // @ts-ignore
      const ready = typeof window.BMap !== 'undefined';
      console.log('百度地图 SDK 状态:', ready ? '已加载' : '未加载');
      return ready;
    }
  };

  // 加载地图脚本
  const loadMapScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (scriptLoadRef.current) {
        console.log('地图脚本已在加载中或已加载');
        resolve();
        return;
      }

      scriptLoadRef.current = true;
      setMapLoading(true);
      setLoadError(null);

      console.log('开始加载地图脚本...');
      console.log('地图类型:', mapType);
      console.log('使用 Key:', amapKey?.substring(0, 10) + '...');

      // 高德地图安全密钥配置（必须在加载脚本之前设置）
      if (mapType === 'amap' && amapSecret) {
        // @ts-ignore
        window._AMapSecurityConfig = {
          securityJsCode: amapSecret,
        };
        console.log('高德地图安全密钥已配置');
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;

      if (mapType === 'amap') {
        // 高德地图脚本
        script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}&plugin=AMap.Geocoder`;
        console.log('高德地图脚本 URL:', script.src);
      } else {
        // 百度地图脚本
        script.src = `https://api.map.baidu.com/api?v=3.0&ak=${bmapKey}&callback=initBMap`;
        console.log('百度地图脚本 URL:', script.src);
      }

      script.onload = () => {
        console.log('地图脚本加载成功');

        // 高德地图需要额外等待 AMap 对象初始化
        if (mapType === 'amap') {
          // 延迟设置为 ready，等待 AMap 全局对象完全初始化
          setTimeout(() => {
            // @ts-ignore
            if (window.AMap) {
              console.log('高德地图 AMap 对象已就绪');
              setSdkReady(true);
            }
            setMapLoading(false);
            resolve();
          }, 500); // 额外等待 500ms
        } else {
          setSdkReady(true);
          setMapLoading(false);
          resolve();
        }
      };

      script.onerror = (e) => {
        console.error('地图脚本加载失败:', e);
        const errorMsg = mapType === 'amap'
          ? '高德地图加载失败，可能是 API Key 配置错误或网络问题'
          : '百度地图加载失败，请检查 AK 或网络连接';
        setLoadError(errorMsg);
        message.error(errorMsg);
        setMapLoading(false);
        setSdkReady(false);
        reject(new Error(errorMsg));
      };

      document.head.appendChild(script);
    });
  };

  // 初始化地图
  const initMap = async () => {
    try {
      setMapLoading(true);
      setLoadError(null);

      // 检查 SDK 是否已加载
      if (!checkSdkReady()) {
        console.log('SDK 未加载，开始加载...');
        await loadMapScript();

        // 等待 SDK 初始化 - 高德地图需要更长的初始化时间
        console.log('等待 SDK 初始化...');

        // 轮询检查 SDK 是否已加载完成
        const maxWaitTime = 10000; // 最多等待10秒
        const checkInterval = 100; // 每100ms检查一次
        let waitTime = 0;

        while (!checkSdkReady() && waitTime < maxWaitTime) {
          await new Promise(resolve => setTimeout(resolve, checkInterval));
          waitTime += checkInterval;
          console.log(`等待 SDK... ${waitTime}ms`);
        }

        if (!checkSdkReady()) {
          console.error('SDK 加载超时');
          // 不抛出错误，而是尝试继续
          console.warn('SDK 加载超时，但尝试继续初始化');
        }
      }

      // 额外等待一下，确保 SDK 完全就绪
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('开始初始化地图...');

      if (mapType === 'amap') {
        initAMap();
      } else {
        initBMap();
      }
    } catch (error: any) {
      console.error('地图初始化失败:', error);
      setLoadError(error.message || '地图初始化失败');
      message.error(error.message || '地图初始化失败');
      setMapLoading(false);
    }
  };

  // 初始化高德地图
  const initAMap = () => {
    // @ts-ignore
    const AMap = window.AMap;
    if (!AMap) {
      message.error('高德地图 SDK 未加载');
      setLoadError('高德地图 SDK 未加载，可能是 API Key 无效或网络问题');
      setMapLoading(false);
      setSdkReady(false);
      return;
    }

    console.log('初始化高德地图...');

    // 添加全局错误监听，捕获 AMap 特定错误
    const errorHandler = (event: ErrorEvent) => {
      console.error('捕获到错误:', event.message);
      if (event.message.includes('USERKEY_PLAT_NOMATCH') ||
          event.message.includes('Unimplemented type')) {
        console.warn('检测到 API Key 平台不匹配错误');
        setLoadError('API Key 配置错误：Key 可能不是 Web JS API 类型');
        setMapLoading(false);
        setSdkReady(false);
        window.removeEventListener('error', errorHandler);
      }
    };
    window.addEventListener('error', errorHandler);

    try {
      // 创建地图实例
      const map = new AMap.Map('map-container', {
        zoom: defaultZoom,
        center: (location?.lng && location?.lat) ? [location.lng, location.lat] : defaultCenter,
        viewMode: '2D',
      });

      mapRef.current = map;
      console.log('高德地图实例创建成功');

      // 添加工具栏
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
        const toolbar = new AMap.ToolBar();
        const scale = new AMap.Scale();
        map.addControl(toolbar);
        map.addControl(scale);
      });

      // 添加点击事件
      map.on('click', (e: any) => {
        console.log('地图点击事件:', e.lnglat);
        const { lng, lat } = e.lnglat;
        handleMapClick(lng, lat);
      });

      // 如果有位置，添加标记
      if (location?.lng && location?.lat) {
        addMarker([location.lng, location.lat], map);
      }

      // 初始化地理编码器
      AMap.plugin('AMap.Geocoder', () => {
        geocoderRef.current = new AMap.Geocoder();
        console.log('高德地图地理编码器初始化成功');
      });

      // 移除错误监听器
      setTimeout(() => {
        window.removeEventListener('error', errorHandler);
      }, 2000);

      setMapLoading(false);
      setLoadError(null);
    } catch (error) {
      console.error('高德地图初始化错误:', error);
      window.removeEventListener('error', errorHandler);
      throw error;
    }
  };

  // 初始化百度地图
  const initBMap = () => {
    // @ts-ignore
    const BMap = window.BMap;
    if (!BMap) {
      message.error('百度地图 SDK 未加载');
      setLoadError('百度地图 SDK 未加载');
      setMapLoading(false);
      return;
    }

    console.log('初始化百度地图...');

    try {
      const point = new BMap.Point(
        location?.lng || defaultCenter[0],
        location?.lat || defaultCenter[1]
      );

      const map = new BMap.Map('map-container');
      map.centerAndZoom(point, defaultZoom);
      map.enableScrollWheelZoom(true);

      mapRef.current = map;
      console.log('百度地图实例创建成功');

      // 添加点击事件
      map.addEventListener('click', (e: any) => {
        console.log('地图点击事件:', e.point);
        const point = e.point;
        handleMapClick(point.lng, point.lat);
      });

      // 如果有位置，添加标记
      if (location?.lng && location?.lat) {
        addBMapMarker(location.lng, location.lat, map);
      }

      // 初始化地理编码器
      // @ts-ignore
      geocoderRef.current = new BMap.Geocoder();

      setMapLoading(false);
      setLoadError(null);
    } catch (error) {
      console.error('百度地图初始化错误:', error);
      throw error;
    }
  };

  // 添加高德地图标记
  const addMarker = (position: [number, number], map?: any) => {
    const mapInstance = map || mapRef.current;
    if (!mapInstance) return;

    // @ts-ignore
    const AMap = window.AMap;

    // 移除旧标记
    if (markerRef.current) {
      mapInstance.remove(markerRef.current);
    }

    // 添加新标记
    const marker = new AMap.Marker({
      position: position,
      title: '选中位置',
    });

    mapInstance.add(marker);
    markerRef.current = marker;

    // 移动地图中心
    mapInstance.setCenter(position);
  };

  // 添加百度地图标记
  const addBMapMarker = (lng: number, lat: number, map?: any) => {
    const mapInstance = map || mapRef.current;
    if (!mapInstance) return;

    // @ts-ignore
    const BMap = window.BMap;

    // 移除旧标记
    if (markerRef.current) {
      mapInstance.removeOverlay(markerRef.current);
    }

    // 添加新标记
    const point = new BMap.Point(lng, lat);
    const marker = new BMap.Marker(point);

    mapInstance.addOverlay(marker);
    markerRef.current = marker;

    // 移动地图中心
    mapInstance.setCenter(point);
  };

  // 处理地图点击
  const handleMapClick = async (lng: number, lat: number) => {
    console.log('处理地图点击:', lng, lat);

    if (mapType === 'amap') {
      addMarker([lng, lat]);
    } else {
      addBMapMarker(lng, lat);
    }

    // 逆地理编码获取地址
    await reverseGeocode(lng, lat);
  };

  // 逆地理编码
  const reverseGeocode = async (lng: number, lat: number) => {
    try {
      console.log('开始逆地理编码...');

      if (mapType === 'amap') {
        // 高德地图逆地理编码
        if (geocoderRef.current) {
          geocoderRef.current.getAddress([lng, lat], (status: string, result: any) => {
            console.log('逆地理编码状态:', status);
            console.log('逆地理编码结果:', result);

            if (status === 'complete') {
              const addressInfo = result.regeocode.formattedAddress;
              const newLocation: LocationInfo = {
                lng,
                lat,
                address: addressInfo,
                province: result.regeocode.addressComponent?.province,
                city: result.regeocode.addressComponent?.city,
                district: result.regeocode.addressComponent?.district,
              };
              setLocation(newLocation);
              onChange?.(newLocation);
              message.success('位置已选择: ' + addressInfo);
            } else {
              message.error('地址解析失败');
            }
          });
        }
      } else {
        // 百度地图逆地理编码
        if (geocoderRef.current) {
          // @ts-ignore
          const BMap = window.BMap;
          const point = new BMap.Point(lng, lat);

          geocoderRef.current.getLocation(point, (result: any) => {
            console.log('百度逆地理编码状态:', geocoderRef.current.getStatus());
            console.log('百度逆地理编码结果:', result);

            if (geocoderRef.current.getStatus() === (window as any).BMAP_STATUS_SUCCESS) {
              const addressInfo = result.address;
              const newLocation: LocationInfo = {
                lng,
                lat,
                address: addressInfo,
                province: result.addressComponent?.province,
                city: result.addressComponent?.city,
                district: result.addressComponent?.district,
              };
              setLocation(newLocation);
              onChange?.(newLocation);
              message.success('位置已选择: ' + addressInfo);
            } else {
              message.error('地址解析失败');
            }
          });
        }
      }
    } catch (error) {
      console.error('逆地理编码失败:', error);
      message.error('地址解析失败');
    }
  };

  // 打开弹窗
  const handleOpen = () => {
    setVisible(true);
    setMapLoading(true);
    setLoadError(null);

    // 延迟初始化地图，确保 DOM 已渲染
    setTimeout(() => {
      initMap();
    }, 100);
  };

  // 确认选择
  const handleConfirm = () => {
    setVisible(false);
    if (location.address) {
      message.success('位置已保存');
    }
  };

  // 手动输入经纬度
  const handleManualInput = (field: keyof LocationInfo, val: string) => {
    const numValue = parseFloat(val);
    if (!isNaN(numValue)) {
      const newLocation = { ...location, [field]: numValue };
      setLocation(newLocation);
      onChange?.(newLocation);
    }
  };

  // 清除位置
  const handleClear = () => {
    const emptyLocation: LocationInfo = {};
    setLocation(emptyLocation);
    onChange?.(emptyLocation);
    message.info('位置已清除');
  };

  return (
    <div>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={location?.address || (location?.lng && location?.lat ? `${location.lng.toFixed(6)}, ${location.lat.toFixed(6)}` : '')}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          style={{ flex: 1 }}
          prefix={<EnvironmentOutlined />}
        />
        <Button
          type="primary"
          icon={<EnvironmentOutlined />}
          onClick={handleOpen}
          disabled={disabled}
        >
          选点
        </Button>
        {location?.lng && location?.lat && (
          <Button onClick={handleClear} disabled={disabled}>
            清除
          </Button>
        )}
      </Space.Compact>

      {/* 显示位置信息标签 */}
      {location?.lng && location?.lat && (
        <div style={{ marginTop: 8 }}>
          <Space wrap>
            <Tag color="blue" icon={<CheckCircleOutlined />}>
              经度: {location.lng?.toFixed(6)}
            </Tag>
            <Tag color="green" icon={<CheckCircleOutlined />}>
              纬度: {location.lat?.toFixed(6)}
            </Tag>
            {location?.address && (
              <Tag color="orange" icon={<CheckCircleOutlined />}>
                {location.address}
              </Tag>
            )}
          </Space>
        </div>
      )}

      <Modal
        title={modalTitle}
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleConfirm}
        width={modalWidth}
        centered
        destroyOnClose
        maskClosable={false}
        styles={{
          body: { padding: 0 },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
          {/* 地图容器或备用方案 */}
          {loadError && sdkReady === false ? (
            // 备用方案：手动输入坐标模式
            <div
              style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#f5f5f5',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 500 }}>
                <div style={{ textAlign: 'center' }}>
                  <EnvironmentOutlined style={{ fontSize: 48, color: '#667eea', marginBottom: 16 }} />
                  <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 8 }}>
                    地图 SDK 加载失败
                  </Text>
                  <Text type="secondary">
                    使用手动输入坐标模式
                  </Text>
                </div>

                <Card size="small" style={{ width: '100%' }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text strong>步骤 1：获取坐标</Text>
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          点击下方链接，在地图上找到位置，复制坐标
                        </Text>
                      </div>
                      <Space.Compact style={{ marginTop: 8, width: '100%' }}>
                        <Button
                          block
                          href="https://api.map.baidu.com/lbsapi/getpoint/index.html"
                          target="_blank"
                          type="primary"
                          ghost
                        >
                          百度坐标拾取器 ↗
                        </Button>
                        <Button
                          block
                          href="https://lbs.amap.com/tools/picker"
                          target="_blank"
                          type="default"
                        >
                          高德坐标拾取器 ↗
                        </Button>
                      </Space.Compact>
                    </div>

                    <div>
                      <Text strong>步骤 2：输入坐标</Text>
                      <Space.Compact style={{ marginTop: 8, width: '100%' }}>
                        <Input
                          addonBefore="经度"
                          placeholder="如：116.397428"
                          value={location.lng?.toString() || ''}
                          onChange={(e) => handleManualInput('lng', e.target.value)}
                        />
                        <Input
                          addonBefore="纬度"
                          placeholder="如：39.90923"
                          value={location.lat?.toString() || ''}
                          onChange={(e) => handleManualInput('lat', e.target.value)}
                        />
                      </Space.Compact>
                    </div>

                    <div>
                      <Text strong>步骤 3：输入详细地址</Text>
                      <Input.TextArea
                        placeholder="请输入详细地址，如：北京市东城区长安街1号"
                        value={location.address || ''}
                        onChange={(e) => {
                          const newLocation = { ...location, address: e.target.value };
                          setLocation(newLocation);
                          onChange?.(newLocation);
                        }}
                        rows={2}
                        style={{ marginTop: 8 }}
                      />
                    </div>

                    {location?.lng && location?.lat && (
                      <div style={{ padding: '8px', background: '#f0f0f0', borderRadius: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          已选坐标：{location.lng.toFixed(6)}, {location.lat.toFixed(6)}
                        </Text>
                      </div>
                    )}
                  </Space>
                </Card>

                <Button
                  type="primary"
                  block
                  onClick={() => {
                    setLoadError(null);
                    setMapLoading(true);
                    initMap();
                  }}
                >
                  重试加载地图 SDK
                </Button>
              </Space>
            </div>
          ) : (
            <div
              id="map-container"
              style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#f0f0f0',
                position: 'relative',
              }}
            >
            {mapLoading && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Spin
                  size="large"
                  tip="地图加载中..."
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              </div>
            )}
            {loadError && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  padding: '30px',
                }}
              >
                <div style={{ marginBottom: '16px', fontSize: '16px', color: '#ff4d4f' }}>
                  <EnvironmentOutlined style={{ fontSize: '32px' }} />
                </div>
                <div style={{ marginBottom: '12px', fontWeight: 500 }}>
                  {loadError}
                </div>
                <div style={{ marginBottom: '16px', fontSize: '13px', color: '#666' }}>
                  可能的原因：
                </div>
                <ul style={{ textAlign: 'left', fontSize: '12px', color: '#666', maxWidth: 300, margin: '0 auto' }}>
                  <li>网络连接问题</li>
                  <li>API Key 配置错误</li>
                  <li>浏览器阻止了脚本加载</li>
                </ul>
                <Button
                  type="primary"
                  onClick={() => {
                    console.log('用户点击重试');
                    setLoadError(null);
                    setMapLoading(true);
                    initMap();
                  }}
                  style={{ marginTop: '16px' }}
                >
                  重试加载地图
                </Button>
              </div>
            )}
          </div>
          )}

          {/* 位置信息面板 */}
          <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Text strong>已选位置信息：</Text>

              <Space wrap>
                <Text>经度：</Text>
                <Input
                  style={{ width: 150 }}
                  value={location?.lng?.toString() || ''}
                  onChange={(e) => handleManualInput('lng', e.target.value)}
                  placeholder="如：116.397428"
                  suffix="°"
                />
                <Text>纬度：</Text>
                <Input
                  style={{ width: 150 }}
                  value={location?.lat?.toString() || ''}
                  onChange={(e) => handleManualInput('lat', e.target.value)}
                  placeholder="如：39.90923"
                  suffix="°"
                />
                <Button
                  size="small"
                  type="default"
                  onClick={() => {
                    if (location?.lng && location?.lat) {
                      // 逆地理编码获取地址
                      reverseGeocode(location.lng, location.lat);
                    } else {
                      message.warning('请先输入经纬度');
                    }
                  }}
                >
                  根据坐标获取地址
                </Button>
              </Space>

              {location?.address && (
                <div>
                  <Text>地址：</Text>
                  <Text type="secondary">{location.address}</Text>
                </div>
              )}

              <Space>
                <Text type="secondary">
                  {location?.province && `${location.province}`}
                  {location?.city && ` - ${location.city}`}
                  {location?.district && ` - ${location.district}`}
                </Text>
              </Space>

              <Space direction="vertical" style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  💡 提示：
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  1. 点击地图上的位置可自动获取地址和坐标
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  2. 也可以手动输入经纬度，点击"根据坐标获取地址"按钮
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  3. 经度范围：-180° 到 180°，纬度范围：-90° 到 90°
                </Text>
              </Space>
            </Space>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MapPicker;
