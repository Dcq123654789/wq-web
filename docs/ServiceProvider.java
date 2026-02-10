package com.example.wq.entity;

import com.example.wq.enums.Gender;
import com.example.wq.enums.ProviderStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 服务人员实体
 */
@Entity
@Table(name = "wqservice_provider", indexes = {
    @Index(name = "idx_phone", columnList = "phone", unique = true),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "服务人员实体")
public class ServiceProvider extends AbstractHibernateBean {

    @Schema(description = "姓名", example = "李师傅")
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Schema(description = "手机号", example = "13900139000")
    @Column(name = "phone", length = 20, unique = true, nullable = false)
    private String phone;

    @Schema(description = "头像URL", example = "https://example.com/avatar.jpg")
    @Column(name = "avatar", length = 500)
    private String avatar;

    @Schema(description = "性别", example = "1")
    @Column(name = "gender")
    private Integer gender = Gender.UNKNOWN.getCode();

    @Schema(description = "出生日期", example = "1985-06-15")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Schema(description = "身份证号", example = "440301198506150000")
    @Column(name = "id_card", length = 18)
    private String idCard;

    // ========== 技能信息 ==========

    @Schema(description = "可服务的分类（JSON数组）", example = "[\"cleaning\", \"repair\"]")
    @Column(name = "categories", columnDefinition = "TEXT")
    private String categories;

    @Schema(description = "可提供的服务ID列表（JSON数组）", example = "[\"id1\", \"id2\"]")
    @Column(name = "service_ids", columnDefinition = "TEXT")
    private String serviceIds;

    // ========== 评价信息 ==========

    @Schema(description = "平均评分", example = "4.8")
    @Column(name = "rating", precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;

    @Schema(description = "评价数量", example = "156")
    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Schema(description = "完成订单数", example = "500")
    @Column(name = "order_count")
    private Integer orderCount = 0;

    // ========== 状态信息 ==========

    @Schema(description = "在线状态", example = "1")
    @Column(name = "status", nullable = false)
    private Integer status = ProviderStatus.AVAILABLE.getCode();

    @Schema(description = "当前进行中的订单ID", example = "1703123456789_1234")
    @Column(name = "current_order_id", length = 64)
    private String currentOrderId;

    // ========== 认证信息 ==========

    @Schema(description = "身份认证状态", example = "true")
    @Column(name = "id_card_verified")
    private Boolean idCardVerified = false;

    @Schema(description = "技能认证状态", example = "true")
    @Column(name = "skill_certified")
    private Boolean skillCertified = false;

    @Schema(description = "证书图片（JSON数组）", example = "[\"url1\", \"url2\"]")
    @Column(name = "certificates", columnDefinition = "TEXT")
    private String certificates;

    // ========== 其他 ==========

    @Schema(description = "个人介绍", example = "10年家政服务经验")
    @Column(name = "introduction", columnDefinition = "TEXT")
    private String introduction;

    @Schema(description = "工作年限", example = "10")
    @Column(name = "work_years")
    private Integer workYears;

    @Schema(description = "所属社区ID", example = "COMM001")
    @Column(name = "community_id", length = 64)
    private String communityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", insertable = false, updatable = false)
    private Community community;

    // ========== 关联订单 ==========

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ServiceOrder> orders = new ArrayList<>();

    // ========== 枚举转换方法 ==========

    /**
     * 获取服务人员状态枚举
     */
    @Transient
    public ProviderStatus getStatusEnum() {
        return ProviderStatus.fromCode(this.status);
    }

    /**
     * 设置服务人员状态
     */
    public void setStatusEnum(ProviderStatus providerStatus) {
        this.status = providerStatus != null ? providerStatus.getCode() : null;
    }

    /**
     * 获取性别枚举
     */
    @Transient
    public Gender getGenderEnum() {
        return Gender.fromCode(this.gender);
    }

    /**
     * 设置性别
     */
    public void setGenderEnum(Gender gender) {
        this.gender = gender != null ? gender.getCode() : Gender.UNKNOWN.getCode();
    }

    @PrePersist
    protected void onCreate() {
        if (get_id() == null || get_id().isEmpty()) {
            set_id(generateId());
        }
        if (this.reviewCount == null) {
            this.reviewCount = 0;
        }
        if (this.orderCount == null) {
            this.orderCount = 0;
        }
        if (this.rating == null) {
            this.rating = BigDecimal.ZERO;
        }
        if (this.idCardVerified == null) {
            this.idCardVerified = false;
        }
        if (this.skillCertified == null) {
            this.skillCertified = false;
        }
        if (this.status == null) {
            this.status = ProviderStatus.AVAILABLE.getCode();
        }
    }
}
