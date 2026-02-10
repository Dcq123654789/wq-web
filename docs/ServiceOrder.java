package com.example.wq.entity;

import com.example.wq.enums.ServiceOrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 服务订单实体
 */
@Entity
@Table(name = "wqservice_order", indexes = {
    @Index(name = "idx_order_no", columnList = "order_no", unique = true),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_service_id", columnList = "service_id"),
    @Index(name = "idx_provider_id", columnList = "provider_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_booking_date", columnList = "booking_date")
})
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "服务订单实体")
public class ServiceOrder extends AbstractHibernateBean {

    @Schema(description = "订单编号", example = "SO20240120123456")
    @Column(name = "order_no", length = 50, unique = true, nullable = false)
    private String orderNo;

    // ========== 用户信息 ==========

    @Schema(description = "用户ID", example = "1703123456789_1234")
    @Column(name = "user_id", length = 64, nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private WqUser user;

    // ========== 服务信息 ==========

    @Schema(description = "服务ID", example = "1703123456789_5678")
    @Column(name = "service_id", length = 64, nullable = false)
    private String serviceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", insertable = false, updatable = false)
    private Service service;

    @Schema(description = "服务名称（冗余）", example = "专业家政清洁服务")
    @Column(name = "service_name", length = 100)
    private String serviceName;

    @Schema(description = "服务海报（冗余）", example = "https://example.com/poster.jpg")
    @Column(name = "service_poster", length = 500)
    private String servicePoster;

    // ========== 预约信息 ==========

    @Schema(description = "预约日期", example = "2024-01-25")
    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Schema(description = "预约时间段", example = "09:00-11:00")
    @Column(name = "time_slot", length = 20, nullable = false)
    private String timeSlot;

    // ========== 地址信息 ==========

    @Schema(description = "联系人姓名", example = "张三")
    @Column(name = "contact_name", length = 50, nullable = false)
    private String contactName;

    @Schema(description = "联系电话", example = "13800138000")
    @Column(name = "contact_phone", length = 20, nullable = false)
    private String contactPhone;

    @Schema(description = "省份", example = "广东省")
    @Column(name = "province", length = 50)
    private String province;

    @Schema(description = "城市", example = "深圳市")
    @Column(name = "city", length = 50)
    private String city;

    @Schema(description = "区县", example = "南山区")
    @Column(name = "district", length = 50)
    private String district;

    @Schema(description = "详细地址", example = "科技园南区XX大厦")
    @Column(name = "detail_address", length = 255, nullable = false)
    private String detailAddress;

    // ========== 价格信息 ==========

    @Schema(description = "原价（元）", example = "128.00")
    @Column(name = "original_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal originalPrice;

    @Schema(description = "实际支付金额（元）", example = "108.00")
    @Column(name = "final_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal finalPrice;

    @Schema(description = "优惠金额（元）", example = "20.00")
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Schema(description = "优惠券ID", example = "1703123456789_9999")
    @Column(name = "coupon_id", length = 64)
    private String couponId;

    // ========== 订单状态 ==========

    @Schema(description = "订单状态", example = "2")
    @Column(name = "status", nullable = false)
    private Integer status;

    // ========== 服务人员信息 ==========

    @Schema(description = "服务人员ID", example = "1703123456789_7777")
    @Column(name = "provider_id", length = 64)
    private String providerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", insertable = false, updatable = false)
    private ServiceProvider provider;

    @Schema(description = "服务人员姓名（冗余）", example = "李师傅")
    @Column(name = "provider_name", length = 50)
    private String providerName;

    @Schema(description = "服务人员电话（冗余）", example = "13900139000")
    @Column(name = "provider_phone", length = 20)
    private String providerPhone;

    // ========== 时间信息 ==========

    @Schema(description = "支付时间", example = "2024-01-20T14:30:00")
    @Column(name = "pay_time")
    private LocalDateTime payTime;

    @Schema(description = "接单时间", example = "2024-01-20T14:35:00")
    @Column(name = "accept_time")
    private LocalDateTime acceptTime;

    @Schema(description = "服务开始时间", example = "2024-01-25T09:00:00")
    @Column(name = "service_start_time")
    private LocalDateTime serviceStartTime;

    @Schema(description = "服务结束时间", example = "2024-01-25T13:00:00")
    @Column(name = "service_end_time")
    private LocalDateTime serviceEndTime;

    @Schema(description = "完成时间", example = "2024-01-25T13:00:00")
    @Column(name = "complete_time")
    private LocalDateTime completeTime;

    @Schema(description = "取消时间", example = "2024-01-20T15:00:00")
    @Column(name = "cancel_time")
    private LocalDateTime cancelTime;

    // ========== 其他 ==========

    @Schema(description = "用户备注", example = "请带专业设备")
    @Column(name = "remark", length = 500)
    private String remark;

    @Schema(description = "取消原因", example = "临时有事")
    @Column(name = "cancel_reason", length = 255)
    private String cancelReason;

    @Schema(description = "服务完成凭证图片（JSON数组）", example = "[\"url1\", \"url2\"]")
    @Column(name = "proof_images", columnDefinition = "TEXT")
    private String proofImages;

    // ========== 枚举转换方法 ==========

    /**
     * 获取订单状态枚举
     */
    @Transient
    public ServiceOrderStatus getStatusEnum() {
        return ServiceOrderStatus.fromCode(this.status);
    }

    /**
     * 设置订单状态
     */
    public void setStatusEnum(ServiceOrderStatus orderStatus) {
        this.status = orderStatus != null ? orderStatus.getCode() : null;
    }

    @PrePersist
    protected void onCreate() {
        if (get_id() == null || get_id().isEmpty()) {
            set_id(generateId());
        }
        if (this.status == null) {
            this.status = ServiceOrderStatus.PENDING.getCode();
        }
        if (this.discountAmount == null) {
            this.discountAmount = BigDecimal.ZERO;
        }
    }
}
