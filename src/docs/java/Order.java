package com.example.wq.entity;

import com.example.wq.enums.OrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.List;

/**
 * 订单实体
 */
@Entity
@Table(name = "order", indexes = {
    @Index(name = "idx_order_no", columnList = "order_no", unique = true),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "订单实体")
public class Order extends AbstractHibernateBean {

    @Schema(description = "订单编号", example = "ORD20240120123456")
    @Column(name = "order_no", length = 50, unique = true, nullable = false)
    private String orderNo;

    @Schema(description = "用户ID", example = "1703123456789_1234")
    @Column(name = "user_id", length = 64, nullable = false)
    private String userId;

    @Schema(description = "订单总金额", example = "256.00")
    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Schema(description = "订单状态", example = "0", allowableValues = {"0", "1", "2", "3", "4"})
    @Column(name = "status", nullable = false)
    private Integer status;

    // ========== 收货地址信息 ==========

    @Schema(description = "收货人姓名", example = "张三")
    @Column(name = "receiver_name", length = 50, nullable = false)
    private String receiverName;

    @Schema(description = "收货人电话", example = "13800138000")
    @Column(name = "receiver_phone", length = 20, nullable = false)
    private String receiverPhone;

    @Schema(description = "收货地址", example = "北京市朝阳区xxx街道xxx号")
    @Column(name = "receiver_address", length = 500, nullable = false)
    private String receiverAddress;

    @Schema(description = "订单备注", example = "请周末配送")
    @Column(name = "remark", length = 500)
    private String remark;

    // ========== 订单明细 ==========

    @Schema(description = "订单明细数组（JSON数组）", example = "[{\"productId\":\"xxx\",\"productName\":\"钙加维D\",\"productPrice\":128.00,\"quantity\":2,\"subtotal\":256.00}]")
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "items", columnDefinition = "json")
    private List<OrderItem> items;

    // ========== 枚举转换方法 ==========

    /**
     * 获取订单状态枚举
     */
    @Transient
    public OrderStatus getStatusEnum() {
        return OrderStatus.fromCode(this.status);
    }

    /**
     * 设置订单状态
     */
    public void setStatusEnum(OrderStatus orderStatus) {
        this.status = orderStatus != null ? orderStatus.getCode() : null;
    }

    @PrePersist
    protected void onCreate() {
        if (get_id() == null || get_id().isEmpty()) {
            set_id(generateId());
        }
        if (this.status == null) {
            this.status = OrderStatus.PENDING.getCode();
        }
    }
}
