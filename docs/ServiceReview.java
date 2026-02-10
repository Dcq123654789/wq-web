package com.example.wq.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 服务评价实体
 */
@Entity
@Table(name = "wqservice_review", indexes = {
    @Index(name = "idx_order_id", columnList = "order_id", unique = true),
    @Index(name = "idx_service_id", columnList = "service_id"),
    @Index(name = "idx_provider_id", columnList = "provider_id"),
    @Index(name = "idx_user_id", columnList = "user_id")
})
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "服务评价实体")
public class ServiceReview extends AbstractHibernateBean {

    @Schema(description = "订单ID", example = "1703123456789_1234")
    @Column(name = "order_id", length = 64, unique = true, nullable = false)
    private String orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", insertable = false, updatable = false)
    private ServiceOrder order;

    @Schema(description = "用户ID", example = "1703123456789_5678")
    @Column(name = "user_id", length = 64, nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private WqUser user;

    @Schema(description = "服务ID", example = "1703123456789_9999")
    @Column(name = "service_id", length = 64, nullable = false)
    private String serviceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", insertable = false, updatable = false)
    private Service service;

    @Schema(description = "服务人员ID", example = "1703123456789_7777")
    @Column(name = "provider_id", length = 64)
    private String providerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", insertable = false, updatable = false)
    private ServiceProvider provider;

    // ========== 评分 ==========

    @Schema(description = "总分（1-5）", example = "5")
    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Schema(description = "态度评分（1-5）", example = "5")
    @Column(name = "attitude_rating")
    private Integer attitudeRating;

    @Schema(description = "质量评分（1-5）", example = "5")
    @Column(name = "quality_rating")
    private Integer qualityRating;

    @Schema(description = "守时评分（1-5）", example = "5")
    @Column(name = "punctuality_rating")
    private Integer punctualityRating;

    // ========== 评价内容 ==========

    @Schema(description = "评价文字", example = "服务很好，师傅很专业")
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Schema(description = "评价图片（JSON数组）", example = "[\"url1\", \"url2\"]")
    @Column(name = "images", columnDefinition = "TEXT")
    private String images;

    @Schema(description = "评价标签（JSON数组）", example = "[\"服务好\", \"准时\"]")
    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags;

    // ========== 追评 ==========

    @Schema(description = "追评内容", example = "使用一周后效果很好")
    @Column(name = "additional_content", columnDefinition = "TEXT")
    private String additionalContent;

    @Schema(description = "追评时间", example = "2024-02-01T10:00:00")
    @Column(name = "additional_time")
    private LocalDateTime additionalTime;

    // ========== 商家回复 ==========

    @Schema(description = "商家回复内容", example = "感谢您的评价")
    @Column(name = "reply_content", columnDefinition = "TEXT")
    private String replyContent;

    @Schema(description = "商家回复时间", example = "2024-01-26T09:00:00")
    @Column(name = "reply_time")
    private LocalDateTime replyTime;

    // ========== 状态 ==========

    @Schema(description = "是否匿名", example = "false")
    @Column(name = "is_anonymous")
    private Boolean isAnonymous = false;

    @Schema(description = "是否显示", example = "true")
    @Column(name = "is_visible")
    private Boolean isVisible = true;

    @PrePersist
    protected void onCreate() {
        if (get_id() == null || get_id().isEmpty()) {
            set_id(generateId());
        }
        if (this.isAnonymous == null) {
            this.isAnonymous = false;
        }
        if (this.isVisible == null) {
            this.isVisible = true;
        }
    }
}
