package com.example.wq.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 服务优惠券实体
 */
@Entity
@Table(name = "wqservice_coupon", indexes = {
    @Index(name = "idx_code", columnList = "code", unique = true),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "服务优惠券实体")
public class ServiceCoupon extends AbstractHibernateBean {

    @Schema(description = "优惠券编码", example = "COUPON20240101")
    @Column(name = "code", length = 50, unique = true, nullable = false)
    private String code;

    @Schema(description = "优惠券名称", example = "新人专享优惠券")
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Schema(description = "优惠券类型：1-减免金额 2-折扣比例 3-免费服务", example = "1")
    @Column(name = "type", nullable = false)
    private Integer type;

    @Schema(description = "优惠金额（元）", example = "20.00")
    @Column(name = "amount", precision = 10, scale = 2)
    private java.math.BigDecimal amount;

    @Schema(description = "折扣比例（0-100）", example = "90")
    @Column(name = "discount_percentage")
    private Integer discountPercentage;

    // ========== 使用条件 ==========

    @Schema(description = "最低消费金额（元）", example = "100.00")
    @Column(name = "min_amount", precision = 10, scale = 2)
    private java.math.BigDecimal minAmount = java.math.BigDecimal.ZERO;

    @Schema(description = "适用服务ID列表（JSON数组，空表示全部）", example = "[\"id1\", \"id2\"]")
    @Column(name = "applicable_services", columnDefinition = "TEXT")
    private String applicableServices;

    @Schema(description = "适用服务分类列表（JSON数组，空表示全部）", example = "[\"cleaning\", \"repair\"]")
    @Column(name = "applicable_categories", columnDefinition = "TEXT")
    private String applicableCategories;

    // ========== 有效期 ==========

    @Schema(description = "开始时间", example = "2024-01-01T00:00:00")
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Schema(description = "结束时间", example = "2024-12-31T23:59:59")
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    // ========== 数量限制 ==========

    @Schema(description = "总发行量", example = "1000")
    @Column(name = "total_count")
    private Integer totalCount = 999999;

    @Schema(description = "已领取数量", example = "500")
    @Column(name = "received_count")
    private Integer receivedCount = 0;

    @Schema(description = "已使用数量", example = "200")
    @Column(name = "used_count")
    private Integer usedCount = 0;

    @Schema(description = "每人限领数量", example = "1")
    @Column(name = "per_user_limit")
    private Integer perUserLimit = 1;

    // ========== 状态 ==========

    @Schema(description = "状态：0-禁用 1-启用", example = "1")
    @Column(name = "status", nullable = false)
    private Integer status = 1;

    @Schema(description = "优惠券说明", example = "仅限首次使用")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Schema(description = "用户优惠券列表", example = "领取了该优惠券的用户")
    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserServiceCoupon> userServiceCoupons = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (get_id() == null || get_id().isEmpty()) {
            set_id(generateId());
        }
        if (this.receivedCount == null) {
            this.receivedCount = 0;
        }
        if (this.usedCount == null) {
            this.usedCount = 0;
        }
        if (this.totalCount == null) {
            this.totalCount = 999999;
        }
        if (this.perUserLimit == null) {
            this.perUserLimit = 1;
        }
        if (this.status == null) {
            this.status = 1;
        }
        if (this.minAmount == null) {
            this.minAmount = java.math.BigDecimal.ZERO;
        }
    }
}
