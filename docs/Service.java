package com.example.wq.entity;

import com.example.wq.enums.ServiceCategoryEnum;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 上门服务实体
 */
@Entity
@Table(name = "wqservice", indexes = {
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "上门服务实体")
public class Service extends AbstractHibernateBean {

    @Schema(description = "服务名称", example = "专业家政清洁服务")
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Schema(description = "服务分类", example = "cleaning")
    @Column(name = "category", length = 20, nullable = false)
    private String category;

    @Schema(description = "服务海报URL", example = "https://example.com/poster.jpg")
    @Column(name = "poster", length = 500)
    private String poster;

    @Schema(description = "服务图片（多张，JSON数组）", example = "[\"url1\", \"url2\"]")
    @Column(name = "images", columnDefinition = "TEXT")
    private String images;

    @Schema(description = "服务价格（元）", example = "128.00")
    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Schema(description = "是否免费", example = "false")
    @Column(name = "is_free")
    private Boolean isFree = false;

    @Schema(description = "已售数量", example = "234")
    @Column(name = "sales")
    private Integer sales = 0;

    @Schema(description = "服务描述", example = "专业的家庭清洁服务")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Schema(description = "服务规格说明（JSON格式）", example = "{\"服务时长\":\"4小时\",\"服务人数\":\"2人\"}")
    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications;

    @Schema(description = "服务评分（0-5）", example = "4.8")
    @Column(name = "rating", precision = 3, scale = 2)
    private BigDecimal rating;

    @Schema(description = "评价数量", example = "156")
    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Schema(description = "服务须知", example = "请提前24小时预约")
    @Column(name = "notice", columnDefinition = "TEXT")
    private String notice;

    @Schema(description = "服务时长（分钟）", example = "240")
    @Column(name = "duration")
    private Integer duration;

    @Schema(description = "服务人数", example = "2")
    @Column(name = "service_people")
    private Integer servicePeople;

    // ========== 枚举转换方法 ==========

    /**
     * 获取服务分类枚举
     */
    @Transient
    public ServiceCategoryEnum getCategoryEnum() {
        return ServiceCategoryEnum.fromCode(this.category);
    }

    /**
     * 设置服务分类
     */
    public void setCategoryEnum(ServiceCategoryEnum categoryEnum) {
        this.category = categoryEnum != null ? categoryEnum.getCode() : null;
    }

    @PrePersist
    protected void onCreate() {
        if (get_id() == null || get_id().isEmpty()) {
            set_id(generateId());
        }
        if (this.sales == null) {
            this.sales = 0;
        }
        if (this.reviewCount == null) {
            this.reviewCount = 0;
        }
        if (this.isFree == null) {
            this.isFree = false;
        }
    }
}
